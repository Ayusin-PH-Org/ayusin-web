import { createClerkRouter } from "@/lib/create-app";
import { create, createMember } from "./create/index";
import { getByUserID, getMemberByUserID } from "./getByUserID/index";
import { updateByUserID, updateMemberByUserID } from "./updateByUserID/index";
import { deleteByUserID, deleteMemberByUserID } from "./deleteByUserID";
import { connectMembersRoute, connectMembersHandler } from "./link/index";
import { unlinkMembersRoute, unlinkMembersHandler } from "./unlink/index";

const routes = createClerkRouter()
	.basePath("/members")
	.openapi(create, createMember)
	.openapi(getByUserID, getMemberByUserID)
	.openapi(updateByUserID, updateMemberByUserID)
	.openapi(deleteByUserID, deleteMemberByUserID)
	.openapi(connectMembersRoute, connectMembersHandler)
	.openapi(unlinkMembersRoute, unlinkMembersHandler);

export default routes;
