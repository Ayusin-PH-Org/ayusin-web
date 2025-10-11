import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import type { JwtVariables } from "hono/jwt";

export interface AppBindings {
	Variables: {
		logger: PinoLogger;
		jwt: JwtVariables;
	};
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;

export enum Role {
	ADMIN = "org:admin",
	USER = "user",
}
