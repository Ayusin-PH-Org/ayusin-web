import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Project, Comment } from "../../../db";
import { projectDocToZod } from "../schema";
import type { CreateProjectRoute } from "./routes";

export const createProjectHandler: AppRouteHandler<CreateProjectRoute> = async (
	c,
) => {
	const body = c.req.valid("json");

	try {
		// Create linked comments if provided
		const commentIDs: Record<string, any> = {};
		if (body.internalNotes) {
			const note = new Comment({
				associatedID: body.generalInformation.projectID,
				author: body.internalNotes.author,
				comment: body.internalNotes.comment,
				type: "internal_note",
			});
			await note.save();
			commentIDs.internalNotes = note._id;
		}
		if (body.adminComments) {
			const note = new Comment({
				associatedID: body.generalInformation.projectID,
				author: body.adminComments.author,
				comment: body.adminComments.comment,
				type: "admin_comment",
			});
			await note.save();
			commentIDs.adminComments = note._id;
		}
		const project = new Project({ version: 1, ...body, ...commentIDs });
		await project.save();

		return c.json(
			{ status: "success", ...projectDocToZod(project) },
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			{
				status: "error",
				description: "Creating a project failed.",
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
