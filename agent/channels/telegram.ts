import { defaultTelegramAuth, telegramChannel } from "eve/channels/telegram";

export default telegramChannel({
	botUsername: "sjcet_bot",
	credentials: {
		botToken: process.env.TELEGRAM_BOT_TOKEN,
		webhookSecretToken: process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN,
	},
	onMessage: (ctx, message) => {
		console.log(ctx.telegram);
		console.log("message.text", message.text);
		console.log("chat.id", message.chat.id);

		if (message.chat.type !== "private" || !message.from || message.from.isBot)
			return null;

		if (message.text === "subscribe") ctx.telegram.sendMessage("subscribed");

		return {
			auth: defaultTelegramAuth(message),
		};
	},
});
