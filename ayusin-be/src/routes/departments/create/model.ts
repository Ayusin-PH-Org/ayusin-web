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

/** Example payload for creating a department */
export const ExampleDepartment = {
	name: "Department of Public Works and Highways",
	shortname: "DPWH",
	contact: "(+63) 910-832-1832",
	email: "support@dpwh.gov.ph",
	headquarter_address:
		"Department of Public Works and Highways - Head Office, Manila",
	headquarter_location: { x: 32.9, y: 21.42 },
} as const;

export const createDepartmentRequest = z
	.object({
		name: z
			.string()
			.describe("Full department name")
			.openapi({ example: ExampleDepartment.name }),
		shortname: z
			.string()
			.describe("Abbreviated department name")
			.optional()
			.openapi({ example: ExampleDepartment.shortname }),
		contact: z
			.string()
			.describe("Department contact number")
			.optional()
			.openapi({ example: ExampleDepartment.contact }),
		email: z
			.string()
			.describe("Department contact email")
			.optional()
			.openapi({ example: ExampleDepartment.email }),
		headquarter_address: z
			.string()
			.describe("Headquarter address")
			.optional()
			.openapi({ example: ExampleDepartment.headquarter_address }),
		headquarter_location: Location.describe(
			"Headquarter geographic location",
		).openapi({ example: ExampleDepartment.headquarter_location }),
	})
	.describe("Payload to create a new department")
	.openapi({ example: ExampleDepartment });

export const createDepartmentOkResponse = z.object({
	status: z.literal("success"),
	...DepartmentSchema.shape,
});
