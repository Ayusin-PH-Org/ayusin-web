import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

/**
 * GET /projects?x&y&radius — search projects within radius of point.
 */
export const getProjectsByLocationRoute = createRoute({
	description: "Search projects within a radius of given coordinates",
	path: "/",
	method: "get",
	tags: ["Projects"],
	request: {
		query: model.getProjectsByLocationQuery,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.getProjectsByLocationResponse,
			"Projects retrieved by location",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			model.getProjectsByLocationErrorResponse,
			"Invalid query parameters",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			model.getProjectsByLocationErrorResponse,
			"Internal server error",
		),
	},
});

export type GetProjectsByLocationRoute = typeof getProjectsByLocationRoute;
