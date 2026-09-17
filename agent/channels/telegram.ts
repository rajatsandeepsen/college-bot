import { eq } from "drizzle-orm";
import { defaultTelegramAuth, telegramChannel } from "eve/channels/telegram";
import { db, users } from "@/db";
import { formatSubscriptions } from "@/lib/subscriptions.ts";

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

		if (!query.message) {
			return;
		}

		if (query.data) {
			const [q_type, q_data] = query.data.split(":");

			console.log({ q_type, q_data });
		}
	},
});
