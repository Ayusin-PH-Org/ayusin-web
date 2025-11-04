import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";
import { ParamsIDSchema } from "./model";

const tags = ["Roles"];

export const getByID = createRoute({
	summary: "Get role by ID",
	description: "Retrieve details of a role by its unique ID",
	path: "/{id}",
	method: "get",
	tags,
	request: {
		params: ParamsIDSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.getRoleByIDResponse,
			"Successfully retrieved the role",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.getRoleByIDErrorResponse,
			"Role not found",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.getRoleByIDErrorResponse,
			"Internal server error when retrieving role",
		),
	},
});

export type GetByIDRoute = typeof getByID;
