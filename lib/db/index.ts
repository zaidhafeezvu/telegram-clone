import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Get connection string
const connectionString =
	process.env.DATABASE_URL || "postgresql://localhost:5432/telegram";

const pool = new Pool({
	connectionString,
});

export const db = drizzle({ client: pool, schema });
