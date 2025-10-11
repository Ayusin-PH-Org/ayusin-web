import * as HttpStatusCodes from "stoker/http-status-codes";
import { User } from "@/db/user.model";
import type { AppRouteHandler } from "@/lib/types";
import type { UnlinkMembersRoute } from "./routes";

export const unlinkMembersHandler: AppRouteHandler<UnlinkMembersRoute> = async (
	c,
) => {
	const { user_id1, user_id2 } = c.req.valid("param");
	try {
		const [member1, member2] = await Promise.all([
			User.findOne({ userID: user_id1, type: "lgu_member" }).exec(),
			User.findOne({ userID: user_id2, type: "lgu_member" }).exec(),
		]);

		if (!member1 || !member2) {
			return c.json(
				{
					status: "error",
					description: "One of `user_id1` or `user_id2` not found.",
				},
				HttpStatusCodes.NOT_FOUND,
			);
		}

		member1.relationships = (member1.relationships || []).filter(
			(id) => !id.equals(member2._id),
		);
		await member1.save();
		member2.relationships = (member2.relationships || []).filter(
			(id) => !id.equals(member1._id),
		);
		await member2.save();

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
