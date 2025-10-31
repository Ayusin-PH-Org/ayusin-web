import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

/**
 * GET /comments - Retrieve comments by type and associated ID with optional filters.
 */

export const getAllCommentsRoute = createRoute({
	description: "Get all comments for a given project or report",
	path: "/:associatedID",
	method: "get",
	tags: ["Comments"],
	request: {
		params: model.getCommentsParams,
		query: model.getCommentsQuery,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.getCommentsResponse,
			"Successfully retrieved comments",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.getCommentsErrorResponse,
			"Associated project or report not found",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			model.getCommentsErrorResponse,
			"Bad request data",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.getCommentsErrorResponse,
			"Internal server error",
		),
	},
});

export type GetAllCommentsRoute = typeof getAllCommentsRoute;
