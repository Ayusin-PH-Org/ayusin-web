import { z } from "zod";
import type { HydratedDocument } from "mongoose";
import type { User } from "@/db/user.model";
import {
	createMemberRequest,
	createMemberErrorResponse,
} from "../create/model";

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

// Core member schema for response (excluding status)
const MemberSchema = createMemberRequest.extend({
	relationships: z.array(z.string()),
	created_at: z.date(),
	updated_at: z.date(),
});

// Success and error responses
export const getMemberByUserIDResponse = z.object({
	id: z.string(),
	status: z.literal("success"),
	...MemberSchema.shape,
});
export const getMemberByUserIDErrorResponse = createMemberErrorResponse;

// Convert Mongoose User document into Zod-validated data
export const memberDocToZod = (doc: HydratedDocument<User>) =>
	MemberSchema.parse({
		id: doc._id.toString(),
		role_id: doc.role!.toString(),
		user_id: doc.userID,
		department_id: doc.department!.toString(),
		created_at: doc.createdAt,
		updated_at: doc.updatedAt,
		name: doc.name,
		email: doc.email ?? undefined,
		phone: doc.phone ?? undefined,
		avatar: doc.avatar ?? undefined,
		relationships: doc.relationships?.map((r) => r.toString()) ?? [],
	});
