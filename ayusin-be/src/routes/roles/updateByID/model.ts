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

/** Example payload for updating a role */
export const updateRoleByIDRequest = z
	.object({
		name: z
			.string()
			.optional()
			.describe("Name of the role")
			.openapi({ example: "Admin" }),
		description: z
			.string()
			.optional()
			.describe("Details of the role's permissions")
			.openapi({
				example:
					"Has the ability to manage, write, read, and delete any reports assigned to their department.",
			}),
		importance: z
			.number()
			.optional()
			.describe("Sort priority for this role")
			.openapi({ example: 21 }),
		clearance_level: z
			.string()
			.optional()
			.describe("Minimum clearance level required")
			.openapi({ example: "city" }),
		access_scope: z
			.array(z.string())
			.optional()
			.describe("List of access permissions for the role")
			.openapi({ example: ["write", "read", "delete"] }),
	})
	.describe("Payload to update an existing role")
	.openapi({
		example: {
			name: "Admin",
			description:
				"Has the ability to manage, write, read, and delete any reports assigned to their department.",
			importance: 21,
			clearance_level: "city",
			access_scope: ["write", "read", "delete"],
		},
	});

export const updateRoleByIDResponse = z.object({
	status: z.literal("success"),
	...RoleSchema.shape,
});

export const updateRoleByIDErrorResponse = z.object({
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
