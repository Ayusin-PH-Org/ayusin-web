import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["member"];

export const unlinkMembersRoute = createRoute({
	description: "Unlink two LGU members",
	path: "/{user_id1}/{user_id2}",
	method: "delete",
	tags,
	request: { params: model.ParamsUnlinkSchema },
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.unlinkMembersResponse,
			"Members unlinked successfully",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			model.unlinkMembersErrorResponse,
			"Unauthorized. Missing 'Authorization' header.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.unlinkMembersErrorResponse,
			"One of `user_id1` or `user_id2` not found.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.unlinkMembersErrorResponse,
			"Error when unlinking members.",
		),
	},
});

export type UnlinkMembersRoute = typeof unlinkMembersRoute;
