import mongoose from "mongoose";
import { z } from "zod";
import { Report } from "@/db";
import { objectIdValidator } from "@/lib/utils";

// TODO: Use proper float32/64 depending on db
const Location = z.object({
	x: z.number(),
	y: z.number(),
});

export const ReportSchema = z.object({
	id: objectIdValidator,
	created_at: z.date(),
	updated_at: z.date(),
	title: z.string(),
	description: z.string().optional(),
	category: z.string(),
	scope: z.enum(["Barangay", "City", "Province", "Regional", "National"]),
	labels: z.array(z.string()),
	media_links: z.array(z.string()),
	upvotes: z.number(),
	location: Location,
	report_status: z.enum([
		"NEW",
		"TRIAGED",
		"IN_PROGRESS",
		"RESOLVED",
		"REJECTED",
	]),
});

export const reportDocToZod = (report: mongoose.HydratedDocument<Report>) =>
	ReportSchema.parse({
		id: report._id.toString(),
		created_at: report.createdAt,
		updated_at: report.updatedAt,
		title: report.title,
		description: report.description ?? undefined,
		category: report.metadata.category,
		scope: report.metadata.scope,
		labels: report.labels,
		media_links: report.metadata.mediaLinks,
		upvotes: report.upvotes,
		location: {
			x: report.location.coordinates[0],
			y: report.location.coordinates[1],
		},
		report_status: report.metadata.report_status,
	});
