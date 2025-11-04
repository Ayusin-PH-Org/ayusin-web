import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Roles"];

export const create = createRoute({
	summary: "Create role",
	description:
		"Create a new role defining name, description, importance, clearance level, and access scope",
	path: "/",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(
			model.createRoleRequest,
			"Role payload to create",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.createRoleOkResponse,
			"Successfully created the role",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.createRoleErrorResponse,
			"Internal server error when creating role",
		),
	},
});

export type CreateRoute = typeof create;
