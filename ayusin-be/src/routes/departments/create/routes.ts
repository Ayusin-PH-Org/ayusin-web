import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["department"];

export const create = createRoute({
	path: "/",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(
			model.createDepartmentRequest,
			"The department to create",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.createDepartmentOkResponse,
			"The created department.",
		),
	},
});

export type CreateRoute = typeof create;
