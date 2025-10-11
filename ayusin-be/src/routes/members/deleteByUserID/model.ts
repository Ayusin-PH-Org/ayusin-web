import { z } from "zod";
import { createMemberErrorResponse } from "../create/model";

// Path param schema for user_id
export const ParamsUserIDSchema = z.object({
	user_id: z
		.string()
		.min(1)
		.openapi({
			param: { name: "user_id", in: "path" },
			example: "clerk_user_id",
		}),
});

// Success & error response schemas
export const deleteMemberByUserIDResponse = z.object({
	status: z.literal("success"),
});
export const deleteMemberByUserIDErrorResponse = createMemberErrorResponse;
