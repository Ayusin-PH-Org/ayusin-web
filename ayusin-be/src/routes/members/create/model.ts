import { z } from "zod";

/** Example payload for creating a member */
export const ExampleMember = {
	role_id: "role123",
	user_id: "user456",
	department_id: "dept789",
	name: "Juan Dela Cruz",
	email: "juan@ayusin.ph",
	phone: "(+63) 910-832-1832",
	avatar: "https://example.com/avatar/juan.png",
} as const;

export const createMemberRequest = z
	.object({
		role_id: z
			.string()
			.describe("Identifier of the member's role")
			.openapi({ example: ExampleMember.role_id }),
		user_id: z
			.string()
			.describe("Identifier of the user")
			.openapi({ example: ExampleMember.user_id }),
		department_id: z
			.string()
			.describe("Identifier of the department")
			.openapi({ example: ExampleMember.department_id }),
		name: z
			.string()
			.describe("Full name of the member")
			.openapi({ example: ExampleMember.name }),
		email: z
			.string()
			.optional()
			.describe("Email address of the member")
			.openapi({ example: ExampleMember.email }),
		phone: z
			.string()
			.optional()
			.describe("Phone number of the member")
			.openapi({ example: ExampleMember.phone }),
		avatar: z
			.string()
			.optional()
			.describe("URL to the member's avatar image")
			.openapi({ example: ExampleMember.avatar }),
	})
	.describe("Payload to create a new member")
	.openapi({ example: ExampleMember });

export const createMemberOkResponse = z.object({
	id: z.string(),
	status: z.literal("success"),
	...createMemberRequest.shape,
	relationships: z.array(z.string()),
	created_at: z.date(),
	updated_at: z.date(),
});

export const createMemberErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});
