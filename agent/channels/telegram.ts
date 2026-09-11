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
				return null;

			case "/unsubscribe":
				await ctx.telegram.sendMessage("unsubscribed");
				return null;

			default:
				return null;
		}
	},
});
