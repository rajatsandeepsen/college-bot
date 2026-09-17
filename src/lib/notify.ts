import type { events } from "@/db";

type Event = typeof events.$inferSelect;

export const formatEventMessage = (event: Event) => {
	const lines = [
		`📢 ${event.name}`,
		`Category: ${event.category} · Type: ${event.type}`,
	];

	if (event.club !== "unknown") lines.push(`Club: ${event.club}`);
	if (event.department !== "unknown")
		lines.push(`Department: ${event.department}`);

	Object.entries(event.data).forEach(([key, value]) => {
		lines.push(`${key}: ${String(value)}`);
	});

	return lines.join("\n");
};
