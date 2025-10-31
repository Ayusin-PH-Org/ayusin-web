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
			.object({ comment: z.string(), author: objectIdValidator })
			.optional(),
		adminComments: z
			.object({ comment: z.string(), author: objectIdValidator })
			.optional(),
		observationChecklist: ObservationChecklistRequestSchema.extend({
			projectType: z
				.enum([
					"dam",
					"wall",
					"floodway",
					"pumping_station",
					"slope_protection",
					"coastal_protection",
				])
				.describe("Project type for the checklist"),
		}),
	})
	.refine(
		(data) => {
			const type = data.generalInformation.type;
			const key =
				type === "slope_protection"
					? "slopeProtection"
					: type === "coastal_protection"
						? "coastalProtection"
						: type;
			return !!data.observationChecklist[
				key as keyof typeof data.observationChecklist
			];
		},
		{
			path: ["observationChecklist"],
			message: "Checklist for selected project type is required",
		},
	);

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
