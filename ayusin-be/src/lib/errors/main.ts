import { z } from "zod";
import * as HttpStatusCodes from "stoker/http-status-codes";

const baseErrorResponse = z.object({
	status: z.literal("error").readonly().optional(),
	message: z.string(),
	errorCode: z.string(),
});

export type ErrorResponse = z.infer<typeof baseErrorResponse>;

const testError: ErrorResponse = {
	message: "test",
	errorCode: "test",
};

export class AyusinAPIException extends Error {
	public statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR;

	constructor(message: string) {
		super(message);
		this.name = "AyusinAPIException";

		Object.setPrototypeOf(this, AyusinAPIException.prototype);
	}

	public toJSON() {
		return {
			message: this.message,
		} as ErrorResponse;
	}
}
