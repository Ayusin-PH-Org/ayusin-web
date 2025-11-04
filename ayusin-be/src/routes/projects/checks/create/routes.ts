import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
import { CheckStatus, ProjectSchema } from "../../schema";

const ParamsSchema = z.object({
   projectId: z.string().describe("Project identifier to append the check to"),
});

/** Payload for creating a new checklist item in a project */
const CreateCheckRequestSchema = CheckStatus.describe(
   "New checklist item description, status, and optional internal notes",
);

const SuccessResponseSchema = z.object({
   status: z.literal("success"),
   ...ProjectSchema.shape,
});

const ErrorResponseSchema = z.object({
   status: z.literal("error"),
   description: z.string(),
});

export const createCheckRoute = createRoute({
   summary: "Add a checklist item to a project",
   description: "Append a new check entry to an existing project observation checklist",
   path: "/:projectId/checks",
   method: "post",
   tags: ["Projects"],
   request: {
      params: ParamsSchema,
      body: jsonContentRequired(
         CreateCheckRequestSchema,
         "Checklist item to add to the project",
      ),
   },
   responses: {
      [HttpStatusCodes.OK]: jsonContent(
         SuccessResponseSchema,
         "Project record with the added checklist item",
      ),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
         ErrorResponseSchema,
         "Project not found or invalid data",
      ),
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
         ErrorResponseSchema,
         "Internal server error",
      ),
   },
});

export type CreateCheckRoute = typeof createCheckRoute;
