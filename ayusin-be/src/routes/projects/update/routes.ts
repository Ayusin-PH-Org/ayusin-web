import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
import { ProjectSchema } from "../schema";

const ParamsSchema = z.object({
	projectID: z.string().describe("Project ID"),
});

const RequestBodySchema = ProjectSchema.pick({
	generalInformation: true,
	isSatisfactory: true,
	media: true,
	isVerified: true,
	communityComments: true,
	internalNotes: true,
	adminComments: true,
	observationChecklist: true,
}).partial();

const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	...ProjectSchema.shape,
});

const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const updateProjectRoute = createRoute({
	description: "Update project by projectID",
	path: "/:projectID",
	method: "patch",
	tags: ["Projects"],
	request: {
		params: ParamsSchema,
		body: jsonContentRequired(RequestBodySchema, "Fields to update"),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			SuccessResponseSchema,
			"Successfully updated project",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			ErrorResponseSchema,
			"Project not found or invalid data",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type UpdateProjectRoute = typeof updateProjectRoute;
