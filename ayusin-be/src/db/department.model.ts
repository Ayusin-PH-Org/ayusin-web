import * as mongoose from "mongoose";
import { pointSchema } from "./point.model";

export const departmentSchema = new mongoose.Schema(
	{
		version: { type: Number, required: true },
		name: { type: String, required: true },
		shortName: { type: String, required: false },
		contact: { type: String, required: false },
		email: { type: String, required: false },
		headquarterAddress: { type: String, required: false },
		headquarterLocation: { type: pointSchema, required: true },
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Role",
			},
		],
	},
	{ timestamps: true },
);

export type Department = mongoose.InferSchemaType<typeof departmentSchema>;
export const Department = mongoose.model("Department", departmentSchema);
