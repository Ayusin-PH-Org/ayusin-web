import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";
import { ParamsIDSchema } from "./model";

const tags = ["Roles"];

export const updateByID = createRoute({
	summary: "Update role",
	description: "Modify one or more attributes of an existing role by its ID",
	path: "/{id}",
	method: "patch",
	tags,
	request: {
		params: ParamsIDSchema,
		body: jsonContentRequired(
			model.updateRoleByIDRequest,
			"Payload to update the role",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.updateRoleByIDResponse,
			"Successfully updated the role",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.updateRoleByIDErrorResponse,
			"Role not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.updateRoleByIDErrorResponse,
			"Internal server error when updating role",
		),
	},
});

export type UpdateByIDRoute = typeof updateByID;
