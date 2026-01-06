import { createRouter } from "@/lib/create-app";
import authRouter from "./auth";
import registerRouter from "./register";

const routes = createRouter()
	.basePath("/webauthn")
	.route("/auth", authRouter)
	.route("/register", registerRouter);

export default routes;
