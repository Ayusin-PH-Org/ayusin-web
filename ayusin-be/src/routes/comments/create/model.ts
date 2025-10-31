import { z } from "zod";
import { objectIdValidator } from "@/lib/utils";

// Zod schema for Comment documents
export const CommentSchema = z.object({
	id: objectIdValidator,
	created_at: z.date(),
	updated_at: z.date(),
	associatedID: z.string().describe("Associated project or report ID"),
	author: objectIdValidator.describe("Author user ID"),
	comment: z.string().describe("Comment text"),
	type: z.enum(["project", "report"]),
	is_internal: z.boolean().describe("Whether comment is internal"),
	is_admin: z.boolean().describe("Whether comment is admin note"),
});

// Request body for creating a comment
export const createCommentRequest = CommentSchema.pick({
	associatedID: true,
	author: true,
	comment: true,
	type: true,
});

// Successful response after creating a comment
export const createCommentOkResponse = z.object({
	status: z.literal("success"),
	...CommentSchema.shape,
});

// Error response schema
export const createCommentErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});
