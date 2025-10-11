import { jwt } from "hono/jwt";

import env from "@/env";

export function clerkAuth() {
	return jwt({
		secret: env?.CLERK_JWT_PUBLIC_KEY || "", // not so elegant solution but it works
		alg: "RS256",
	});
}
