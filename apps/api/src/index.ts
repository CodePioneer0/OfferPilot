import { env } from "./config/env.js";
import { initializeDatabase } from "./db/init.js";
import { createServer } from "./server.js";

initializeDatabase();

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`OfferPilot API listening on port ${env.PORT}`);
});
