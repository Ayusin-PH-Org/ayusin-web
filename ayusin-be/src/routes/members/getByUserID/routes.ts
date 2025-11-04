import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Members"];

export const getByUserID = createRoute({
	summary: "Get member by user ID",
	description: "Fetch the member record associated with the given user ID",
	path: "/{user_id}",
	method: "get",
	tags,
	request: { params: model.ParamsUserIDSchema },
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.getMemberByUserIDResponse,
			"Successfully retrieved member",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.getMemberByUserIDErrorResponse,
			"Member not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.getMemberByUserIDErrorResponse,
			"Internal server error while fetching member",
		),
	},
});

export type GetByUserIDRoute = typeof getByUserID;
