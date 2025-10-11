import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";
import { ParamsIDSchema } from "./model";

const tags = ["department"];

export const updateByID = createRoute({
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
