import * as HttpStatusCodes from "stoker/http-status-codes";
import { Report } from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import { GetReportStatisticsRoute } from "./routes";

export const getReportStatisticsHandler: AppRouteHandler<
	GetReportStatisticsRoute
> = async (c) => {
	try {
		const byReportStatus = await Report.aggregate([
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					new: {
						$sum: {
							$cond: [{ $eq: ["$metadata.report_status", "NEW"] }, 1, 0],
						},
					},
					triaged: {
						$sum: {
							$cond: [{ $eq: ["$metadata.report_status", "TRIAGED"] }, 1, 0],
						},
					},

					in_progress: {
						$sum: {
							$cond: [
								{ $eq: ["$metadata.report_status", "IN_PROGRESS"] },
								1,
								0,
							],
						},
					},
					resolved: {
						$sum: {
							$cond: [{ $eq: ["$metadata.report_status", "RESOLVED"] }, 1, 0],
						},
					},
					rejected: {
						$sum: {
							$cond: [{ $eq: ["$metadata.report_status", "REJECTED"] }, 1, 0],
						},
					},
				},
			},
			{ $unset: "_id" },
		]);

		const byResolTime = await Report.aggregate([
			{
				$match: {
					"metadata.dateClosed": { $exists: true },
					"metadata.report_status": "RESOLVED",
				},
			},
			{
				$group: {
					_id: null,
					avg_resol_time: {
						$avg: {
							$subtract: ["$metadata.dateClosed", "$createdAt"],
						},
					},
				},
			},
			{ $unset: "_id" },
		]);

		return c.json(
			{
				status: "success",
				payload: { ...byReportStatus[0], ...byResolTime[0] },
			},
			HttpStatusCodes.OK,
		);
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
