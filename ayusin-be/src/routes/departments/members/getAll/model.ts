import { z } from "zod";
import {
	createMemberErrorResponse,
	createMemberRequest,
} from "../../../members/create/model";

export const ParamsDepartmentIDSchema = z.object({
	department_id: z
		.string()
		.min(1)
		.openapi({
			param: { name: "department_id", in: "path" },
			example: "dept123",
		}),
});

const MemberSchema = createMemberRequest.extend({
	id: z.string(),
	relationships: z.array(z.string()),
	created_at: z.date(),
	updated_at: z.date(),
});

export const SuccessResponseSchema = z.object({
	status: z.literal("success"),
	members: z.array(MemberSchema),
});
export const ErrorResponseSchema = createMemberErrorResponse;
