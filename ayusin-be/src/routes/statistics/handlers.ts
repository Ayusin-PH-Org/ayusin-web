import * as HttpStatusCodes from "stoker/http-status-codes";
import { Report } from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import { GetReportStatisticsRoute, QueryParams } from "./routes";
import { isNullOrUndefined } from "@/lib/utils";
import { FilterQuery } from "mongoose";

function createAggregatePipelineFromQueryParams(q: QueryParams) {
	// Unfortunately, Mongoose sets FilterQuery<any>
	const matches: FilterQuery<any> = {};

	// TODO: No department matching yet for mock reports
	if (!isNullOrUndefined(q.department))
		matches["metadata.assignedDepartmentIDs"] = q.department;

	if (!isNullOrUndefined(q.scope)) matches["metadata.scope"] = q.scope;

	if (!isNullOrUndefined(q.category)) matches["metadata.category"] = q.category;

	// TODO: Huh? this hasn't yet been implemented within Report.model.ts
	// if (!isNullOrUndefined(q.severity)) matches["metadata.severity"] = q.severity;

	// TODO: Implement this!
	if (!isNullOrUndefined(q.location)) null;

	return {
		$match: matches,
	};
}

export const getReportStatisticsHandler: AppRouteHandler<
	GetReportStatisticsRoute
> = async (c) => {
	try {
		const queryParams = c.req.valid("query");
		// Explore more optimal aggregation techniques
		const byReportStatus = await Report.aggregate([
			createAggregatePipelineFromQueryParams(queryParams),
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
		]);

		const byResolTime = await Report.aggregate([
			createAggregatePipelineFromQueryParams(queryParams),
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
		]);

		const result = {
			total: byReportStatus[0]?.total ?? 0,
			new: byReportStatus[0]?.new ?? 0,
			triaged: byReportStatus[0]?.triaged ?? 0,
			in_progress: byReportStatus[0]?.in_progress ?? 0,
			resolved: byReportStatus[0]?.resolved ?? 0,
			rejected: byReportStatus[0]?.rejected ?? 0,
			avg_resol_time: byResolTime[0]?.avg_resol_time ?? null,
		};

		return c.json(
			{
				status: "success",
				...result,
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
