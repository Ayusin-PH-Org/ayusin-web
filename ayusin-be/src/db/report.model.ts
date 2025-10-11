import * as mongoose from "mongoose";
import { pointSchema } from "./point.model";

export const reportSchema = new mongoose.Schema(
	{
		version: { type: Number, required: true },
		title: { type: String, required: true },
		description: { type: String, required: false },
		labels: { type: [String], required: true },
		location: {
			type: pointSchema,
			required: true,
			index: "2dsphere",
		},
		logs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ReportLog",
			},
		],
		upvotes: { type: Number, required: true, default: 0 },
		downvotes: { type: Number, required: true, default: 0 },
		metadata: {
			type: new mongoose.Schema({
				mediaLinks: { type: [String], required: true },
				scope: {
					type: String,
					// Cast as const so TS has hints to narrow Report.metadata.scope as enum instead of widening back to string
					enum: [
						"Barangay",
						"City",
						"Province",
						"Regional",
						"National",
					] as const,
					required: true,
				},
				category: { type: String, required: true },
				dateClosed: { type: mongoose.Schema.Types.Date, required: false },
				assignedDepartmentIDs: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: "Department",
					},
				],
				assignedPersonnelIDs: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
					},
				],
				report_status: {
					type: String,
					enum: ["NEW", "TRIAGED", "IN_PROGRESS", "RESOLVED", "REJECTED"],
					required: true,
					default: "NEW",
				},
			}),
			required: true,
		},
	},
	{ timestamps: true },
);

export type Report = mongoose.InferSchemaType<typeof reportSchema>;
export const Report = mongoose.model("Report", reportSchema);
