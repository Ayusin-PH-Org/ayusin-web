import * as HttpStatusCodes from "stoker/http-status-codes";
import { Project } from "@/db/project.model";
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

		const parsed = projects.map((p) => ({ ...projectDocToZod(p) }));
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
