import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as model from "./model";

const tags = ["Webauthn"];

export const generateAuthenticationOptionsRoute = createRoute({
	summary: "Generate authentication options",
	description: "Generates Webauthn authentication options.",
	path: "/options",
	method: "post",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			model.generateAuthenticationOptionsOkResponse,
			"Successfully generated authentication options thru webauthn.",
		),
	},
});

export type GenerateAuthenticationOptionsRoute =
	typeof generateAuthenticationOptionsRoute;
