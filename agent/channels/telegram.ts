import { telegramChannel } from "eve/channels/telegram";

export default telegramChannel({
	botUsername: "sjcet_bot",
	credentials: { botToken: () => process.env.TELEGRAM_BOT_TOKEN },
});
