import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";
import { ParamsIDSchema } from "./model";

const tags = ["Departments"];

export const updateByID = createRoute({
	summary: "Update department",
	description: "Modify one or more fields of an existing department by its ID",
	path: "/{id}",
	method: "patch",
	tags,
	request: {
		params: ParamsIDSchema,
		body: jsonContentRequired(
			model.updateDepartmentByIDRequest,
			"The properties of department to update.",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.updateDepartmentByIDResponse,
			"The updated properties of the department.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.updateDepartmentByIDErrorResponse,
			"Error message when the department is not found.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.updateDepartmentByIDErrorResponse,
			"Error message when something wrong occured in the server.",
		),
	},
});

export type UpdateByIDRoute = typeof updateByID;
