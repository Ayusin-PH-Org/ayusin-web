import { z } from "zod";

const Base64URLStringSchema = z.base64url();

const PublicKeyCredentialTypeSchema = z.literal("public-key");

const AuthenticationExtensionsClientOutputsSchema = z.object({
	appid: z.boolean().optional(),
	credProps: z
		.object({
			rk: z.boolean().optional(),
		})
		.optional(),
	hmacCreateSecret: z.boolean().optional(),
});

const AuthenticatorAssertionResponseJSONSchema = z.object({
	clientDataJSON: Base64URLStringSchema,
	authenticatorData: Base64URLStringSchema,
	signature: Base64URLStringSchema,
	userHandle: Base64URLStringSchema.optional(),
});

const AuthenticationResponseJSONSchema = z.object({
	id: Base64URLStringSchema,
	rawId: Base64URLStringSchema,
	response: AuthenticatorAssertionResponseJSONSchema,
	authenticatorAttachment: z.enum(["platform", "cross-platform"]).optional(),
	clientExtensionResults: AuthenticationExtensionsClientOutputsSchema,
	type: PublicKeyCredentialTypeSchema,
});

export const validateChallengeRequest = z.object({
	sessionId: z.uuid(),
	authResponse: AuthenticationResponseJSONSchema,
});

export const validateRegistrationOkResponse = z.object({
	status: z.literal("success"),
	accessToken: z.string(),
	refreshToken: z.string(),
});

export const validateRegistrationErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});
