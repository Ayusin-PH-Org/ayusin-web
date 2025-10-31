import mongoose from "mongoose";
import z from "zod";

export function isNullOrUndefined<T>(
	value: T | null | undefined,
): value is null | undefined {
	return value === null || typeof value === "undefined";
}

/**
 * Validates that a string is a valid MongoDB ObjectId.
 */
export const objectIdValidator = z
	.string()
	.refine((val) => mongoose.Types.ObjectId.isValid(val), {
		message: "Invalid MongoDB ObjectId",
	});
