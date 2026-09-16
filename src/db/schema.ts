import {
	index,
	integer,
	interval,
	jsonb,
	pgEnum,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";
import {
	categoryKeys,
	clubKeys,
	departmentKeys,
	typeKeys,
} from "../college.ts";
import { createdAt, updatedAt } from "./utils.ts";

export const categoryEnum = pgEnum("category", ["other", ...categoryKeys]);
export const typeEnum = pgEnum("type", ["other", ...typeKeys]);

export const users = pgTable(
	"users",
	{
		id: text().primaryKey(),
		name: varchar({ length: 255 }),
		email: varchar({ length: 255 }).unique(),
		createdAt: createdAt(),
		updatedAt: updatedAt(),

		subscriptions: text({
			enum: [
				"category:all",
				...categoryEnum.enumValues.map((c) => `category:${c}` as const),
				"type:all",
				...typeEnum.enumValues.map((c) => `type:${c}` as const),
				"club:all",
				...clubKeys.map((c) => `club:${c}` as const),
				"department:all",
				...departmentKeys.map((c) => `department:${c}` as const),
			],
		})
			.array()
			.default([]),
	},
	(table) => [
		index("users_name_idx").on(table.name),
		index("users_subscriptions_idx").using("gin", table.subscriptions),
	],
);

export const events = pgTable("events", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }),
	category: categoryEnum().default("other").notNull(),
	type: typeEnum().default("other").notNull(),
	club: text({ enum: ["unknown", ...clubKeys] })
		.default("unknown")
		.notNull(),
	department: text({ enum: ["unknown", ...departmentKeys] })
		.default("unknown")
		.notNull(),
	data: jsonb().notNull(),
	createdAt: createdAt(),
	updatedAt: updatedAt(),
	expiresAfter: interval("expires_after"),
});
