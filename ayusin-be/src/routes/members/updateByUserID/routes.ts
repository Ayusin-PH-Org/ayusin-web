import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Members"];

export const updateByUserID = createRoute({
	summary: "Update member",
	description: "Update details of an existing member by their user ID",
	path: "/{user_id}",
	method: "patch",
	tags,
	request: {
		params: model.ParamsUserIDSchema,
		body: jsonContentRequired(
			model.updateMemberByUserIDRequest,
			"Fields to update for the member",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.updateMemberByUserIDResponse,
			"Successfully updated member",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.updateMemberByUserIDErrorResponse,
			"Member not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.updateMemberByUserIDErrorResponse,
			"Internal server error while updating member",
		),
	},
});

export type UpdateByUserIDRoute = typeof updateByUserID;
