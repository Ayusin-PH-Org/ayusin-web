import {
	type AuthenticatorTransportFuture,
	verifyAuthenticationResponse,
	type WebAuthnCredential,
} from "@simplewebauthn/server";
import { redis } from "bun";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { User } from "@/db";
import env from "@/env";
import type { AppRouteHandler } from "@/lib/types";
import generateTokens from "../../jwt";
import type { ValidateAuthenticationRoute } from "./routes";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const validateAuthentication: AppRouteHandler<
	ValidateAuthenticationRoute
> = async (c) => {
	const { sessionId, authResponse } = c.req.valid("json");
	const key = `session:auth:${sessionId}`;
	const expectedChallenge = await redis.get(key);
	const encoder = new TextEncoder();

	if (expectedChallenge == null) {
		return c.json(
			{ status: "error", description: "Session ID expired." },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	const passkey = await User.findOne({
		credentialID: authResponse.id,
	});

	if (!passkey) {
		return c.json(
			{
				status: "error",
				description: `Webauthn authentication failed: Missing passkey from ${authResponse.id}. Please generate this by registering first.`,
			},
			HttpStatusCodes.UNAUTHORIZED,
		);
	}

	const userId = passkey.userID;

	const credential: WebAuthnCredential = {
		id: passkey.id,
		publicKey: encoder.encode(passkey.publicKey ?? ""),
		transports: (passkey.transports ?? [
			"internal",
		]) as AuthenticatorTransportFuture[],
		counter: passkey.counter ?? 0,
	};

	const { verified, authenticationInfo } = await verifyAuthenticationResponse({
		response: authResponse,
		expectedChallenge,
		expectedOrigin: env.EXPECTED_ORIGINS,
		expectedRPID: env.EXPECTED_RPID,
		credential,
		requireUserVerification: env.REQUIRE_USER_VERIFICATION,
	});

	if (verified) {
		await redis.del(key);

		await User.updateOne(
			{
				credentialID: passkey,
			},
			{
				$set: {
					counter: authenticationInfo.newCounter,
				},
			},
		);

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
