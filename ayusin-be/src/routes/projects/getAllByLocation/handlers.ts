import * as HttpStatusCodes from "stoker/http-status-codes";
import { Comment, Project } from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import { projectDocToZod } from "../schema";
import * as model from "./model";
import type { GetProjectsByLocationRoute } from "./routes";

export const getProjectsByLocationHandler: AppRouteHandler<
	GetProjectsByLocationRoute
> = async (c) => {
	const { x, y, radius } = c.req.valid("query");

	try {
		const radiusInKM = radius * 1000;
		const projects = await Project.find({
			"generalInformation.location": {
				$nearSphere: {
					$geometry: {
						type: "Point",
						coordinates: [x, y],
					},
					$maxDistance: radiusInKM,
				},
			},
		}).exec();

		// Build response including comment objects
		const parsed = await Promise.all(
			projects.map(async (p) => {
				const base = projectDocToZod(p);
				let internalNotesObj;
				if (p.internalNotes) {
					const note = await Comment.findById(p.internalNotes).exec();
					if (note) {
						internalNotesObj = {
							id: note._id.toString(),
							comment: note.comment,
							author: note.author.toString(),
						};
					}
				}
				let adminCommentsObj;
				if (p.adminComments) {
					const note = await Comment.findById(p.adminComments).exec();
					if (note) {
						adminCommentsObj = {
							id: note._id.toString(),
							comment: note.comment,
							author: note.author.toString(),
						};
					}
				}
				return {
					...base,
					internalNotes: internalNotesObj,
					adminComments: adminCommentsObj,
				};
			}),
		);
		return c.json(
			{
				status: "success",
				projects: parsed,
			},
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			model.getProjectsByLocationErrorResponse.parse({
				status: "error",
				description: "Fetching projects by location failed",
			}),
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
