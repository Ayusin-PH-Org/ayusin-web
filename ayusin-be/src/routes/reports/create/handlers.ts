import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Report } from "../../../db";
import { reportDocToZod } from "../schema";
import type { CreateReportRoute } from "./routes";

export const createReportHandler: AppRouteHandler<CreateReportRoute> = async (
	c,
) => {
	const body = c.req.valid("json");

	try {
		const report = new Report({
			version: 1,
			title: body.title,
			description: body.description,
			location: {
				type: "Point",
				coordinates: [body.location.x, body.location.y],
			},
			metadata: {
				scope: body.scope,
				category: body.category,
			},
		});

		await report.save();

		return c.json(
			{ status: "success", ...reportDocToZod(report) },
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			{
				status: "error",
				description: "Creating a report failed.",
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
