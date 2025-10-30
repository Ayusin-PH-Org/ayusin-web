import { BlobServiceClient } from "@azure/storage-blob";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { v4 as uuidv4 } from "uuid";
import env from "@/env";
import type { AppRouteHandler } from "@/lib/types";
import { ErrorResponseSchema, UploadMediaResponseSchema } from "../schema";
import type { UploadMediaRoute } from "./routes";

export const uploadMediaHandler: AppRouteHandler<UploadMediaRoute> = async (
	c,
) => {
	// Parse multipart form data and extract the file
	const form = await (c.req as unknown as Request).formData();
	const file = form.get("file");
	if (!(file instanceof Blob)) {
		return c.json(
			ErrorResponseSchema.parse({
				status: "error",
				description: "Invalid media type",
			}),
			HttpStatusCodes.UNPROCESSABLE_ENTITY,
		);
	}

	const contentType = file.type;
	let type: "image" | "video";
	if (contentType.startsWith("image/")) type = "image";
	else if (contentType.startsWith("video/")) type = "video";
	else {
		return c.json(
			ErrorResponseSchema.parse({
				status: "error",
				description: "Invalid media type",
			}),
			HttpStatusCodes.UNPROCESSABLE_ENTITY,
		);
	}

	try {
		const arrayBuffer = await file.arrayBuffer();
		const fileSize = arrayBuffer.byteLength;

		const ext = contentType.split("/")[1]?.split(";")[0] || "";
		const blobName = `${type}/${uuidv4()}${ext ? `.${ext}` : ""}`;

		const blobServiceClient = BlobServiceClient.fromConnectionString(
			env.AZURE_STORAGE_CONNECTION_STRING,
		);
		const containerClient = blobServiceClient.getContainerClient(
			env.AZURE_STORAGE_CONTAINER_NAME,
		);
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);

		await blockBlobClient.uploadData(arrayBuffer, {
			blobHTTPHeaders: { blobContentType: contentType },
		});

		const url = blockBlobClient.url;

		return c.json(
			UploadMediaResponseSchema.parse({ type, url, fileSize }),
			HttpStatusCodes.OK,
		);
	} catch (error: any) {
		c.var.logger.error(error);
		// Map connection errors to a 502 Bad Gateway
		if (error.code === "FailedToOpenSocket") {
			return c.json(
				ErrorResponseSchema.parse({
					status: "error",
					description: error.message,
				}),
				HttpStatusCodes.BAD_GATEWAY,
			);
		}
		return c.json(
			ErrorResponseSchema.parse({
				status: "error",
				description: "Upload failed",
			}),
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
