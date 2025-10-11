import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["member"];

export const deleteByUserID = createRoute({
	path: "/{user_id}",
	method: "delete",
	tags,
	request: { params: model.ParamsUserIDSchema },
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.deleteMemberByUserIDResponse,
			"Member successfully deleted.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.deleteMemberByUserIDErrorResponse,
			"Error message when the member is not found.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.deleteMemberByUserIDErrorResponse,
			"Error message when something wrong occurred in the server.",
		),
	},
});

export type DeleteByUserIDRoute = typeof deleteByUserID;
