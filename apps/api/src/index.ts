import { env } from "./config/env.js";
import { initializeDatabase } from "./db/init.js";
import { createServer } from "./server.js";

async function bootstrap(): Promise<void> {
  await initializeDatabase();

  const app = createServer();

  app.listen(env.PORT, () => {
    console.log(`OfferPilot API listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
