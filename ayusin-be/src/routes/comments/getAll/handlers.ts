import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Comment } from "@/db/comment.model";
import { Project } from "@/db/project.model";
import { Report } from "@/db/report.model";
import * as model from "./model";
import type { GetAllCommentsRoute } from "./routes";

export const getAllCommentsHandler: AppRouteHandler<
	GetAllCommentsRoute
> = async (c) => {
	// Extract path parameter and query filters
	const { associatedID } = c.req.valid("param");
	const { type, author, is_internal, is_admin } = c.req.valid("query");

	try {
		// Validate associated resource exists

		// Validate associated resource exists
		if (type === "project") {
			const project = await Project.findOne({
				"generalInformation.projectID": associatedID,
			}).exec();
			if (!project) {
				return c.json(
					model.getCommentsErrorResponse.parse({
						status: "error",
						description: "Project not found",
					}),
					HttpStatusCodes.NOT_FOUND,
				);
			}
		} else {
			const report = await Report.findById(associatedID).exec();
			if (!report) {
				return c.json(
					model.getCommentsErrorResponse.parse({
						status: "error",
						description: "Report not found",
					}),
					HttpStatusCodes.NOT_FOUND,
				);
			}
		}

		// Build comment query
		const query: any = { type, associatedID };
		if (author) query.author = author;
		if (is_internal !== undefined) query.isInternal = is_internal;
		if (is_admin !== undefined) query.isAdmin = is_admin;

		const comments = await Comment.find(query).exec();

		const parsed = comments.map((cm) =>
			model.getCommentsResponse.shape.comments.parse({
				id: cm._id.toString(),
				created_at: cm.createdAt,
				updated_at: cm.updatedAt,
				associatedID: cm.associatedID,
				author: cm.author.toString(),
				comment: cm.comment,
				type: cm.type,
				is_internal: cm.isInternal,
				is_admin: cm.isAdmin,
			}),
		);

		return c.json(
			model.getCommentsResponse.parse({ status: "success", comments: parsed }),
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			model.getCommentsErrorResponse.parse({
				status: "error",
				description: "Fetching comments failed",
			}),
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
