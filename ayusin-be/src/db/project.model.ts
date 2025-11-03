import * as mongoose from "mongoose";
import { pointSchema } from "./point.model";

export const projectSchema = new mongoose.Schema(
	{
		generalInformation: {
			type: new mongoose.Schema(
				{
					projectID: { type: String, required: true },
					contractID: { type: String, required: true },
					projectName: { type: String, required: true },
					locationStr: { type: String, required: true },
					location: { type: pointSchema, required: true, index: "2dsphere" },
					type: {
						type: String,
						enum: [
							"dam",
							"wall",
							"floodway",
							"pumping_station",
							"slope_protection",
							"coastal_protection",
						] as const,
						required: true,
					},
					dpwhImplementingOffice: { type: String, required: true },
					contractor: { type: String, required: true },
					totalCost: { type: Number, required: true },
					fundingYear: { type: mongoose.Schema.Types.Date, required: true },
					yearStart: { type: mongoose.Schema.Types.Date, required: true },
					yearEnd: { type: mongoose.Schema.Types.Date, required: true },
					implementationStatus: {
						type: String,
						enum: ["completed", "in_progress"] as const,
						required: true,
					},
					implementationStatusPercentage: { type: Number, required: true },
					paymentStatus: {
						type: String,
						enum: ["paid", "partial"] as const,
						required: true,
					},
					paymentStatusPercentage: { type: Number, required: true },
					monitors: { type: [String], required: false },
					dateOfVisit: { type: mongoose.Schema.Types.Date, required: true },
				},
				{ _id: false },
			),
			required: true,
		},
		isSatisfactory: { type: Boolean, required: true },
		media: [
			{
				dateUploaded: { type: mongoose.Schema.Types.Date, required: true },
				uploader: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				url: { type: String, required: true },
			},
		],
		isVerified: { type: Boolean, required: true },
		communityComments: { type: String, required: false },
		internalNotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		adminComments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		observationChecklist: {
			type: new mongoose.Schema(
				{
					projectType: {
						type: String,
						enum: [
							"dam",
							"wall",
							"floodway",
							"pumping_station",
							"slope_protection",
							"coastal_protection",
						] as const,
						required: true,
					},
					checks: [
						{
							checkID: { type: mongoose.Schema.Types.ObjectId, required: true },
							description: { type: String, required: true },
							status: { type: Boolean, required: true },
							note: { type: String, required: false },
						},
					],
					extras: { type: mongoose.Schema.Types.Mixed, required: false },
				},
				{ _id: false },
			),
			required: true,
		},
	},
	{ timestamps: true },
);

export type Project = mongoose.InferSchemaType<typeof projectSchema>;
export const Project = mongoose.model("Project", projectSchema);
