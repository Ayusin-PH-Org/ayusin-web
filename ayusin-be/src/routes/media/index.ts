import { createClerkRouter } from "@/lib/create-app";
import { deleteMediaHandler, deleteMediaRoute } from "./delete";
import { uploadMediaHandler, uploadMediaRoute } from "./create";

const router = createClerkRouter()
	.basePath("/media")
	.openapi(uploadMediaRoute, uploadMediaHandler)
	.openapi(deleteMediaRoute, deleteMediaHandler);

export default router;
