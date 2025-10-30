import { createRouter } from "@/lib/create-app";
import { uploadMediaHandler, uploadMediaRoute } from "./create";
import { deleteMediaHandler, deleteMediaRoute } from "./delete";

const router = createRouter()
	.basePath("/media")
	.openapi(uploadMediaRoute, uploadMediaHandler)
	.openapi(deleteMediaRoute, deleteMediaHandler);

export default router;
