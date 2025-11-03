import { z } from "zod";
import { objectIdValidator } from "@/lib/utils";

/**
 * Query parameters for filtering comments by type and associated ID, with optional filters.
 */
/**
 * Path parameters for comment type and associated resource ID.
 */
/**
 * Path parameter for the associated resource ID.
 */
export const getCommentsParams = z.object({
	associatedID: z.string().describe("Associated projectID or report ID"),
});

/**
 * Query parameters for optional filters.
 */
/**
 * Query parameters for filtering comments by type and optional flags.
 */
export const getCommentsQuery = z.object({
	type: z
		.enum(["project", "report"])
		.describe("The comment type to filter: project or report"),
	author: objectIdValidator.optional().describe("Filter by author user ID"),
	is_internal: z
		.boolean()
		.optional()
		.describe("Filter by internal comments (true/false)"),
	is_admin: z
		.boolean()
		.optional()
		.describe("Filter by admin comments (true/false)"),
});

/**
 * Successful response: list of comments.
 */
export const getCommentsResponse = z.object({
	status: z.literal("success"),
	comments: z.array(
		z.object({
			id: objectIdValidator,
			created_at: z.date(),
			updated_at: z.date(),
			associatedID: z.string(),
			author: objectIdValidator,
			comment: z.string(),
			type: z.enum(["project", "report", "internal_note", "admin_comment"]),
			is_internal: z.boolean(),
			is_admin: z.boolean(),
		}),
	),
});

/**
 * Error response schema.
 */
export const getCommentsErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});
