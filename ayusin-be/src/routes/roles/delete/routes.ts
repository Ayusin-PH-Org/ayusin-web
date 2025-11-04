import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";
import { ParamsIDSchema } from "./model";

const tags = ["Roles"];

export const deleteByID = createRoute({
	summary: "Delete role",
	description: "Remove an existing role by its ID",
	path: "/{id}",
	method: "delete",
	tags,
	request: {
		params: ParamsIDSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.deleteRoleByIDResponse,
			"Successfully deleted the role",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.deleteRoleByIDErrorResponse,
			"Role not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.deleteRoleByIDErrorResponse,
			"Internal server error when deleting role",
		),
	},
});

export type DeleteByIDRoute = typeof deleteByID;
