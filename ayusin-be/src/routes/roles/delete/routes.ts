import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";
import { ParamsIDSchema } from "./model";

const tags = ["role"];

export const deleteByID = createRoute({
	path: "/{id}",
	method: "delete",
	tags,
	request: {
		params: ParamsIDSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.deleteDepartmentByIDResponse,
			"The message when the role is successfully deleted.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.deleteDepartmentByIDErrorResponse,
			"Error message when the role is not found.",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.deleteDepartmentByIDErrorResponse,
			"Error message when something wrong occured in the server.",
		),
	},
});

export type DeleteByIDRoute = typeof deleteByID;
