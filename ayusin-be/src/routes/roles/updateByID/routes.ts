import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";
import { ParamsIDSchema } from "./model";

const tags = ["role"];

export const updateByID = createRoute({
	path: "/{id}",
	method: "patch",
	tags,
	request: {
		params: ParamsIDSchema,
		body: jsonContentRequired(
			model.updateRoleByIDRequest,
			"The properties of role to update.",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.updateRoleByIDResponse,
			"The updated properties of the role.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.updateRoleByIDErrorResponse,
			"Error message when the role is not found.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.updateRoleByIDErrorResponse,
			"Error message when something wrong occured in the server.",
		),
	},
});

export type UpdateByIDRoute = typeof updateByID;
