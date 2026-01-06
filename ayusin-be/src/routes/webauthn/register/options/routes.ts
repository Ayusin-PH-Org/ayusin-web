import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Webauthn"];

export const generateRegistrationOptionsRoute = createRoute({
	summary: "Generate registration options",
	description: "Generates Webauthn registration options.",
	path: "/options",
	method: "post",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.generateRegistrationOptionsOkResponse,
			"Successfully generated registration options thru webauthn.",
		),
	},
});

export type GenerateRegistrationOptionsRoute =
	typeof generateRegistrationOptionsRoute;
