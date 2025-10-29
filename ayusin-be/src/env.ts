import { z } from "zod";

const EnvSchema = z.object({
	PORT: z.string().default("3000").describe("Port"),
	LOG_LEVEL: z.string().optional().default("info").describe("Log Level"),
	CLERK_JWT_PUBLIC_KEY: z.string().describe("Clerk JWT Public Key"),
	MONGODB_URI: z.string().describe("Connection string to MongoDB"),
	AZURE_STORAGE_CONNECTION_STRING: z
		.string()
		.describe("Azure Storage connection string"),
	AZURE_STORAGE_CONTAINER_NAME: z
		.string()
		.describe("Azure Blob container name for media uploads"),
	// DATABASE_CONNECTION_STRING: z
	// 	.string()
	// 	.describe("MongoDB Connection String"),
});

export type Env = z.infer<typeof EnvSchema>;

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
	console.error("Invalid environment variables: ", result.error);
	console.error(z.flattenError(result.error));
	process.exit(1);
}

export default result.data;
