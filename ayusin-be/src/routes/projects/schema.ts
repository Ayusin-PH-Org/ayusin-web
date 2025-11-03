import type mongoose from "mongoose";
import { z } from "zod";
import type { Project } from "@/db";
import {
	dateToYMDValidator,
	locationValidator,
	objectIdValidator,
} from "@/lib/utils";

// General information about the project
const GeneralInformation = z
	.object({
		projectID: z.string().describe("Unique project identifier"),
		contractID: z.string().describe("Contract number for the project"),
		projectName: z.string().describe("Official project name"),
		locationStr: z.string().describe("Human-readable location address"),
		location: locationValidator.describe(
			"GeoJSON coordinates of the project location",
		),
		type: z
			.enum([
				"dam",
				"wall",
				"floodway",
				"pumping_station",
				"slope_protection",
				"coastal_protection",
			])
			.describe("Category/type of the project"),
		dpwhImplementingOffice: z
			.string()
			.describe("DPWH office responsible for implementation"),
		contractor: z.string().describe("Name of the contractor firm"),
		totalCost: z.number().describe("Total approved cost of the project"),
		fundingYear: z
			.date()
			.transform((date) => date.getFullYear().toString())
			.describe("Fiscal year for funding allocation"),
		yearStart: dateToYMDValidator.describe("Scheduled start date (YYYY-MM-DD)"),
		yearEnd: dateToYMDValidator.describe("Scheduled end date (YYYY-MM-DD)"),
		implementationStatus: z
			.enum(["completed", "in_progress"])
			.describe("Current implementation status"),
		implementationStatusPercentage: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe("Percentage completion of implementation"),
		paymentStatus: z
			.enum(["paid", "partial"])
			.describe("Current payment status"),
		paymentStatusPercentage: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe("Percentage completion of payments"),
		monitors: z.array(z.string()).describe("List of assigned monitor user IDs"),
		dateOfVisit: dateToYMDValidator.describe(
			"Date of the latest site visit (YYYY-MM-DD)",
		),
	})
	.describe("General information block for a project");

export const GeneralInformationRequestSchema = GeneralInformation.extend({
	locationStr: z.string().describe("Human-readable location address"),
	location: z
		.object({ x: z.number(), y: z.number() })
		.describe(
			"Location coordinates in terms of longitude (x) and latitude (y)",
		),
	fundingYear: z.string(),
	yearStart: z.iso.date(),
	yearEnd: z.iso.date(),
	dateOfVisit: z.iso.date(),
});

const MediaItem = z
	.object({
		dateUploaded: z.date().describe("Date when media was uploaded"),
		uploader: objectIdValidator.describe("User ID of the uploader"),
		url: z.url().describe("URL of the media resource"),
	})
	.describe("Media item metadata");

export const MediaItemRequestSchema = MediaItem.extend({
	dateUploaded: z.iso.date().describe("Upload date in ISO format"),
}).describe("Request schema for a media item");

const CheckItem = z
	.object({
		checkID: objectIdValidator.describe(
			"Unique identifier for each checklist item",
		),
		description: z.string().describe("Description of the checklist item"),
		status: z.boolean().describe("Result status of this checklist item"),
		note: z
			.string()
			.optional()
			.describe("Optional note for this checklist item"),
	})
	.describe("Individual checklist item in response");

export const CheckStatus = z
   .object({
       description: z.string().describe("Identifier of the checklist item"),
       status: z.boolean().describe("Whether the check condition was met"),
       internalNotes: z
           .string()
           .optional()
           .describe("Internal notes for the check condition"),
   })
   .describe("Checklist item identifier, status, and optional internal notes");


export const ObservationChecklistRequestSchema = z
   .object({
       projectType: z
           .enum([
               "dam",
               "wall",
               "floodway",
               "pumping_station",
               "slope_protection",
               "coastal_protection",
           ])
           .describe("Project category determining checklist section"),
       checks: z
           .array(CheckStatus)
           .describe("List of checklist item statuses and notes"),
       extras: z
           .record(z.string(), z.any())
           .optional()
           .describe("Flexible JSON object for additional checklist data"),
   })
   .describe("Request payload for project observation checklist");

/**
 * Example payload for creating or returning a project.
 */
export const ExampleProject = {
	generalInformation: {
		projectID: "P00824759LZ",
		contractID: "24EG0058",
		projectName:
			"Construction of Babuyan River Flood Control Strucure Downstream (RS), Palawan",
		locationStr: "PUERTO PRINCESA CITY (CAPITAL) (PALAWAN)",
		location: { x: 118.89245, y: 9.99653 },
		type: "dam",
		dpwhImplementingOffice: "Palawan 3rd District Engineering Office",
		contractor: "AZARRAGA CONSTRUCTION",
		totalCost: 17961569.07,
		fundingYear: "2024",
		yearStart: "2024-02-15",
		yearEnd: "2025-10-31",
		implementationStatus: "completed",
		implementationStatusPercentage: 100,
		paymentStatus: "paid",
		paymentStatusPercentage: 100,
		monitors: [],
		dateOfVisit: "2025-10-31",
	},
	isSatisfactory: false,
	media: [
		{
			dateUploaded: "2025-10-31",
			uploader: "690469b811e0ea3b6310dff0",
			url: "https://ayusinphmedia.blob.core.windows.net/projects/image/7cf3bf53-a004-4546-96b9-524252dc9577.png",
		},
	],
	isVerified: true,
	communityComments: "We really need to be fixed asap.",
   observationChecklist: {
       extras: {
           additionalComments:
               "The fixes for this will costs a lot and needs reconsideration from our budget.",
       },
       projectType: "dam",
       checks: [
           { description: "visible", status: true },
           { description: "noCracks", status: false, internalNotes: "There's a lot of cracks that results to water spilling during rain." },
           { description: "spillwayNotBlocked", status: false, internalNotes: "Example internal notes" },
           { description: "noOverflow", status: true },
           { description: "accessRoads", status: true },
           { description: "servesPurpose", status: true },
       ],
   },
	internalNotes: [
		{
			comment:
				"It took a lot of time to build this but the quality of the structure is not good enough.",
			author: "690469b811e0ea3b6310dff0",
		},
	],
	adminComments: [
		{
			comment: "Raising the priority of this to high.",
			author: "690469b811e0ea3b6310dff0",
		},
	],
} as const;

const ObservationChecklist = z
	.object({
		extras: z
			.record(z.string(), z.any())
			.optional()
			.describe("Flexible JSON object for additional checklist data"),
		projectType: z
			.enum([
				"dam",
				"wall",
				"floodway",
				"pumping_station",
				"slope_protection",
				"coastal_protection",
			])
			.describe("Project category used to select checklist items"),
		checks: z.array(CheckItem).describe("List of generated checklist items"),
		// Optional flags for additional observation types
		floodway: z.boolean().optional().describe("Flag indicating floodway check"),
		pumpingStation: z
			.boolean()
			.optional()
			.describe("Flag indicating pumping station check"),
	})
	.describe("Final observation checklist included in responses");

export const ProjectSchema = z
	.object({
		id: objectIdValidator.describe(
			"Unique database identifier of the project record",
		),
		created_at: z.date().describe("Timestamp when project record was created"),
		updated_at: z
			.date()
			.describe("Timestamp when project record was last updated"),
		generalInformation: GeneralInformation.describe(
			"Core details of the project",
		),
		isSatisfactory: z
			.boolean()
			.describe("Whether project condition is satisfactory"),
		media: z.array(MediaItem).describe("Media items attached to the project"),
		isVerified: z
			.boolean()
			.describe("Whether project details have been verified"),
		communityComments: z
			.string()
			.describe("Comments submitted by the community"),
		internalNotes: z
			.array(objectIdValidator)
			.optional()
			.describe("References to internal note comment IDs"),
		adminComments: z
			.array(objectIdValidator)
			.optional()
			.describe("References to admin comment IDs"),
		observationChecklist: ObservationChecklist.describe(
			"Observation checklist details",
		),
	})
	.describe("Schema for project data returned in API responses");

/** Comment object returned in API responses */
export const CommentResponseSchema = z
	.object({
		id: objectIdValidator.describe("Unique identifier of the comment"),
		comment: z.string().describe("Content of the comment"),
		author: objectIdValidator.describe("User ID of the comment author"),
	})
	.describe("Schema for comment objects included in project responses");

/** Extended project schema including arrays of comment objects for responses */
export const ProjectResponseSchema = ProjectSchema.omit({
	internalNotes: true,
	adminComments: true,
})
	.extend({
		internalNotes: z
			.array(CommentResponseSchema)
			.optional()
			.describe("Internal comments associated with the project"),
		adminComments: z
			.array(CommentResponseSchema)
			.optional()
			.describe("Administrative comments associated with the project"),
	})
	.describe(
		"Schema for project responses, including full comment objects for internal and admin notes",
	);

export const projectDocToZod = (
	project: mongoose.HydratedDocument<Project>,
) => {
	const projectObject = project.toObject();

	return ProjectSchema.parse({
		id: project._id.toString(),
		created_at: project.createdAt,
		updated_at: project.updatedAt,
		generalInformation: {
			...projectObject.generalInformation,
			location: {
				x: project.generalInformation.location.coordinates[0],
				y: project.generalInformation.location.coordinates[1],
			},
		},
		isSatisfactory: project.isSatisfactory,
		media: project.media.map((m) => ({
			dateUploaded: m.dateUploaded,
			uploader: m.uploader.toString(),
			url: m.url,
		})),
		isVerified: project.isVerified,
		communityComments: project.communityComments,
		internalNotes: project.internalNotes?.map((id) => id.toString()) ?? [],
		adminComments: project.adminComments?.map((id) => id.toString()) ?? [],
		observationChecklist: {
			projectType: project.observationChecklist.projectType,
			checks: project.observationChecklist.checks.map((c) => ({
				checkID: c.checkID.toString(),
				description: c.description,
				status: c.status,
				note: c.note ?? undefined,
			})),
			extras: project.observationChecklist.extras ?? null,
		},
	});
};
