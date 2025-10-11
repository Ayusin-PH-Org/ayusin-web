import { z } from "zod";
import { createMemberErrorResponse } from "../create/model";

// Path parameters for unlinking two members
export const ParamsUnlinkSchema = z.object({
	user_id1: z
		.string()
		.min(1)
		.openapi({
			param: { name: "user_id1", in: "path" },
			example: "clerk_user1",
		}),
	user_id2: z
		.string()
		.min(1)
		.openapi({
			param: { name: "user_id2", in: "path" },
			example: "clerk_user2",
		}),
});

// Success and error responses
export const unlinkMembersResponse = z.object({ status: z.literal("success") });
export const unlinkMembersErrorResponse = createMemberErrorResponse;
