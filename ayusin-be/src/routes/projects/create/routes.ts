import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
import { objectIdValidator } from "@/lib/utils";
import {
	GeneralInformationRequestSchema,
	MediaItemRequestSchema,
	ObservationChecklistRequestSchema,
	ProjectSchema,
	ProjectResponseSchema,
	ExampleProject,
} from "../schema";

const RequestSchema = ProjectSchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
	internalNotes: true,
	adminComments: true,
})
	.extend({
		generalInformation: GeneralInformationRequestSchema,
		media: z.array(MediaItemRequestSchema),
		internalNotes: z
			.array(z.object({ comment: z.string(), author: objectIdValidator }))
			.optional(),
		adminComments: z
			.array(z.object({ comment: z.string(), author: objectIdValidator }))
			.optional(),
		observationChecklist: ObservationChecklistRequestSchema,
	})
	.openapi({ example: ExampleProject });

const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	...ProjectResponseSchema.shape,
});

const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const createProjectRoute = createRoute({
	summary: "Create project",
	description:
		"Create a new project with detailed information including general info, media, observation checklist, and optional comments",
	path: "/",
	method: "post",
	tags: ["Projects"],
	request: {
		body: jsonContentRequired(RequestSchema, "Payload to create a new project"),
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
