import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["member"];

export const connectMembersRoute = createRoute({
	description: "Connect two LGU members",
	path: "/{user_id1}/{user_id2}",
	method: "post",
	tags,
	request: { params: model.ParamsConnectSchema },
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.connectMembersResponse,
			"Members connected successfully",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			model.connectMembersErrorResponse,
			"Unauthorized. Missing 'Authorization' header.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.connectMembersErrorResponse,
			"One of `user_id1` or `user_id2` not found.",
		),
		[HttpStatusCodes.CONFLICT]: jsonContent(
			model.connectMembersErrorResponse,
			"Members already connected.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.connectMembersErrorResponse,
			"Error when connecting members.",
		),
	},
});

export type ConnectMembersRoute = typeof connectMembersRoute;
