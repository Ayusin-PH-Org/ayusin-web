import { z } from "zod";
import { createMemberErrorResponse } from "../create/model";

// Path-param schema for connecting two members
export const ParamsConnectSchema = z.object({
	user_id1: z
		.string()
		.min(1)
		.openapi({
			param: { name: "user_id1", in: "path" },
			example: "clerk_user_id",
		}),
	user_id2: z
		.string()
		.min(1)
		.openapi({
			param: { name: "user_id2", in: "path" },
			example: "clerk_user_id_2",
		}),
});

// Success & error response schemas
export const connectMembersResponse = z.object({
	status: z.literal("success"),
});
export const connectMembersErrorResponse = createMemberErrorResponse;
