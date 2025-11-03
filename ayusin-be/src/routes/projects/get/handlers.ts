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
		let internalNotesArr;
		if (project.internalNotes && project.internalNotes.length) {
			const notes = await Comment.find({
				_id: { $in: project.internalNotes },
			}).exec();
			internalNotesArr = notes.map((note) => ({
				id: note._id.toString(),
				comment: note.comment,
				author: note.author.toString(),
			}));
		}
		let adminCommentsArr;
		if (project.adminComments && project.adminComments.length) {
			const notes = await Comment.find({
				_id: { $in: project.adminComments },
			}).exec();
			adminCommentsArr = notes.map((note) => ({
				id: note._id.toString(),
				comment: note.comment,
				author: note.author.toString(),
			}));
		}
		return c.json(
			{
				status: "success",
				...base,
				internalNotes: internalNotesArr,
				adminComments: adminCommentsArr,
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
