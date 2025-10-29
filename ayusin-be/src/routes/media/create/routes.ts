import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { UploadMediaResponseSchema, ErrorResponseSchema } from "../schema";

export const uploadMediaRoute = createRoute({
	description: "Upload image or video to Azure Blob Storage",
	path: "/",
	method: "post",
	tags: ["Media"],
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			UploadMediaResponseSchema,
			"Successfully uploaded media",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			ErrorResponseSchema,
			"Invalid media type",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type UploadMediaRoute = typeof uploadMediaRoute;
