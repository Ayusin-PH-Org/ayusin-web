import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { redis } from "bun";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";
import env from "@/env";
import type { AppRouteHandler } from "@/lib/types";
import { PublicKeyCredentialRequestOptionsJSONSchema } from "./model";
import type { GenerateAuthenticationOptionsRoute } from "./routes";

export const generateAuthenticationOpts: AppRouteHandler<
	GenerateAuthenticationOptionsRoute
> = async (c) => {
	const sessionId = crypto.randomUUID();
	const key = `session:auth:${sessionId}`;

	const options = await generateAuthenticationOptions({
		rpID: env.RPID,
		timeout: 300_000,
	});

	await redis.set(key, options.challenge, "EX", 60 * 60 * 5);
	const parsedOptions = z.parse(
		PublicKeyCredentialRequestOptionsJSONSchema,
		options,
	);

	return c.json(
		{ status: "success", sessionId, options: parsedOptions },
		HttpStatusCodes.OK,
	);
};
