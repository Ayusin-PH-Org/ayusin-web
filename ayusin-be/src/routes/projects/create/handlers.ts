import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Project } from "../../../db";
import { projectDocToZod } from "../schema";
import type { CreateProjectRoute } from "./routes";

export const createProjectHandler: AppRouteHandler<CreateProjectRoute> = async (
	c,
) => {
	const body = c.req.valid("json");

	try {
		const project = new Project({ version: 1, ...body });
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
