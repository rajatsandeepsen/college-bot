import { defaultTelegramAuth, telegramChannel } from "eve/channels/telegram";

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

		switch (message.text) {
			case "/subscribe":
				await ctx.telegram.sendMessage("subscribed");
				await ctx.telegram.post({
					text: "Subscribe to?",
					reply_markup: {
						inline_keyboard: [
							[
								{ text: "all", callback_data: "subscribe:all" },
								{ text: "tech", callback_data: "subscribe:tech" },
							],
						],
					},
				});
				return null;

			case "/unsubscribe":
				await ctx.telegram.sendMessage("unsubscribed");
				return null;

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
			if (q_type === "subscribe") {
				switch (q_data) {
					case "all":
					case "tech":
						await ctx.telegram.editMessageText({
							messageId: query.message.messageId,
							text: `You have been subscribed to '${q_data}' events from campus`,
						});
				}
			}
		}
	},
});
