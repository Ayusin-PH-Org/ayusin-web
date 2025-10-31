import { createClerkRouter } from "@/lib/create-app";
import { createCommentHandler, createCommentRoute } from "./create";

const router = createClerkRouter()
	.basePath("/comments")
	.openapi(createCommentRoute, createCommentHandler);

export default router;
