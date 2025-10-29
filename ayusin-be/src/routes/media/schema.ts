import { z } from "zod";

export const UploadMediaResponseSchema = z.object({
	type: z.enum(["image", "video"]),
	url: z.string().url(),
	fileSize: z.number().int(),
});

export const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const DeleteMediaRequestSchema = z.object({
	url: z.string().url(),
});

export const DeleteMediaResponseSchema = z.object({
	status: z.literal("success"),
});
