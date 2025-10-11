import * as HttpStatusCodes from "stoker/http-status-codes";
import { User } from "@/db/user.model";
import type { AppRouteHandler } from "@/lib/types";
import type { UpdateByUserIDRoute } from "./routes";
import { isNullOrUndefined } from "@/lib/utils";
import { memberDocToZod } from "../getByUserID/model";

export const updateMemberByUserID: AppRouteHandler<
	UpdateByUserIDRoute
> = async (c) => {
	const { user_id } = c.req.valid("param");
	const body = c.req.valid("json");
	try {
		const doc = await User.findOne({
			userID: user_id,
			type: "lgu_member",
		}).exec();
		if (doc == null) {
			return c.json(
				{ status: "error", description: "Member not found in the database." },
				HttpStatusCodes.NOT_FOUND,
			);
		}

		if (!isNullOrUndefined(body.name)) doc.set("name", body.name);
		if (!isNullOrUndefined(body.email)) doc.set("email", body.email);
		if (!isNullOrUndefined(body.phone)) doc.set("phone", body.phone);
		if (!isNullOrUndefined(body.department_id))
			doc.set("department", body.department_id);
		if (!isNullOrUndefined(body.role_id)) doc.set("role", body.role_id);
		if (!isNullOrUndefined(body.avatar)) doc.set("avatar", body.avatar);

		await doc.save();
		const base = memberDocToZod(doc);
		// map relationships ObjectIds to Clerk user ID strings
		const relatedDocs = await User.find({
			_id: { $in: doc.relationships },
		}).exec();
		const relationships = relatedDocs.map((u) => u.userID);
		return c.json(
			{ id: doc._id.toString(), status: "success", ...base, relationships },
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
