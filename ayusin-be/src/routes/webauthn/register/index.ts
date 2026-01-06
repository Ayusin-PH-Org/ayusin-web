import { createRouter } from "@/lib/create-app";
import {
	generateRegistrationOptionsRoute,
	generateRegistrationOpts,
} from "./options";
import { validateRegistration, validateRegistrationRoute } from "./validate";

const registerRouter = createRouter()
	.openapi(generateRegistrationOptionsRoute, generateRegistrationOpts)
	.openapi(validateRegistrationRoute, validateRegistration);

export default registerRouter;
