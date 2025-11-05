import { z } from "zod";

/** Response schema for successfully uploaded media */
export const UploadMediaResponseSchema = z
	.object({
		type: z
			.enum(["image", "video"])
			.describe("Type of the uploaded media")
			.openapi({ example: "image" }),
		url: z
			.string()
			.url()
			.describe("Public URL of the uploaded media resource")
			.openapi({
				example: "https://storage.example.com/container/image-uuid.png",
			}),
		fileSize: z
			.number()
			.int()
			.describe("Size of the uploaded file in bytes")
			.openapi({ example: 348759 }),
	})
	.describe("Metadata for a successfully uploaded media item");

/** Standard error response schema */
export const ErrorResponseSchema = z
	.object({
		status: z.literal("error").describe("Indicates failure status"),
		description: z
			.string()
			.describe("Error message describing the failure")
			.openapi({ example: "Invalid media type" }),
	})
	.describe("Standard error response format");

/** Request schema for deleting an existing media resource */
export const DeleteMediaRequestSchema = z
	.object({
		url: z
			.string()
			.url()
			.describe("Public URL of the media to delete")
			.openapi({
				example: "https://storage.example.com/container/image-uuid.png",
			}),
	})
	.describe("Payload to delete a media item by its URL");

/** Response schema for a successful media deletion */
export const DeleteMediaResponseSchema = z
	.object({
		status: z
			.literal("success")
			.describe("Indicates successful deletion of the media"),
	})
	.describe("Acknowledges successful removal of a media item");
