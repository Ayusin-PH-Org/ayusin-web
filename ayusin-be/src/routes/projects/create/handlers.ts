import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import mongoose from "mongoose";
import { Comment, Project } from "../../../db";
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
				type: "project",
				isAdmin: false,
				isInternal: true,
			});
			await note.save();
			commentIDs.internalNotes = note._id;
		}
		if (body.adminComments) {
			const note = new Comment({
				associatedID: body.generalInformation.projectID,
				author: body.adminComments.author,
				comment: body.adminComments.comment,
				type: "project",
				isAdmin: true,
				isInternal: false,
			});
			await note.save();
			commentIDs.adminComments = note._id;
		}
		// Build Mongoose checks array from the checklist template
		const ocReq = body.observationChecklist;
		const { projectType } = ocReq;
		const checklistTemplate = (ocReq as any)[projectType] as Record<
			string,
			{ status: boolean; internalNotes?: string }
		> | null;
		const checks: {
			checkID: mongoose.Types.ObjectId;
			description: string;
			status: boolean;
			note: string;
		}[] = [];
		if (checklistTemplate) {
			for (const [description, { status, internalNotes }] of Object.entries(
				checklistTemplate,
			)) {
				checks.push({
					checkID: new mongoose.Types.ObjectId(),
					description,
					status,
					note: internalNotes ?? "",
				});
			}
		}
		const observationChecklist = { projectType, checks };

		const { observationChecklist: _omit, ...restBody } = body;
		const project = new Project({
			version: 1,
			...restBody,
			...commentIDs,
			observationChecklist,
		});
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
