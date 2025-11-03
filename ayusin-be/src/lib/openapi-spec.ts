import { Scalar } from "@scalar/hono-api-reference";
//@ts-expect-error since we're using bun runtime anyways.
import packageMetadata from "../../package.json";
import type { AppOpenAPI } from "./types";

export default function configureOpenAPI(app: AppOpenAPI) {
	app.doc("/openapi.json", {
		openapi: "3.0.0",
		info: {
			version: packageMetadata.version,
			title: "Ayusin PH Backend API",
		},
	});

	app.get(
		"/docs",
		Scalar({
			theme: "deepSpace",
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "axios",
			},
			spec: {
				url: "/openapi.json",
			},
		}),
	);
}
