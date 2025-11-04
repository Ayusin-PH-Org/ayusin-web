import mongoose from "mongoose";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { Project } from "../../../../db";
import { projectDocToZod } from "../../schema";
import type { CreateCheckRoute } from "./routes";

export const createCheckHandler: AppRouteHandler<CreateCheckRoute> = async (c) => {
   const { projectId } = c.req.valid("param");
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

      project.observationChecklist.checks.push({
         checkID: new mongoose.Types.ObjectId(),
         description,
         status,
         note: internalNotes ?? "",
      });
      await project.save();

      return c.json(
         { status: "success", ...projectDocToZod(project) },
         HttpStatusCodes.OK,
      );
   } catch (error) {
      c.var.logger.error(error);
      return c.json(
         { status: "error", description: "Adding check failed." },
         HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
   }
};
