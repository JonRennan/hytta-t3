import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["hytta-t3_*"],
  out: "./src/server/db/migrations",
  casing: "snake_case",
} satisfies Config;
