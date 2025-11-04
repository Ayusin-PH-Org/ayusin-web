import type { HydratedDocument } from "mongoose";
import { z } from "zod";
import type { Role } from "@/db";

export const ParamsIDSchema = z.object({
	id: z
		.string()
		.min(3)
		.openapi({
			param: {
				name: "id",
				in: "path",
			},
			example: "3298",
		}),
});

export const RoleSchema = z.object({
	id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	name: z.string(),
	description: z.string().optional(),
	importance: z.number(),
	parent_role: z.string().optional(),
	clearance_level: z.string(),
	access_scope: z.array(z.string()),
});

/** Success response for retrieving a role by ID */
export const getRoleByIDResponse = z.object({
	status: z.literal("success"),
	...RoleSchema.shape,
});

/** Error response when a role is not found or retrieval fails */
export const getRoleByIDErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const roleDocToZod = (role: HydratedDocument<Role>) =>
	RoleSchema.parse({
		id: role._id.toString(),
		created_at: role.createdAt.toISOString(),
		updated_at: role.updatedAt.toISOString(),
		name: role.name,
		importance: role.importance,
		description: role.description ?? undefined,
		parent_role: role.parentRole ?? undefined,
		clearance_level: role.clearanceLevel,
		access_scope: role.accessScope,
	});
