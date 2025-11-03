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
/**
 * Validates that a date and converts it to YYYY-MM-DD format.
 */
export const dateToYMDValidator = z.date().transform((date) =>
	date.toLocaleDateString("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}),
);

export const locationValidator = z.object({
	x: z.number(),
	y: z.number(),
});
