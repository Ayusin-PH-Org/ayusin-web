import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { isNullOrUndefined } from "@/lib/utils";
import { Project } from "../../../db";
import { projectDocToZod } from "../schema";
import type { UpdateProjectRoute } from "./routes";

export const updateProjectHandler: AppRouteHandler<UpdateProjectRoute> = async (
	c,
) => {
	const { projectID } = c.req.valid("param");
	const patch = c.req.valid("json");

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
				HttpStatusCodes.UNPROCESSABLE_ENTITY,
			);
		}

		if (!isNullOrUndefined(patch.generalInformation)) {
			project.set("generalInformation", patch.generalInformation);
		}
		if (!isNullOrUndefined(patch.isSatisfactory)) {
			project.set("isSatisfactory", patch.isSatisfactory);
		}
		if (!isNullOrUndefined(patch.media)) {
			project.set("media", patch.media);
		}
		if (!isNullOrUndefined(patch.isVerified)) {
			project.set("isVerified", patch.isVerified);
		}
		if (!isNullOrUndefined(patch.communityComments)) {
			project.set("communityComments", patch.communityComments);
		}
		if (!isNullOrUndefined(patch.internalNotes)) {
			project.set("internalNotes", patch.internalNotes);
		}
		if (!isNullOrUndefined(patch.adminComments)) {
			project.set("adminComments", patch.adminComments);
		}
		if (!isNullOrUndefined(patch.observationChecklist)) {
			project.set("observationChecklist", patch.observationChecklist);
		}

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
				description: "Updating project failed.",
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
