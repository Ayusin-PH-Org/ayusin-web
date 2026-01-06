import { z } from "zod";

const Base64URLStringSchema = z.base64url();

const AuthenticatorTransportSchema = z.enum([
	"ble",
	"hybrid",
	"internal",
	"nfc",
	"usb",
]);

const PublicKeyCredentialDescriptorJSONSchema = z.object({
	id: Base64URLStringSchema,
	transports: z.array(AuthenticatorTransportSchema).optional(),
	type: z.literal("public-key"),
});

const AuthenticationExtensionsPRFValuesJSONSchema = z.object({
	first: Base64URLStringSchema,
	second: Base64URLStringSchema.optional(),
});

const AuthenticationExtensionsPRFInputsJSONSchema = z.object({
	eval: AuthenticationExtensionsPRFValuesJSONSchema.optional(),
	evalByCredential: z
		.record(z.string(), AuthenticationExtensionsPRFValuesJSONSchema)
		.optional(),
});

const AuthenticationExtensionsLargeBlobInputsJSONSchema = z.object({
	read: z.boolean().optional(),
	support: z.string().optional(),
	write: Base64URLStringSchema.optional(),
});

const AuthenticationExtensionsClientInputsJSONSchema = z.object({
	appid: z.string().optional(),
	credProps: z.boolean().optional(),
	largeBlob: AuthenticationExtensionsLargeBlobInputsJSONSchema.optional(),
	prf: AuthenticationExtensionsPRFInputsJSONSchema.optional(),
});

export const PublicKeyCredentialRequestOptionsJSONSchema = z.object({
	rpId: z.string().optional(),
	hints: z.array(z.string()).optional(),
	userVerification: z.string().optional(),
	challenge: Base64URLStringSchema,
	allowCredentials: z.array(PublicKeyCredentialDescriptorJSONSchema).optional(),
	timeout: z.number().optional(),
	extensions: AuthenticationExtensionsClientInputsJSONSchema.optional(),
});

export const generateAuthenticationOptionsOkResponse = z.object({
	status: z.literal("success"),
	sessionId: z.uuid(),
	options: PublicKeyCredentialRequestOptionsJSONSchema,
});

// export const deleteRoleByIDErrorResponse = z.object({
// 	status: z.literal("error"),
// 	description: z.string(),
// });
