import { z } from "zod";
import { ProjectSchema, ProjectResponseSchema } from "../schema";

/**
 * Query parameters for radius-based project search.
 * 'radius' is in meters; 'x' and 'y' are longitude and latitude.
 */
export const getProjectsByLocationQuery = z.object({
	x: z.string().describe("Longitude").pipe(z.coerce.number()),
	y: z.string().describe("Latitude").pipe(z.coerce.number()),
	radius: z.string().describe("Radius in meters").pipe(z.coerce.number()),
});

/**
 * Successful response: list of projects.
 */
export const getProjectsByLocationResponse = z.object({
	status: z.literal("success"),
	projects: z.array(ProjectResponseSchema),
});

/**
 * Error response schema.
 */
export const getProjectsByLocationErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});
