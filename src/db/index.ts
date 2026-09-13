import { defineRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const relations = defineRelations(schema, (r) => ({}));

const client = postgres(process.env.DATABASE_URL, {
	prepare: false,
});

export const db = drizzle<typeof relations>({ client });
