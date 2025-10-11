import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["member"];

export const updateByUserID = createRoute({
	path: "/{user_id}",
	method: "patch",
	tags,
	request: {
		params: model.ParamsUserIDSchema,
		body: jsonContentRequired(
			model.updateMemberByUserIDRequest,
			"The member properties to update.",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.updateMemberByUserIDResponse,
			"The updated member properties.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.updateMemberByUserIDErrorResponse,
			"Error message when the member is not found.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.updateMemberByUserIDErrorResponse,
			"Error message when something wrong occurred in the server.",
		),
	},
});

export type UpdateByUserIDRoute = typeof updateByUserID;
