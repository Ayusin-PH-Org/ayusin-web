import { BlobServiceClient } from "@azure/storage-blob";
import * as HttpStatusCodes from "stoker/http-status-codes";
import env from "@/env";
import type { AppRouteHandler } from "@/lib/types";
import {
	DeleteMediaRequestSchema,
	DeleteMediaResponseSchema,
	ErrorResponseSchema,
} from "../schema";
import type { DeleteMediaRoute } from "./routes";

export const deleteMediaHandler: AppRouteHandler<DeleteMediaRoute> = async (
	c,
) => {
	const { url } = c.req.valid("json");

	try {
		const blobUrl = new URL(url);
		const containerName = env.AZURE_STORAGE_CONTAINER_NAME;
		const prefix = `/${containerName}/`;
		const blobName = blobUrl.pathname.startsWith(prefix)
			? blobUrl.pathname.slice(prefix.length)
			: blobUrl.pathname.replace(/^\//, "");

		const blobServiceClient = BlobServiceClient.fromConnectionString(
			env.AZURE_STORAGE_CONNECTION_STRING,
		);
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);

		const exists = await blockBlobClient.exists();
		if (!exists) {
			return c.json(
				ErrorResponseSchema.parse({
					status: "error",
					description: "Media not found",
				}),
				HttpStatusCodes.NOT_FOUND,
			);
		}

		await blockBlobClient.delete();

		return c.json(
			DeleteMediaResponseSchema.parse({ status: "success" }),
			HttpStatusCodes.OK,
		);
	} catch (error) {
		c.var.logger.error(error);
		return c.json(
			ErrorResponseSchema.parse({
				status: "error",
				description: "Internal server error",
			}),
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
