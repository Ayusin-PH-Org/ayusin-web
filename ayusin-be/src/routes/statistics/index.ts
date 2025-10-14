import { createRouter } from "@/lib/create-app";
import { getReportStatisticsRoute } from "./routes";
import { getReportStatisticsHandler } from "./handlers";

const router = createRouter()
	.basePath("/statistics")
	.openapi(getReportStatisticsRoute, getReportStatisticsHandler);

export default router;
