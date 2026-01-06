import {
	type RegistrationResponseJSON,
	verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { redis } from "bun";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { User } from "@/db";
import env from "@/env";
import type { AppRouteHandler } from "@/lib/types";
import generateTokens from "../../jwt";
import type { ValidateRegistrationRoute } from "./routes";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const validateRegistration: AppRouteHandler<
	ValidateRegistrationRoute
> = async (c) => {
	const body = c.req.valid("json");
	const sessionId = body.sessionId;
	const registrationResponse: RegistrationResponseJSON =
		body.registrationResponse;
	const key = `session:reg:${sessionId}`;
	const [expectedChallenge, userId] = await redis.hmget(key, [
		"challenge",
		"user_id",
	]);

	if (expectedChallenge == null || userId == null) {
		return c.json(
			{ status: "error", description: "Session ID expired." },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	const validationResponse = await verifyRegistrationResponse({
		response: registrationResponse,
		expectedChallenge,
		expectedOrigin: env.EXPECTED_ORIGINS,
		expectedRPID: env.EXPECTED_RPID,
		requireUserVerification: env.REQUIRE_USER_VERIFICATION,
	});

	if (validationResponse.verified) {
		await redis.del(key);
		const credential = validationResponse.registrationInfo.credential;

		const user = new User({
			userID: userId,
			credentialID: credential.id,
			counter: credential.counter,
			publicKey: credential.publicKey,
			transports: credential.transports,
			type: "citizen",
		});

		await user.save();

		const ttlAccessToken = 15 * MINUTE;
		const ttlRefreshToken = 7 * DAY;

		const ttlAccessTokenDate = Math.floor(Date.now() / 1000) + ttlAccessToken;
		const ttlRefreshTokenDate = Math.floor(Date.now() / 1000) + ttlRefreshToken;

		const { accessToken, refreshToken } = await generateTokens(
			userId,
			ttlAccessTokenDate,
			ttlRefreshTokenDate,
		);

		await redis.set(
			`refresh_token:${userId}`,
			refreshToken,
			"EX",
			ttlRefreshToken,
		);

		return c.json(
			{ status: "success", accessToken, refreshToken },
			HttpStatusCodes.OK,
		);
	} else {
		return c.json(
			{
				status: "error",
				description:
					"Webauthn authentication failed due to mismatch from expected challenge.",
			},
			HttpStatusCodes.UNAUTHORIZED,
		);
	}
};
