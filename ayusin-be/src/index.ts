import { serve } from "bun";

import app from "./app";
import { connectDB } from "./config/db";
import env from "./env";

const port = env.PORT;

connectDB(env.MONGODB_URI);

console.log(`🚀 Server starting on PORT ${port}...`);

serve({
	fetch: app.fetch,
	port,
});
