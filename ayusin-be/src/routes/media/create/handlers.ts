import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import env from "@/env";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import type { UploadMediaRoute } from "./routes";
import { UploadMediaResponseSchema, ErrorResponseSchema } from "../schema";

export const uploadMediaHandler: AppRouteHandler<UploadMediaRoute> = async (
	c,
) => {
	const contentType = c.req.header("content-type") || "";
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
		const arrayBuffer = await (c.req as unknown as Request).arrayBuffer();
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
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			ErrorResponseSchema.parse({
				status: "error",
				description: "Upload failed",
			}),
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
