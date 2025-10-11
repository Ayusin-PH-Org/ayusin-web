import { AppRouteHandler } from "@/lib/types";
import { GetByIDRoute } from "./routes";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { Department } from "@/db/department.model";
import { departmentDocToZod } from "./model";

export const getDepartmentByID: AppRouteHandler<GetByIDRoute> = async (c) => {
	const { id } = c.req.valid("param");
	try {
		const department = await Department.findById(id).exec();

		if (department == null) {
			return c.json(
				{
					status: "error",
					description: "The department is not found in the database.",
				},
				HttpStatusCodes.NOT_FOUND,
			);
		}

		return c.json(
			{
				status: "success",
				...departmentDocToZod(department),
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
