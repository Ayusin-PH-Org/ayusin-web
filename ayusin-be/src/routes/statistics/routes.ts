import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

const AggregateResultSchema = z.object({
	total: z.int(),
	new: z.int().describe("Total reports with status NEW"),
	triaged: z.int().describe("Total reports with status TRIAGED"),
	in_progress: z.int().describe("Total reports with status IN_PROGRESS"),
	resolved: z.int().describe("Total reports with status RESOLVED"),
	rejected: z.int().describe("Total reports with status REJECTED"),
	avg_resol_time: z
		.number()
		// dateClosed should never be greater than createdAt
		.positive()
		.describe("Average resolution time of resolved reports"),
});

const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	...AggregateResultSchema.shape,
});

const ErrorResponseSchema = z.object({
	status: z.literal("error"),
	description: z.string(),
});

const QueryParamsSchema = z
	.object({
		department: z.string().describe("Filter by department ID"),
		category: z.string().describe("Filter by category"),
		scope: z.string().describe("Filter by scope"),
		severity: z.string().describe("Filter by severity"),
		location: z
			.string()
			.refine(
				(s) => {
					const halves = s.split(",");
					if (halves.length !== 2) return false;
					const [x, y] = halves.map(Number);
					if (Number.isNaN(x) || Number.isNaN(y)) return false;
					return true;
				},
				{
					message: "location must follow the format '<number>,<number>'",
				},
			)
			.transform((s) => {
				const [x, y] = s.split(",").map(Number);
				return { x: x, y: y };
			})
			.describe("Location coordinate (longitude:x, latitude:y)"),
	})
	.partial();

export type QueryParams = z.infer<typeof QueryParamsSchema>;

export const getReportStatisticsRoute = createRoute({
	description: "Get Report Statistics",
	path: "/",
	method: "get",
	request: {
		query: QueryParamsSchema,
	},
	tags: ["Statistics"],
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			SuccessResponseSchema,
			"Get report statistics",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			ErrorResponseSchema,
			"Unauthorized request",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			ErrorResponseSchema,
			"Internal server error",
		),
	},
});

export type GetReportStatisticsRoute = typeof getReportStatisticsRoute;
