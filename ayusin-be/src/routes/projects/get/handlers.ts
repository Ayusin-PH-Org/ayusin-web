import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Project } from "../../../db";
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

		return c.json(
			{ status: "success", ...projectDocToZod(project) },
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
