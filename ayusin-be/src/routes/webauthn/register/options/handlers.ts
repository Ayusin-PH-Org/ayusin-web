import { init } from "@paralleldrive/cuid2";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { redis } from "bun";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";
import env from "@/env";
import type { AppRouteHandler } from "@/lib/types";
import { PublicKeyCredentialCreationOptionsSchema } from "./model";
import type { GenerateRegistrationOptionsRoute } from "./routes";

export const generateRegistrationOpts: AppRouteHandler<
	GenerateRegistrationOptionsRoute
> = async (c) => {
	const sessionId = crypto.randomUUID();
	const userIdInternal = init({ length: 10 });
	const userId = userIdInternal();
	const key = `session:reg:${sessionId}`;

	const encoder = new TextEncoder();
	const webauthnUserId = encoder.encode(userId);

	const options = await generateRegistrationOptions({
		rpID: env.RPID,
		rpName: env.RP_NAME,
		userID: webauthnUserId,
		userName: `user_${userId}`,
		attestationType: "none",
		authenticatorSelection: {
			residentKey: "preferred",
			userVerification: "preferred",
			authenticatorAttachment: "platform",
		},
		timeout: 600,
	});

	await redis.hmset(key, [
		"challenge",
		options.challenge,
		"user_id",
		`user_${userId}`,
	]);
	await redis.expire(key, 600);

	const parsedOptions = z.parse(
		PublicKeyCredentialCreationOptionsSchema,
		options,
	);

	return c.json(
		{ status: "success", sessionId, options: parsedOptions },
		HttpStatusCodes.OK,
	);
};
