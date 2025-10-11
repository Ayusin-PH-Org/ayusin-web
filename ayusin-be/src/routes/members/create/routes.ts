import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["member"];

export const create = createRoute({
	path: "/",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(
			model.createMemberRequest,
			"The member to create",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.createMemberOkResponse,
			"Success response",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			model.createMemberErrorResponse,
			"Unauthorized. Missing 'Authorization' header.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.createMemberErrorResponse,
			"Either the `department_id` or `role_id` is not found.",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			model.createMemberErrorResponse,
			"'role' must be of type string.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.createMemberErrorResponse,
			"Error message when something wrong occurred in the server.",
		),
	},
});

export type CreateRoute = typeof create;
