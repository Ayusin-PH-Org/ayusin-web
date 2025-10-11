import { z } from "zod";

export const createMemberRequest = z.object({
	role_id: z.string(),
	user_id: z.string(),
	department_id: z.string(),
	name: z.string(),
	email: z.string().optional(),
	phone: z.string().optional(),
	avatar: z.string().optional(),
});

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
