import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["member"];

export const getByUserID = createRoute({
	path: "/{user_id}",
	method: "get",
	tags,
	request: { params: model.ParamsUserIDSchema },
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.getMemberByUserIDResponse,
			"The retrieved member.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.getMemberByUserIDErrorResponse,
			"Member not found.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.getMemberByUserIDErrorResponse,
			"Error message when something wrong occurred in the server.",
		),
	},
});

export type GetByUserIDRoute = typeof getByUserID;
