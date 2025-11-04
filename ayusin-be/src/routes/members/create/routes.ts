import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Members"];

export const create = createRoute({
	summary: "Create member",
	description:
		"Add a user as a member of a department with associated role and contact details",
	path: "/",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(
			model.createMemberRequest,
			"Payload to create a new member",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.createMemberOkResponse,
			"Successfully created the member",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			model.createMemberErrorResponse,
			"Unauthorized: missing or invalid authentication",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.createMemberErrorResponse,
			"Referenced department or role not found",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			model.createMemberErrorResponse,
			"Validation error in member payload",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.createMemberErrorResponse,
			"Internal server error while creating member",
		),
	},
});

export type CreateRoute = typeof create;
