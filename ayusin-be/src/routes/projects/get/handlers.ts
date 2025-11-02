import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Project, Comment } from "../../../db";
import { projectDocToZod } from "../schema";
import type { GetProjectRoute } from "./routes";

export const getProjectHandler: AppRouteHandler<GetProjectRoute> = async (
	c,
) => {
	const { projectID } = c.req.valid("param");

	try {
		const project = await Project.findOne({
			"generalInformation.projectID": projectID,
		}).exec();

		if (project === null) {
			return c.json(
				{
					status: "error",
					description: "Project not found",
				},
				HttpStatusCodes.NOT_FOUND,
			);
		}

		// Build response including full comment objects
		const base = projectDocToZod(project);
		let internalNotesObj;
		if (project.internalNotes) {
			const note = await Comment.findById(project.internalNotes).exec();
			if (note) {
				internalNotesObj = {
					id: note._id.toString(),
					comment: note.comment,
					author: note.author.toString(),
				};
			}
		}
		let adminCommentsObj;
		if (project.adminComments) {
			const note = await Comment.findById(project.adminComments).exec();
			if (note) {
				adminCommentsObj = {
					id: note._id.toString(),
					comment: note.comment,
					author: note.author.toString(),
				};
			}
		}
		return c.json(
			{
				status: "success",
				...base,
				internalNotes: internalNotesObj,
				adminComments: adminCommentsObj,
			},
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			{
				status: "error",
				description: "Fetching project failed.",
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
