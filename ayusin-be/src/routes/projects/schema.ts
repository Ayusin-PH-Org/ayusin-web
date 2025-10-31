import type mongoose from "mongoose";
import { z } from "zod";
import type { Project } from "@/db";
import { objectIdValidator } from "@/lib/utils";

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
	totalCost: z.number(),
	fundingYear: z.iso.datetime(),
	yearStart: z.iso.date(),
	yearEnd: z.iso.date(),
	implementationStatus: z.enum(["completed", "in_progress"]),
	implementationStatusPercentage: z.number().int().min(0).max(100),
	paymentStatus: z.enum(["paid", "partial"]),
	paymentStatusPercentage: z.number().int().min(0).max(100),
	monitors: z.array(z.string()),
	dateOfVisit: z.iso.date(),
});

const MediaItem = z.object({
	dateUploaded: z.iso.date(),
	uploader: objectIdValidator,
	url: z.url(),
});

const CheckItem = z.object({
	checkID: objectIdValidator,
	description: z.string(),
	status: z.boolean(),
	note: z.string(),
});

// API-only checklist templates matching src/db/checklist.json
const CheckStatus = z.object({
	status: z.boolean(),
	internalNotes: z.string().optional(),
});

export const DamChecklistRequestSchema = z
	.object({
		visible: CheckStatus,
		noCracks: CheckStatus,
		spillwayNotBlocked: CheckStatus,
		noOverflow: CheckStatus,
		accessRoads: CheckStatus,
		servesPurpose: CheckStatus,
	})
	.optional();

export const WallChecklistRequestSchema = z
	.object({
		stable: CheckStatus,
		heightAppropriate: CheckStatus,
		noErosion: CheckStatus,
		hasProperSlope: CheckStatus,
		notClogged: CheckStatus,
	})
	.optional();

export const SlopeProtectionChecklistRequestSchema = z
	.object({
		stonesIntact: CheckStatus,
		noFreshErosion: CheckStatus,
		channelWidthAdequate: CheckStatus,
		flowDirectionNatural: CheckStatus,
		protectsRoads: CheckStatus,
		maintainance: CheckStatus,
	})
	.optional();

export const CoastalProtectionChecklistRequestSchema = z
	.object({
		structureIntact: CheckStatus,
		noCracks: CheckStatus,
		noUndercutting: CheckStatus,
		properMaterials: CheckStatus,
		protectsCoastalHomes: CheckStatus,
		areaNotEroded: CheckStatus,
	})
	.optional();

export const ObservationChecklistRequestSchema = z.object({
	dam: DamChecklistRequestSchema,
	wall: WallChecklistRequestSchema,
	slopeProtection: SlopeProtectionChecklistRequestSchema,
	coastalProtection: CoastalProtectionChecklistRequestSchema,
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
	// Optional flags for additional observation types
	floodway: z.boolean().optional(),
	pumpingStation: z.boolean().optional(),
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
			url: m.url,
		})),
		isVerified: project.isVerified,
		communityComments: project.communityComments,
		internalNotes: project.internalNotes?.toString(),
		adminComments: project.adminComments?.toString(),
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
