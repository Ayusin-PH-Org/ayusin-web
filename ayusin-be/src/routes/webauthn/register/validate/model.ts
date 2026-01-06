import { z } from "zod";

const Base64URLStringSchema = z.base64url();

const AuthenticatorTransportSchema = z.enum([
	"ble",
	"hybrid",
	"internal",
	"nfc",
	"usb",
]);

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

const AuthenticatorAttestationResponseJSONSchema = z.object({
	clientDataJSON: Base64URLStringSchema,
	attestationObject: Base64URLStringSchema,
	authenticatorData: Base64URLStringSchema.optional(),
	transports: z.array(AuthenticatorTransportSchema).optional(),
	publicKeyAlgorithm: z.number().optional(), // COSEAlgorithmIdentifier
	publicKey: Base64URLStringSchema.optional(),
});

const RegistrationResponseJSONSchema = z.object({
	id: Base64URLStringSchema,
	rawId: Base64URLStringSchema,
	response: AuthenticatorAttestationResponseJSONSchema,
	authenticatorAttachment: z.enum(["platform", "cross-platform"]).optional(),
	clientExtensionResults: AuthenticationExtensionsClientOutputsSchema,
	type: PublicKeyCredentialTypeSchema,
});

export const validateChallengeRequest = z.object({
	sessionId: z.uuid(),
	registrationResponse: RegistrationResponseJSONSchema,
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
