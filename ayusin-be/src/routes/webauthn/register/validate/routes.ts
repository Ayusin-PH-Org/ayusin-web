import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Webauthn"];

export const validateRegistrationRoute = createRoute({
	summary: "Validate registration",
	description: "Validate Webauthn registration based from the given challenge.",
	path: "/validate",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(
			model.validateChallengeRequest,
			"JSON Response from webauthn challenge with session ID.",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.validateRegistrationOkResponse,
			"Successfully validated registration based from the given challenge thru webauthn.",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			model.validateRegistrationErrorResponse,
			"Webauthn authentication failed due to mismatch from expected challenge.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			model.validateRegistrationErrorResponse,
			"Validation for registration failed due to expired session ID.",
		),
	},
});

export type ValidateRegistrationRoute = typeof validateRegistrationRoute;
