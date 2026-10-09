import { desc, eq } from "drizzle-orm";
import { categories, clubs, departments, eventTypes } from "@/college";
import { db, events } from "@/db";

export type EventButton = {
	text: string;
	callback_data: string;
};

export const getEventsKeyboard = (
	subscriptions: string[] = [],
): EventButton[][] => {
	const buttons: EventButton[] = [
		{ text: "Recently", callback_data: "events:recently" },
	];

	for (const tag of subscriptions) {
		const [dimension, value] = tag.split(":");
		if (!value) continue;

		if (value === "all") {
			buttons.push({
				text: `All ${dimension.charAt(0).toUpperCase() + dimension.slice(1)}s`,
				callback_data: `events:${dimension}:all`,
			});
			continue;
		}

		let label = value;
		switch (dimension) {
			case "category":
				label =
					value === "tech"
						? "Tech"
						: (categories[value as keyof typeof categories]?.name ?? value);
				break;
			case "club":
				label = value.toUpperCase();
				break;
			case "department":
				label = value.toUpperCase();
				break;
			case "type":
				label = value.charAt(0).toUpperCase() + value.slice(1);
				break;
		}

		buttons.push({
			text: label,
			callback_data: `events:${value}`,
		});
	}

	const rows: EventButton[][] = [];
	for (let i = 0; i < buttons.length; i += 2) {
		rows.push(buttons.slice(i, i + 2));
	}

	return rows;
};

export const getEventsByFilter = async (filter?: string) => {
	if (!filter || filter === "recently" || filter === "all") {
		return db.select().from(events).orderBy(desc(events.createdAt)).limit(10);
	}

	const [dim, val] = filter.includes(":") ? filter.split(":") : [];

	if (dim && val) {
		switch (dim) {
			case "category":
				return val === "all"
					? db.select().from(events).orderBy(desc(events.createdAt)).limit(10)
					: db
							.select()
							.from(events)
							.where(eq(events.category, val as never))
							.orderBy(desc(events.createdAt))
							.limit(10);
			case "club":
				return val === "all"
					? db.select().from(events).orderBy(desc(events.createdAt)).limit(10)
					: db
							.select()
							.from(events)
							.where(eq(events.club, val as never))
							.orderBy(desc(events.createdAt))
							.limit(10);
			case "department":
				return val === "all"
					? db.select().from(events).orderBy(desc(events.createdAt)).limit(10)
					: db
							.select()
							.from(events)
							.where(eq(events.department, val as never))
							.orderBy(desc(events.createdAt))
							.limit(10);
			case "type":
				return val === "all"
					? db.select().from(events).orderBy(desc(events.createdAt)).limit(10)
					: db
							.select()
							.from(events)
							.where(eq(events.type, val as never))
							.orderBy(desc(events.createdAt))
							.limit(10);
			default:
				return db
					.select()
					.from(events)
					.orderBy(desc(events.createdAt))
					.limit(10);
		}
	}

	if (filter in categories) {
		return db
			.select()
			.from(events)
			.where(eq(events.category, filter as never))
			.orderBy(desc(events.createdAt))
			.limit(10);
	}
	if (filter in clubs) {
		return db
			.select()
			.from(events)
			.where(eq(events.club, filter as never))
			.orderBy(desc(events.createdAt))
			.limit(10);
	}
	if (filter in departments) {
		return db
			.select()
			.from(events)
			.where(eq(events.department, filter as never))
			.orderBy(desc(events.createdAt))
			.limit(10);
	}
	if (filter in eventTypes) {
		return db
			.select()
			.from(events)
			.where(eq(events.type, filter as never))
			.orderBy(desc(events.createdAt))
			.limit(10);
	}

	return db.select().from(events).orderBy(desc(events.createdAt)).limit(10);
};
