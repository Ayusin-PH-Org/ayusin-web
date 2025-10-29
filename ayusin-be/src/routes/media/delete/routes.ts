import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  DeleteMediaRequestSchema,
  DeleteMediaResponseSchema,
  ErrorResponseSchema,
} from "../schema";

export const deleteMediaRoute = createRoute({
  description: "Delete media blob from Azure storage by URL",
  path: "/",
  method: "delete",
  tags: ["Media"],
  request: {
    body: jsonContentRequired(
      DeleteMediaRequestSchema,
      "URL of media to delete",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      DeleteMediaResponseSchema,
      "Successfully deleted media",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      ErrorResponseSchema,
      "Media not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error",
    ),
  },
});

export type DeleteMediaRoute = typeof deleteMediaRoute;
