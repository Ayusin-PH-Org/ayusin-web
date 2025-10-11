import * as HttpStatusCodes from "stoker/http-status-codes";
import { User } from "@/db/user.model";
import type { AppRouteHandler } from "@/lib/types";
import type { ConnectMembersRoute } from "./routes";

export const connectMembersHandler: AppRouteHandler<
	ConnectMembersRoute
> = async (c) => {
	const { user_id1, user_id2 } = c.req.valid("param");
	try {
		const member1 = await User.findOne({
			userID: user_id1,
			type: "lgu_member",
		}).exec();
		const member2 = await User.findOne({
			userID: user_id2,
			type: "lgu_member",
		}).exec();

		if (!member1 || !member2) {
			return c.json(
				{
					status: "error",
					description: "One of `user_id1` or `user_id2` not found.",
				},
				HttpStatusCodes.NOT_FOUND,
			);
		}

		const rel1 = member1.relationships ?? [];
		if (rel1.some((id) => id.equals(member2._id))) {
			return c.json(
				{ status: "error", description: "Members already connected." },
				HttpStatusCodes.CONFLICT,
			);
		}
		member1.relationships = [...rel1, member2._id];
		await member1.save();
		const rel2 = member2.relationships ?? [];
		member2.relationships = [...rel2, member1._id];
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
