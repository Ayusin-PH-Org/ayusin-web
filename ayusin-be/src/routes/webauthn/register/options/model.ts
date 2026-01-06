import { z } from "zod";

export const Base64URLSchema = z.base64url().openapi({
	type: "string",
	format: "byte",
	description: "Binary data automatically converted to a Base64URL string",
	example: "YmFzZTY0dXJsLWNoYWxsZW5nZQ",
});

const AuthenticatorTransportSchema = z.enum([
	"ble",
	"hybrid",
	"internal",
	"nfc",
	"usb",
]);
const AttestationConveyancePreferenceSchema = z.enum([
	"none",
	"indirect",
	"direct",
	"enterprise",
]);
const ResidentKeyRequirementSchema = z.enum([
	"discouraged",
	"preferred",
	"required",
]);
const UserVerificationRequirementSchema = z.enum([
	"discouraged",
	"preferred",
	"required",
]);

const PublicKeyCredentialRpEntitySchema = z.object({
	id: z.string().optional(),
	name: z.string(),
});

const PublicKeyCredentialUserEntitySchema = z.object({
	id: Base64URLSchema,
	name: z.string(),
	displayName: z.string(),
});

const PublicKeyCredentialParametersSchema = z.object({
	alg: z.number(), // COSEAlgorithmIdentifier
	type: z.literal("public-key"),
});

const AuthenticatorSelectionCriteriaSchema = z.object({
	authenticatorAttachment: z.enum(["cross-platform", "platform"]).optional(),
	requireResidentKey: z.boolean().optional(),
	residentKey: ResidentKeyRequirementSchema.optional(),
	userVerification: UserVerificationRequirementSchema.optional(),
});

const PublicKeyCredentialDescriptorSchema = z.object({
	id: Base64URLSchema,
	transports: z.array(AuthenticatorTransportSchema).optional(),
	type: z.literal("public-key"),
});

const AuthenticationExtensionsPRFValuesSchema = z.object({
	first: Base64URLSchema,
	second: Base64URLSchema.optional(),
});

const AuthenticationExtensionsPRFInputsSchema = z.object({
	eval: AuthenticationExtensionsPRFValuesSchema.optional(),
	evalByCredential: z
		.record(z.string(), AuthenticationExtensionsPRFValuesSchema)
		.optional(),
});

const AuthenticationExtensionsLargeBlobInputsSchema = z.object({
	read: z.boolean().optional(),
	support: z.string().optional(),
	write: Base64URLSchema.optional(),
});

const AuthenticationExtensionsClientInputsSchema = z.object({
	appid: z.string().optional(),
	credProps: z.boolean().optional(),
	credentialProtectionPolicy: z.string().optional(),
	enforceCredentialProtectionPolicy: z.boolean().optional(),
	hmacCreateSecret: z.boolean().optional(),
	largeBlob: AuthenticationExtensionsLargeBlobInputsSchema.optional(),
	minPinLength: z.boolean().optional(),
	prf: AuthenticationExtensionsPRFInputsSchema.optional(),
});

export const PublicKeyCredentialCreationOptionsSchema = z.object({
	rp: PublicKeyCredentialRpEntitySchema,
	user: PublicKeyCredentialUserEntitySchema,
	challenge: Base64URLSchema,
	pubKeyCredParams: z.array(PublicKeyCredentialParametersSchema),
	timeout: z.number().optional(),
	excludeCredentials: z.array(PublicKeyCredentialDescriptorSchema).optional(),
	authenticatorSelection: AuthenticatorSelectionCriteriaSchema.optional(),
	attestation: AttestationConveyancePreferenceSchema.optional(),
	extensions: AuthenticationExtensionsClientInputsSchema.optional(),
});

export const generateRegistrationOptionsOkResponse = z.object({
	status: z.literal("success"),
	sessionId: z.uuid(),
	options: PublicKeyCredentialCreationOptionsSchema,
});
