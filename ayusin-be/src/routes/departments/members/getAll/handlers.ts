import * as HttpStatusCodes from "stoker/http-status-codes";
import { User } from "@/db/user.model";
import type { AppRouteHandler } from "@/lib/types";
import type { GetAllMembersRoute } from "./routes";
import { memberDocToZod } from "../../../members/getByUserID/model";

export const getAllMembersHandler: AppRouteHandler<GetAllMembersRoute> = async (
	c,
) => {
	const { department_id } = c.req.valid("param");
	try {
		const docs = await User.find({
			department: department_id,
			type: "lgu_member",
		}).exec();
		// batch-fetch related profiles for mapping relationships
		const relIds = docs.flatMap((d) => d.relationships || []);
		const relatedDocs = await User.find(
			{ _id: { $in: relIds } },
			{ userID: 1 },
		).exec();
		const userIdMap = new Map(
			relatedDocs.map((u) => [u._id.toString(), u.userID]),
		);
		const members = docs.map((doc) => {
			const base = memberDocToZod(doc);
			const relationships = (doc.relationships || []).map(
				(oid) => userIdMap.get(oid.toString()) ?? "",
			);
			return {
				id: doc._id.toString(),
				status: "success",
				...base,
				relationships,
			};
		});
		return c.json({ status: "success", members }, HttpStatusCodes.OK);
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
