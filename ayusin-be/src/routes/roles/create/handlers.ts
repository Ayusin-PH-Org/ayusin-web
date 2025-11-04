import * as HttpStatusCodes from "stoker/http-status-codes";
import { Role } from "@/db/role.model";
import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute } from "./routes";

export const createRole: AppRouteHandler<CreateRoute> = async (c) => {
	const body = c.req.valid("json");
	try {
		const role = new Role({
			version: 1,
			name: body.name,
			description: body.description,
			importance: body.importance,
			accessScope: body.access_scope,
			clearanceLevel: body.clearance_level,
		});

		role.save();

		return c.json(
			{
				status: "success",
				id: role._id.toString(),
				name: role.name,
				description: role.description ?? undefined,
				importance: role.importance,
				access_scope: role.accessScope,
				clearance_level: role.clearanceLevel,
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
