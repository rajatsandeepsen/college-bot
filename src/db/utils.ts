import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const createdAt = (name = "created_at") =>
	timestamp(name, { withTimezone: false }).default(sql`now()`).notNull();

export const updatedAt = (name = "updated_at") =>
	timestamp(name, { withTimezone: false })
		.default(sql`now()`)
		.$onUpdate(() => new Date())
		.notNull();
