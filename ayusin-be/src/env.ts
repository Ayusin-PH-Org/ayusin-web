import { z } from "zod";

const EnvSchema = z.object({
	PORT: z.string().default("3000").describe("Port").optional(),
	LOG_LEVEL: z.string().optional().default("info").describe("Log Level"),
	CLERK_JWT_PUBLIC_KEY: z.string().describe("Clerk JWT Public Key"),
	MONGODB_URI: z.string().describe("Connection string to MongoDB"),
	AZURE_STORAGE_CONNECTION_STRING: z
		.string()
		.describe("Azure Storage connection string"),
	AZURE_STORAGE_CONTAINER_NAME: z
		.string()
		.describe("Azure Blob container name for media uploads"),
	JWT_ACCESS_SECRET: z
		.string()
		.describe("Secret when signing for JWT access token."),
	JWT_REFRESH_SECRET: z
		.string()
		.describe(
			"Secret when refreshing for a new JWT pair of access-refresh token.",
		),
	RPID: z
		.string()
		.describe("Root domain of the backend, hosting the webauthn routes."),
	RP_NAME: z
		.string()
		.describe(
			"Human-readable name when saving credentials in the frontend for webauthn.",
		),
	EXPECTED_RPID: z
		.string()
		.describe("Expected RPID to be expected by webauthn validator."),
	EXPECTED_ORIGINS: z
		.string()
		.transform((origins) => origins.split(","))
		.describe(
			"Comma-separated list of expected origins from the frontend to be expected by webauthn validator.",
		),
	REQUIRE_USER_VERIFICATION: z
		.string()
		.transform((input) => input.toLowerCase() === "true")
		.describe("Requires user verification when validating webauthn response."),
});

export type Env = z.infer<typeof EnvSchema>;

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
	console.error("Invalid environment variables: ", result.error);
	console.error(z.flattenError(result.error));
	process.exit(1);
}

export default result.data;
