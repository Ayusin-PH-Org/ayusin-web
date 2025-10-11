import * as HttpStatusCodes from "stoker/http-status-codes";
import { User } from "@/db/user.model";
import type { AppRouteHandler } from "@/lib/types";
import type { GetByUserIDRoute } from "./routes";
import { memberDocToZod } from "./model";

export const getMemberByUserID: AppRouteHandler<GetByUserIDRoute> = async (
	c,
) => {
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
