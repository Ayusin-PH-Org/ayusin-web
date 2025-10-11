import { z } from "zod";

const Location = z.object({
	x: z.number(),
	y: z.number(),
});

export const DepartmentSchema = z.object({
	id: z.string(),
	name: z.string(),
	shortname: z.string().optional(),
	contact: z.string().optional(),
	email: z.string().optional(),
	headquarter_address: z.string().optional(),
	headquarter_location: Location,
	members: z.array(z.string()),
	roles: z.array(z.string()),
});

export const createDepartmentRequest = DepartmentSchema.pick({
	name: true,
	shortname: true,
	contact: true,
	email: true,
	headquarter_address: true,
	headquarter_location: true,
});

export const createDepartmentOkResponse = z.object({
	status: z.literal("success"),
	...DepartmentSchema.shape,
});
