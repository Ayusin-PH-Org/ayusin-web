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
	x: z.number(),
	y: z.number(),
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

export const updateDepartmentByIDRequest = DepartmentSchema.pick({
	shortname: true,
	contact: true,
	email: true,
	headquarter_address: true,
}).extend({
	name: z.string().optional(),
	headquarter_location: Location.optional(),
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
