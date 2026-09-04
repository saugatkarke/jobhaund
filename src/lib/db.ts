import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;

export const postgresClientOptions = { max: 1, prepare: false } as const;

let client: ReturnType<typeof postgres> | null = null;
let cached: Database | null = null;

export function getDb(): Database {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  client = postgres(url, postgresClientOptions);
  cached = drizzle(client, { schema });
  return cached;
}
