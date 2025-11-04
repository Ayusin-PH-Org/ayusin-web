import * as HttpStatusCodes from "stoker/http-status-codes";
import { Role } from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import { isNullOrUndefined } from "@/lib/utils";
import { roleDocToZod } from "./model";
import type { UpdateByIDRoute } from "./routes";

export const updateRoleByID: AppRouteHandler<UpdateByIDRoute> = async (c) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	try {
		const role = await Role.findById(id).exec();

		if (role == null) {
			return c.json(
				{
					status: "error",
					description: "The role is not found in the database.",
				},
				HttpStatusCodes.NOT_FOUND,
			);
		}

		if (!isNullOrUndefined(body.name)) {
			role.set("name", body.name);
		}

		if (!isNullOrUndefined(body.description)) {
			role.set("description", body.description);
		}

		if (!isNullOrUndefined(body.importance)) {
			role.set("importance", body.importance);
		}

		if (!isNullOrUndefined(body.clearance_level)) {
			role.set("clearanceLevel", body.clearance_level);
		}

		if (!isNullOrUndefined(body.access_scope)) {
			role.set("accessScope", body.access_scope);
		}

		await role.save();

		return c.json(
			{
				status: "success",
				...roleDocToZod(role),
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
