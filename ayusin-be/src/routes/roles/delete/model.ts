import { z } from "zod";

export const ParamsIDSchema = z.object({
	id: z
		.string()
		.min(3)
		.openapi({
			param: {
				name: "id",
				in: "path",
			},
			example: "3298",
		}),
});

/** Success response for deleting a role */
export const deleteRoleByIDResponse = z.object({
	status: z.literal("success"),
});

/** Error response when deleting a role fails or role not found */
export const deleteRoleByIDErrorResponse = z.object({
	status: z.literal("error"),
	description: z.string(),
});
