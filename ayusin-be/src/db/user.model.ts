import * as mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
	{
		version: { type: Number, required: true },
		// distinguishes local-government members vs. citizen users
		type: { type: String, enum: ["lgu_member", "citizen"], required: true },
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role",
			required: false,
		},
		department: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Department",
			required: false,
		},
		name: { type: String, required: false },
		email: { type: String, required: false },
		phone: { type: String, required: false },
		avatar: { type: String, required: false },
		relationships: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			required: false,
			default: [],
		},
		userID: { type: String, required: true }, // for clerk this is the clerk ID, otherwise it's the user ID from webauthn

		// specific to citizens only
		credentialID: { type: String, required: false },
		publicKey: { type: String, required: false },
		counter: { type: Number, required: false },
	},
	{ timestamps: true },
);

export type User = mongoose.InferSchemaType<typeof userSchema>;
export const User = mongoose.model("User", userSchema);
