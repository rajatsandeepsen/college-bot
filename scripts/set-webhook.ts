import { telegram } from "./telegram";

const { data, error } = await telegram("/setWebhook", {
	body: {
		url: `${process.env.EVE_SERVER_URL}/eve/v1/telegram`,
		secret_token: process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN,
		allowed_updates: ["message", "callback_query"],
	},
});

console.log({ data, error });
