import { createClerkRouter } from "@/lib/create-app";
import { uploadMediaHandler, uploadMediaRoute } from "./create";

const router = createClerkRouter()
	.basePath("/media")
	.openapi(uploadMediaRoute, uploadMediaHandler);

export default router;
