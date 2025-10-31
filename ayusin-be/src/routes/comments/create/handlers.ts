import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Comment } from "@/db";
import * as model from "./model";
import type { CreateCommentRoute } from "./routes";

export const createCommentHandler: AppRouteHandler<CreateCommentRoute> = async (
	c,
) => {
	const body = c.req.valid("json");

	try {
		const comment = new Comment({
			associatedID: body.associatedID,
			author: body.author,
			comment: body.comment,
			type: body.type,
		});

		await comment.save();

		return c.json(
			{
				status: "success",
				id: comment._id.toString(),
				created_at: comment.createdAt,
				updated_at: comment.updatedAt,
				associatedID: comment.associatedID,
				author: comment.author.toString(),
				comment: comment.comment,
				type: comment.type,
				is_internal: comment.isInternal,
				is_admin: comment.isAdmin,
			},
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			model.createCommentErrorResponse.parse({
				status: "error",
				description: "Creating comment failed",
			}),
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
