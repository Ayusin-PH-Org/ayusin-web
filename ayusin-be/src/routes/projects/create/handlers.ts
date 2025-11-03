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
		const commentIDs: Record<string, any> = {
			internalNotes: [],
			adminComments: [],
		};
		if (body.internalNotes) {
			for (const noteReq of body.internalNotes) {
				const note = new Comment({
					associatedID: body.generalInformation.projectID,
					author: noteReq.author,
					comment: noteReq.comment,
					type: "project",
					isAdmin: false,
					isInternal: true,
				});
				await note.save();
				commentIDs.internalNotes.push(note._id);
			}
		}
		if (body.adminComments) {
			for (const noteReq of body.adminComments) {
				const note = new Comment({
					associatedID: body.generalInformation.projectID,
					author: noteReq.author,
					comment: noteReq.comment,
					type: "project",
					isAdmin: true,
					isInternal: false,
				});
				await note.save();
				commentIDs.adminComments.push(note._id);
			}
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

		// Map generalInformation.locationStr & location into GeoJSON Point
		const gi = body.generalInformation;
		const projectLocation = {
			type: "Point",
			coordinates: [gi.location.x, gi.location.y],
		};
		const projectGI = {
			...gi,
			location: projectLocation,
		};
		const {
			internalNotes,
			adminComments,
			generalInformation,
			observationChecklist: _omitChecklist,
			...rest
		} = body;
		const project = new Project({
			version: 1,
			generalInformation: projectGI,
			internalNotes: commentIDs.internalNotes,
			adminComments: commentIDs.adminComments,
			observationChecklist,
			...rest,
		});
		await project.save();

		// Build response including comment objects
		const base = projectDocToZod(project);
		return c.json(
			{
				status: "success",
				...base,
				internalNotes: body.internalNotes
					? body.internalNotes.map((noteReq, idx) => ({
							id: commentIDs.internalNotes[idx].toString(),
							comment: noteReq.comment,
							author: noteReq.author,
						}))
					: undefined,
				adminComments: body.adminComments
					? body.adminComments.map((noteReq, idx) => ({
							id: commentIDs.adminComments[idx].toString(),
							comment: noteReq.comment,
							author: noteReq.author,
						}))
					: undefined,
			},
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
