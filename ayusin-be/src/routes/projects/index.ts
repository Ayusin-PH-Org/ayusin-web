import { createClerkRouter } from "@/lib/create-app";
import { updateProjectHandler, updateProjectRoute } from "./update";
import { createProjectHandler, createProjectRoute } from "./create";
import {
	getProjectsByLocationHandler,
	getProjectsByLocationRoute,
} from "./getAllByLocation";
import { getProjectHandler, getProjectRoute } from "./get";

const router = createClerkRouter()
	.basePath("/projects")
	.openapi(createProjectRoute, createProjectHandler)
	.openapi(getProjectsByLocationRoute, getProjectsByLocationHandler)
	.openapi(getProjectRoute, getProjectHandler)
	.openapi(updateProjectRoute, updateProjectHandler);

export default router;
