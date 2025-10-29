import mongoose from "mongoose";
import { z } from "zod";
import { objectIdValidator } from "@/lib/utils";
import { Project } from "@/db";

// General information about the project
const GeneralInformation = z.object({
	projectID: z.string(),
	contractID: z.string(),
	projectName: z.string(),
	location: z.string(),
	type: z.enum([
		"dam",
		"wall",
		"floodway",
		"pumping_station",
		"slope_protection",
		"coastal_protection",
	]),
	dpwhImplementingOffice: z.string(),
	contractor: z.string(),
	totalCost: z.number().int(),
	fundingYear: z.date(),
	yearStart: z.date(),
	yearEnd: z.date(),
	implementationStatus: z.enum(["completed", "in_progress"]),
	implementationStatusPercentage: z.number().int(),
	paymentStatus: z.enum(["paid", "partial"]),
	paymentStatusPercentage: z.number().int(),
	monitors: z.array(z.string()),
	dateOfVisit: z.date(),
});

const MediaItem = z.object({
	dateUploaded: z.date(),
	uploader: objectIdValidator,
});

const CheckItem = z.object({
	checkID: objectIdValidator,
	description: z.string(),
	status: z.boolean(),
	note: z.string(),
});

const ObservationChecklist = z.object({
	projectType: z.enum([
		"dam",
		"wall",
		"floodway",
		"pumping_station",
		"slope_protection",
		"coastal_protection",
	]),
	checks: z.array(CheckItem),
});

export const ProjectSchema = z.object({
	id: objectIdValidator,
	created_at: z.date(),
	updated_at: z.date(),
	generalInformation: GeneralInformation,
	isSatisfactory: z.boolean(),
	media: z.array(MediaItem),
	isVerified: z.boolean(),
	communityComments: z.string(),
	internalNotes: objectIdValidator,
	adminComments: objectIdValidator,
	observationChecklist: ObservationChecklist,
});

export const projectDocToZod = (project: mongoose.HydratedDocument<Project>) =>
	ProjectSchema.parse({
		id: project._id.toString(),
		created_at: project.createdAt,
		updated_at: project.updatedAt,
		generalInformation: project.generalInformation,
		isSatisfactory: project.isSatisfactory,
		media: project.media.map((m) => ({
			dateUploaded: m.dateUploaded,
			uploader: m.uploader.toString(),
		})),
		isVerified: project.isVerified,
		communityComments: project.communityComments,
		internalNotes: project.internalNotes!.toString(),
		adminComments: project.adminComments!.toString(),
		observationChecklist: {
			projectType: project.observationChecklist.projectType,
			checks: project.observationChecklist.checks.map((c) => ({
				checkID: c.checkID.toString(),
				description: c.description,
				status: c.status,
				note: c.note,
			})),
		},
	});
