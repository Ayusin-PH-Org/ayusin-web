import { z } from "zod";

export const RoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	importance: z.number(),
	parent_role: z.string().optional(),
	clearance_level: z.string(),
	access_scope: z.array(z.string()),
});

/** Example payload for creating a role */
export const ExampleRole = {
	name: "Admin",
	description:
		"Has the ability to manage, write, read, and delete any reports assigned to their department.",
	importance: 21,
	clearance_level: "city",
	access_scope: ["write", "read", "delete"],
} as const;

export const createRoleRequest = z
	.object({
		name: z
			.string()
			.describe("Name of the role")
			.openapi({ example: ExampleRole.name }),
		description: z
			.string()
			.optional()
			.describe("Details of the role's permissions")
			.openapi({ example: ExampleRole.description }),
		importance: z
			.number()
			.describe("Sort priority for this role")
			.openapi({ example: ExampleRole.importance }),
		clearance_level: z
			.string()
			.describe("Minimum clearance level required")
			.openapi({ example: ExampleRole.clearance_level }),
		access_scope: z
			.array(z.string())
			.describe("List of access permissions for the role")
			.openapi({ example: ExampleRole.access_scope }),
	})
	.describe("Payload to create a new role")
	.openapi({ example: ExampleRole });

export const createRoleOkResponse = z.object({
	status: z.literal("success"),
	...RoleSchema.shape,
});

export const createRoleErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});
