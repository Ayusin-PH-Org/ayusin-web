import { createClerkRouter } from "@/lib/create-app";
import { updateProjectHandler, updateProjectRoute } from "./update";
import { createProjectHandler, createProjectRoute } from "./create";
import {
	getProjectsByLocationHandler,
	getProjectsByLocationRoute,
} from "./getAllByLocation";
import { getProjectHandler, getProjectRoute } from "./get";
import { addCheckHandler, addCheckRoute } from "./checks";

const router = createClerkRouter()
	.basePath("/projects")
	.openapi(createProjectRoute, createProjectHandler)
	.openapi(getProjectsByLocationRoute, getProjectsByLocationHandler)
	.openapi(getProjectRoute, getProjectHandler)
	.openapi(updateProjectRoute, updateProjectHandler)
	.openapi(addCheckRoute, addCheckHandler);

export default router;
