import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
import { CheckStatus, ProjectSchema } from "../../schema";

const UpdateParamsSchema = z.object({
	projectId: z.string().describe("Project identifier"),
	checkId: z.string().describe("Checklist item identifier to update"),
});

/** Payload for updating a checklist item */
const UpdateCheckRequestSchema = CheckStatus.describe(
	"Updated checklist item description, status, and optional internal notes",
);

const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	...ProjectSchema.shape,
});

const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const updateCheckRoute = createRoute({
	summary: "Update a checklist item in a project",
	description:
		"Modify an existing check entry in a project's observation checklist",
	path: "/:projectId/checks/:checkId",
	method: "patch",
	tags: ["Projects"],
	request: {
		params: UpdateParamsSchema,
		body: jsonContentRequired(
			UpdateCheckRequestSchema,
			"Checklist item fields to update",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			SuccessResponseSchema,
			"Project record with updated checklist item",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			ErrorResponseSchema,
			"Project or checklist item not found or invalid data",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type UpdateCheckRoute = typeof updateCheckRoute;
