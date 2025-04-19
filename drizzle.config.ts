import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema",
  out: "./src/server/db/migrations",
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!,
  },
});
