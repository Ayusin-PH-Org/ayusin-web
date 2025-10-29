import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
import { ProjectSchema } from "../schema";

const RequestSchema = ProjectSchema.pick({
	generalInformation: true,
	isSatisfactory: true,
	media: true,
	isVerified: true,
	communityComments: true,
	internalNotes: true,
	adminComments: true,
	observationChecklist: true,
});

const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	...ProjectSchema.shape,
});

const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const createProjectRoute = createRoute({
	description: "Create a new project",
	path: "/",
	method: "post",
	tags: ["Projects"],
	request: {
		body: jsonContentRequired(RequestSchema, "The project to create"),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			SuccessResponseSchema,
			"Successfully created a new project",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			ErrorResponseSchema,
			"Bad request data",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type CreateProjectRoute = typeof createProjectRoute;
