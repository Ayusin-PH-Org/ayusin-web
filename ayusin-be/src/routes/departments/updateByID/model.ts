import { z } from "zod";
import { HydratedDocument } from "mongoose";
import { Department } from "@/db/department.model";

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

const Location = z.object({
	x: z
		.number()
		.describe("Longitude of the location")
		.openapi({ example: 32.9 }),
	y: z
		.number()
		.describe("Latitude of the location")
		.openapi({ example: 21.42 }),
});

export const DepartmentSchema = z.object({
	id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	name: z.string(),
	shortname: z.string().optional(),
	contact: z.string().optional(),
	email: z.string().optional(),
	headquarter_address: z.string().optional(),
	headquarter_location: Location,
	members: z.array(z.string()),
	roles: z.array(z.string()),
});

/** Example payload for updating a department */
export const updateDepartmentByIDRequest = z
	.object({
		name: z
			.string()
			.optional()
			.describe("Full department name")
			.openapi({ example: "Department of Public Works and Highways" }),
		shortname: z
			.string()
			.optional()
			.describe("Abbreviated department name")
			.openapi({ example: "DPWH" }),
		contact: z
			.string()
			.optional()
			.describe("Department contact number")
			.openapi({ example: "(+63) 910-832-1832" }),
		email: z
			.string()
			.optional()
			.describe("Department contact email")
			.openapi({ example: "support@dpwh.gov.ph" }),
		headquarter_address: z
			.string()
			.optional()
			.describe("Headquarter address")
			.openapi({
				example:
					"Department of Public Works and Highways - Head Office, Manila",
			}),
		headquarter_location: Location.optional()
			.describe("Headquarter geographic location")
			.openapi({ example: { x: 32.9, y: 21.42 } }),
	})
	.describe("Payload to update a department by ID")
	.openapi({
		example: {
			name: "Department of Public Works and Highways",
			shortname: "DPWH",
			contact: "(+63) 910-832-1832",
			email: "support@dpwh.gov.ph",
			headquarter_address:
				"Department of Public Works and Highways - Head Office, Manila",
			headquarter_location: { x: 32.9, y: 21.42 },
		},
	});

export const updateDepartmentByIDResponse = z.object({
	status: z.literal("success"),
	...DepartmentSchema.shape,
});

export const updateDepartmentByIDErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});

export const departmentDocToZod = (department: HydratedDocument<Department>) =>
	DepartmentSchema.parse({
		id: department._id.toString(),
		created_at: department.createdAt.toISOString(),
		updated_at: department.updatedAt.toISOString(),
		name: department.name,
		shortname: department.shortName ?? undefined,
		contact: department.contact ?? undefined,
		email: department.email ?? undefined,
		headquarter_address: department.headquarterAddress ?? undefined,
		headquarter_location: Location.parse({
			x: department.headquarterLocation.coordinates[0],
			y: department.headquarterLocation.coordinates[1],
		}),
		members: department.members,
		roles: department.roles,
	});
