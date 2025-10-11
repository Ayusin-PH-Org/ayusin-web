import * as HttpStatusCodes from "stoker/http-status-codes";
import createApp from "./lib/create-app";
import configureOpenAPI from "./lib/openapi-spec";
import departments from "./routes/departments/index";
import index from "./routes/index";
import members from "./routes/members/index";
import reports from "./routes/reports/index";
import roles from "./routes/roles/index";

const app = createApp();
configureOpenAPI(app);

app.onError((err, c) => {
	c.var.logger.error("Something went wrong!", err.cause, err.stack);
	return c.json(
		{
			status: "error",
			description: `Something went wrong: ${err.message}`,
		},
		HttpStatusCodes.INTERNAL_SERVER_ERROR,
	);
});

const routes = [index, reports, departments, roles, members];

routes.forEach((route) => {
	app.route("/", route);
});

export default app;
