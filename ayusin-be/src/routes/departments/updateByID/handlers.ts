import { AppRouteHandler } from "@/lib/types";
import { UpdateByIDRoute } from "./routes";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { Department } from "@/db/department.model";
import { departmentDocToZod } from "./model";
import { isNullOrUndefined } from "@/lib/utils";

export const updateDepartmentByID: AppRouteHandler<UpdateByIDRoute> = async (
	c,
) => {
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

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

		if (!isNullOrUndefined(body.name)) {
			department.set("name", body.name);
		}

		if (!isNullOrUndefined(body.shortname)) {
			department.set("shortName", body.shortname);
		}

		if (!isNullOrUndefined(body.email)) {
			department.set("email", body.email);
		}

		if (!isNullOrUndefined(body.contact)) {
			department.set("contact", body.contact);
		}

		if (!isNullOrUndefined(body.headquarter_address)) {
			department.set("headquarterAddress", body.headquarter_address);
		}

		if (!isNullOrUndefined(body.headquarter_location)) {
			department.set("headquarterLocation.coordinates", [
				body.headquarter_location.x,
				body.headquarter_location.y,
			]);
		}

		await department.save();

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
