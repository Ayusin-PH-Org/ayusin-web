import * as HttpStatusCodes from "stoker/http-status-codes";
import { Department } from "@/db/department.model";
import { Role } from "@/db/role.model";
import { User } from "@/db/user.model";
import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute } from "./routes";

export const createMember: AppRouteHandler<CreateRoute> = async (c) => {
	const body = c.req.valid("json");
	try {
		const [department, role] = await Promise.all([
			Department.findById(body.department_id).exec(),
			Role.findById(body.role_id).exec(),
		]);

		if (department == null || role == null) {
			return c.json(
				{
					status: "error",
					description: "Either the `department_id` or `role_id` is not found.",
				},
				HttpStatusCodes.NOT_FOUND,
			);
		}

		// create new user record
		const user = new User({
			version: 1,
			type: "lgu_member",
			userID: body.user_id,
			role: body.role_id,
			department: body.department_id,
			name: body.name,
			email: body.email ?? undefined,
			phone: body.phone ?? undefined,
			avatar: body.avatar ?? undefined,
			relationships: [],
		});
		await user.save();

		department.members.push(user._id);
		await department.save();

		return c.json(
			{
				id: user._id.toString(),
				status: "success",
				...{
					role_id: body.role_id,
					user_id: body.user_id,
					department_id: body.department_id,
					name: body.name,
					email: body.email ?? undefined,
					phone: body.phone ?? undefined,
					avatar: body.avatar ?? undefined,
					relationships: [],
				},
				created_at: user.createdAt,
				updated_at: user.updatedAt,
			},
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			{
				status: "error",
				description: "Something wrong occured while processing your request.",
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
