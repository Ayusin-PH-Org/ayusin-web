import * as HttpStatusCodes from "stoker/http-status-codes";
import { Department } from "@/db/department.model";
import { User } from "@/db/user.model";
import type { AppRouteHandler } from "@/lib/types";
import type { DeleteByUserIDRoute } from "./routes";

export const deleteMemberByUserID: AppRouteHandler<
	DeleteByUserIDRoute
> = async (c) => {
	const { user_id } = c.req.valid("param");
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

		const department = await Department.findById(doc.department).exec();
		if (department) {
			department.members = department.members.filter(
				(m) => m.toString() !== doc._id.toString(),
			);
			await department.save();
		}

		await doc.deleteOne().exec();
		return c.json({ status: "success" }, HttpStatusCodes.OK);
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
