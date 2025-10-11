import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["department", "member"];

export const getAllMembersRoute = createRoute({
	description: "Get all LGU members for a department",
	path: "/{department_id}/members",
	method: "get",
	tags,
	request: { params: model.ParamsDepartmentIDSchema },
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.SuccessResponseSchema,
			"Successfully retrieved members",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			model.ErrorResponseSchema,
			"Unauthorized request",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type GetAllMembersRoute = typeof getAllMembersRoute;
