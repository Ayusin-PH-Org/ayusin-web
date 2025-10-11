import { createClerkRouter } from "@/lib/create-app";
import { create, createDepartment } from "./create/index";
import { deleteByID, deleteDepartmentByID } from "./delete/index";
import { getByID, getDepartmentByID } from "./getByID/index";
import { updateByID, updateDepartmentByID } from "./updateByID/index";
import {
	getAllMembersRoute,
	getAllMembersHandler,
} from "./members/getAll/index";

const routes = createClerkRouter()
	.basePath("/departments")
	.openapi(create, createDepartment)
	.openapi(getByID, getDepartmentByID)
	.openapi(updateByID, updateDepartmentByID)
	.openapi(deleteByID, deleteDepartmentByID)
	.openapi(getAllMembersRoute, getAllMembersHandler);

export default routes;
