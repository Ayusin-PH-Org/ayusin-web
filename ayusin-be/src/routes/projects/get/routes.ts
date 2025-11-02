import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";
import { ProjectSchema, ProjectResponseSchema } from "../schema";

const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	...ProjectResponseSchema.shape,
});

const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

const ParamsSchema = z.object({
	projectID: z.string().describe("Project ID"),
});

export const getProjectRoute = createRoute({
	description: "Get project by projectID",
	path: "/:projectID",
	method: "get",
	tags: ["Projects"],
	request: {
		params: ParamsSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			SuccessResponseSchema,
			"Successfully retrieved project",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			ErrorResponseSchema,
			"Project not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type GetProjectRoute = typeof getProjectRoute;
