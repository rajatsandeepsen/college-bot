import { eq } from "drizzle-orm";
import { defaultTelegramAuth, telegramChannel } from "eve/channels/telegram";
import { clubs, departments } from "@/college";
import { db, users } from "@/db";
import { getEventsByFilter, getEventsKeyboard } from "@/lib/events.ts";
import { formatEventMessage } from "@/lib/notify.ts";
import { formatSubscriptions, formatUserProfile } from "@/lib/subscriptions.ts";

export default telegramChannel({
	botUsername: "sjcet_bot",
	credentials: {
		botToken: process.env.TELEGRAM_BOT_TOKEN,
		webhookSecretToken: process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN,
	},
	onMessage: async (ctx, message) => {
		if (message.chat.type !== "private" || !message.from || message.from.isBot)
			return null;

		await ctx.telegram.startTyping();

		if (!message.text.startsWith("/"))
			return {
				auth: defaultTelegramAuth(message),
			};

		const userId = message.from.id;

		switch (message.text) {
			case "/events": {
				const [user] = await db
					.select({ subscriptions: users.subscriptions })
					.from(users)
					.where(eq(users.id, userId));

				await ctx.telegram.sendMessage({
					text: "Pick an event category or view recent events:",
					reply_markup: {
						inline_keyboard: getEventsKeyboard(user?.subscriptions ?? []),
					},
				});
				return null;
			}

			case "/clubs": {
				const clubList = Object.values(clubs)
					.map((c, i) => `${i + 1}. ${c.icon} ${c.name}`)
					.join("\n");

				await ctx.telegram.sendMessage(clubList);
				return null;
			}

			case "/departments": {
				const deptList = [...new Set(Object.values(departments))]
					.map((name, i) => `${i + 1}. 🎓 ${name}`)
					.join("\n");

				await ctx.telegram.sendMessage(deptList);
				return null;
			}

			case "/me": {
				const [user] = await db
					.select()
					.from(users)
					.where(eq(users.id, userId));

				await ctx.telegram.sendMessage(formatUserProfile(user).join("\n"));
				return null;
			}

			case "/subscriptions": {
				const [user] = await db
					.select({ subscriptions: users.subscriptions })
					.from(users)
					.where(eq(users.id, userId));

				await ctx.telegram.post({
					text: formatSubscriptions(user?.subscriptions ?? []),
				});
				return null;
			}

			case "/unsubscribe": {
				await db
					.insert(users)
					.values({ id: userId, subscriptions: [] })
					.onConflictDoUpdate({
						target: users.id,
						set: { subscriptions: [] },
					});

				await ctx.telegram.sendMessage(
					"You have been unsubscribed from all campus event notifications.",
				);
				return null;
			}

			default:
				return null;
		}
	},
	async onCallbackQuery(ctx, query) {
		// Clear Telegram's loading indicator on the button.
		await ctx.telegram.answerCallbackQuery({
			callbackQueryId: query.id,
		});

		if (!query.message || !query.data) {
			return;
		}

		const [q_type, q_data] = query.data.split(":");

		switch (q_type) {
			case "events": {
				const eventList = await getEventsByFilter(q_data);

				if (!eventList || eventList.length === 0) {
					await ctx.telegram.sendMessage("No events found.");
					return;
				}

				for (const event of eventList) {
					await ctx.telegram.sendMessage(formatEventMessage(event));
				}
				break;
			}

			default:
				break;
		}
	},
});
