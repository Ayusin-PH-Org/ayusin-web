import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Project } from "../../../../db";
import { projectDocToZod } from "../../schema";
import type { DeleteCheckRoute } from "./routes";

export const deleteCheckHandler: AppRouteHandler<DeleteCheckRoute> = async (
	c,
) => {
	const { projectId, checkId } = c.req.valid("param");
	try {
		const project = await Project.findOne({
			"generalInformation.projectID": projectId,
		}).exec();
		if (project === null) {
			return c.json(
				{ status: "error", description: "Project not found" },
				HttpStatusCodes.UNPROCESSABLE_ENTITY,
			);
		}

		const initialLen = project.observationChecklist.checks.length;
		project.observationChecklist.checks =
			project.observationChecklist.checks.filter(
				(chk) => chk.checkID.toString() !== checkId,
			);
		if (project.observationChecklist.checks.length === initialLen) {
			return c.json(
				{ status: "error", description: "Checklist item not found" },
				HttpStatusCodes.UNPROCESSABLE_ENTITY,
			);
		}

		await project.save();

		return c.json(
			{ status: "success", ...projectDocToZod(project) },
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			{ status: "error", description: "Deleting checklist item failed." },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
