import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://localhost:5432/telegram",
});

export const db = drizzle({ client: pool, schema });
