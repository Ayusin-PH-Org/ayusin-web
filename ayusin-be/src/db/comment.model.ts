import * as mongoose from "mongoose";

export const commentSchema = new mongoose.Schema(
	{
		associatedID: { type: String, required: true },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		isInternal: { type: Boolean, required: true, default: false },
		isAdmin: { type: Boolean, required: true, default: false },
		comment: { type: String, required: true },
		type: {
			type: String,
			enum: ["project", "report"] as const,
			required: true,
		},
	},
	{ timestamps: true },
);

export type Comment = mongoose.InferSchemaType<typeof commentSchema>;
export const Comment = mongoose.model("Comment", commentSchema);
