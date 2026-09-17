import { arrayOverlaps, eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-orm/zod";
import {
	sendTelegramMessage,
	splitTelegramMessageText,
} from "eve/channels/telegram";
import { defineDynamic, defineTool } from "eve/tools";
import { z } from "zod";
import { db, events, users } from "@/db";
import { formatEventMessage } from "@/lib/notify.ts";
import { checkTelegramAuth } from "./print_info";

const inputSchema = createSelectSchema(events, {
	name: z.string().min(1),
})
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		data: true,
	})
	.partial({
		category: true,
		type: true,
		club: true,
		department: true,
		expiresAfter: true,
	})
	.extend({
		data: z.record(z.string(), z.string()).default({}),
	});

export default defineDynamic({
	events: {
		"turn.started": (_event, ctx) => {
			const id = checkTelegramAuth(ctx.session.auth.current);

			if (id !== process.env.TELEGRAM_ADMIN_ID) return null;

			return {
				add_event: defineTool({
					description:
						"Add a new campus event to the database so students can get notified.",
					inputSchema,
					async execute(input) {
						console.log(input.data, typeof input.data);
						const [event] = await db.insert(events).values(input).returning();

						return { created: true, event };
					},
					toModelOutput: (out) => {
						if (!out.created || !out.event)
							return { type: "text", value: "Failed to add event." };

						return {
							type: "text",
							value: `Event added: ${out.event.name} (id: ${out.event.id})`,
						};
					},
				}),
				send_notification: defineTool({
					execution: "background",
					description:
						"Notify subscribed students about the event that was just created.",
					inputSchema: z.object({
						eventId: z.number(),
					}),
					async execute({ eventId }) {
						const [event] = await db
							.select()
							.from(events)
							.where(eq(events.id, eventId));

						if (!event) throw new Error(`Event ${eventId} not found`);

						const recipients = await db
							.select({ id: users.id })
							.from(users)
							.where(
								arrayOverlaps(
									users.subscriptions,
									Object.entries({
										category: event.category,
										type: event.type,
										club: event.club,
										department: event.department,
									}).flatMap(([prefix, value]) => [
										`${prefix}:${value}`,
										`${prefix}:all`,
									]) as never,
								),
							);

						const text = formatEventMessage(event);
						const chunks = splitTelegramMessageText(text);

						for (const user of recipients) {
							for (const chunk of chunks) {
								await sendTelegramMessage({
									chatId: user.id,
									body: { text: chunk },
								});
							}
						}

						return { notified: true, eventId, sent: recipients.length };
					},
					toModelOutput: () => ({
						type: "text",
						value: `Started senting notifications to subscribers`,
					}),
				}),
			};
		},
	},
});
