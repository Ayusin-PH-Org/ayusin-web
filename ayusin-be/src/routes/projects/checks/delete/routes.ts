import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";
import { ProjectSchema } from "../../schema";

const ParamsSchema = z.object({
	projectId: z.string().describe("Project identifier"),
	checkId: z.string().describe("Checklist item identifier to delete"),
});

const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	...ProjectSchema.shape,
});

const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const deleteCheckRoute = createRoute({
	summary: "Remove a checklist item from a project",
	description:
		"Delete an existing check entry from a project's observation checklist",
	path: "/:projectId/checks/:checkId",
	method: "delete",
	tags: ["Projects"],
	request: {
		params: ParamsSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			SuccessResponseSchema,
			"Project record with the checklist item removed",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			ErrorResponseSchema,
			"Project or checklist item not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type DeleteCheckRoute = typeof deleteCheckRoute;
