import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Members"];

export const deleteByUserID = createRoute({
	summary: "Delete member",
	description: "Remove a member record by their user ID",
	path: "/{user_id}",
	method: "delete",
	tags,
	request: { params: model.ParamsUserIDSchema },
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.deleteMemberByUserIDResponse,
			"Successfully deleted member",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.deleteMemberByUserIDErrorResponse,
			"Member not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.deleteMemberByUserIDErrorResponse,
			"Internal server error while deleting member",
		),
	},
});

export type DeleteByUserIDRoute = typeof deleteByUserID;
