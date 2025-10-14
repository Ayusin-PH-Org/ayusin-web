import * as HttpStatusCodes from "stoker/http-status-codes";
import { Report } from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import { GetReportStatisticsRoute } from "./routes";

export const getReportStatisticsHandler: AppRouteHandler<
	GetReportStatisticsRoute
> = async (c) => {
	try {
		throw new Error();
		return c.json({ status: "success" }, HttpStatusCodes.OK);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			{
				status: "error",
				description: "Fetching a report failed.",
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
