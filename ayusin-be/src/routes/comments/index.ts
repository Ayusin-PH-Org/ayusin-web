import { createClerkRouter } from "@/lib/create-app";
import { createCommentHandler, createCommentRoute } from "./create";
import { getAllCommentsHandler, getAllCommentsRoute } from "./getAll";

const router = createClerkRouter()
	.basePath("/comments")
	.openapi(createCommentRoute, createCommentHandler)
	.openapi(getAllCommentsRoute, getAllCommentsHandler);

export default router;
