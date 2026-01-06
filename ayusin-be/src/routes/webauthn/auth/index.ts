import { createRouter } from "@/lib/create-app";
import {
	generateAuthenticationOptionsRoute,
	generateAuthenticationOpts,
} from "./options";
import {
	validateAuthentication,
	validateAuthenticationRoute,
} from "./validate";

const authRouter = createRouter()
	.openapi(generateAuthenticationOptionsRoute, generateAuthenticationOpts)
	.openapi(validateAuthenticationRoute, validateAuthentication);

export default authRouter;
