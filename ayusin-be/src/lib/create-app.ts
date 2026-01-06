import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { clerkAuth } from "@/middleware/clerk-auth";
import { pinoLogger } from "@/middleware/pino-logger";
import type { AppBindings, AppOpenAPI } from "./types";

export function createRouter() {
	return new OpenAPIHono<AppBindings>({
		strict: false,
		defaultHook,
	});
}

export function createClerkRouter() {
	const app = new OpenAPIHono<AppBindings>({
		strict: false,
		defaultHook,
	});
	app.use("*", clerkAuth());
	return app;
}

export default function createApp() {
	const app = createRouter();
	app.use(
		"/api/*",
		cors({
			origin: ["https://ayusin.ph", "http://localhost:3000"],
			allowHeaders: ["Content-Type", "Authorization", "Cookie"],
			credentials: true,
		}),
	);
	app.use(serveEmojiFavicon("📝"));
	app.use(pinoLogger());

	app.notFound(notFound);
	app.onError(onError);
	return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
	return createApp().route("/", router);
}
