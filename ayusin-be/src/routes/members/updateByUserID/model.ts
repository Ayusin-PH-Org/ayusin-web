import { z } from "zod";
import {
	createMemberErrorResponse,
	createMemberRequest,
} from "../create/model";

export const ParamsUserIDSchema = z.object({
	user_id: z
		.string()
		.min(1)
		.openapi({
			param: { name: "user_id", in: "path" },
			example: "clerk_user_id",
		}),
});

export const updateMemberByUserIDRequest = createMemberRequest
	.pick({
		name: true,
		email: true,
		phone: true,
		department_id: true,
		role_id: true,
		avatar: true,
	})
	.partial();

// Core member schema with relationships as IDs and timestamps
const MemberSchema = createMemberRequest.extend({
	relationships: z.array(z.string()),
	created_at: z.date(),
	updated_at: z.date(),
});

export const updateMemberByUserIDResponse = z.object({
	id: z.string(),
	status: z.literal("success"),
	...MemberSchema.shape,
});
export const updateMemberByUserIDErrorResponse = createMemberErrorResponse;
