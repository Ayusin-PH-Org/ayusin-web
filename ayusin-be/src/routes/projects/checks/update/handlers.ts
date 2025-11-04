import mongoose from "mongoose";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Project } from "../../../../db";
import { projectDocToZod } from "../../schema";
import type { UpdateCheckRoute } from "./routes";

export const updateCheckHandler: AppRouteHandler<UpdateCheckRoute> = async (c) => {
   const { projectId, checkId } = c.req.valid("param");
   const { description, status, internalNotes } = c.req.valid("json");
   try {
      const project = await Project.findOne({
         "generalInformation.projectID": projectId,
      }).exec();
      if (project === null) {
         return c.json(
            { status: "error", description: "Project not found" },
            HttpStatusCodes.UNPROCESSABLE_ENTITY,
         );
      }

      const item = project.observationChecklist.checks.find(
         (chk) => chk.checkID.toString() === checkId,
      );
      if (!item) {
         return c.json(
            { status: "error", description: "Checklist item not found" },
            HttpStatusCodes.UNPROCESSABLE_ENTITY,
         );
      }

      item.description = description;
      item.status = status;
      item.note = internalNotes ?? "";
      await project.save();

      return c.json(
         { status: "success", ...projectDocToZod(project) },
         HttpStatusCodes.OK,
      );
   } catch (error) {
      c.var.logger.error(error);
      return c.json(
         { status: "error", description: "Updating checklist item failed." },
         HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
   }
};
