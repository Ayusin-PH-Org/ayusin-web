import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { UploadMediaResponseSchema, ErrorResponseSchema } from "../schema";
import { z } from "zod";

// Routes for uploading media via multipart/form-data
export const uploadMediaRoute = createRoute({
	description: "Upload image or video to Azure Blob Storage",
	path: "/",
	method: "post",
	tags: ["Media"],
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: z.object({
						file: z
							.instanceof(File)
							.openapi({ type: "string", format: "binary" }),
					}),
				},
			},
		},
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			UploadMediaResponseSchema,
			"Successfully uploaded media",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			ErrorResponseSchema,
			"Invalid media type",
		),
		[HttpStatusCodes.BAD_GATEWAY]: jsonContent(
			ErrorResponseSchema,
			"Storage service unreachable",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type UploadMediaRoute = typeof uploadMediaRoute;
