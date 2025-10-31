import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

export const createCommentRoute = createRoute({
	description: "Create a new comment",
	path: "/",
	method: "post",
	tags: ["Comments"],
	request: {
		body: jsonContentRequired(
			model.createCommentRequest,
			"The comment to create",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.createCommentOkResponse,
			"The created comment",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			model.createCommentErrorResponse,
			"Unauthorized request",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			model.createCommentErrorResponse,
			"Bad request data",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.createCommentErrorResponse,
			"Internal server error",
		),
	},
});

export type CreateCommentRoute = typeof createCommentRoute;
