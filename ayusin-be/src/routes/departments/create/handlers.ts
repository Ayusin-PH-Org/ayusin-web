import { AppRouteHandler } from "@/lib/types";
import { CreateRoute } from "./routes";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { Department } from "@/db/department.model";

export const createDepartment: AppRouteHandler<CreateRoute> = async (c) => {
	const body = c.req.valid("json");
	const department = new Department({
		version: 1,
		name: body.name,
		shortName: body.shortname,
		contact: body.contact,
		email: body.email,
		headquarterAddress: body.headquarter_address,
		headquarterLocation: {
			type: "Point",
			coordinates: [body.headquarter_location.x, body.headquarter_location.y],
		},
	});

	department.save();

	return c.json(
		{
			status: "success",
			id: department._id.toString(),
			name: department.name,
			shortname: department.shortName ?? undefined,
			contact: department.contact ?? undefined,
			email: department.email ?? undefined,
			headquarter_address: department.headquarterAddress ?? undefined,
			headquarter_location: {
				x: department.headquarterLocation.coordinates[0],
				y: department.headquarterLocation.coordinates[1],
			},
			members: [],
			roles: [],
		},
		HttpStatusCodes.OK,
	);
};
