import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";
import { clubsAsArray, departmentsAsArray } from "../college.ts";

export const users = pgTable("users", {
	id: text().primaryKey(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).unique(),
});

export const categoryEnum = pgEnum("category", ["tech", "art"]);
export const typeEnum = pgEnum("type", ["competition", "workshop", "other"]);

export const events = pgTable("events", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }),
	category: categoryEnum().default("tech").notNull(),
	type: typeEnum().default("other").notNull(),
	club: text({ enum: clubsAsArray }),
	department: text({ enum: departmentsAsArray }),
	data: jsonb().notNull(),
});
