const res = await fetch(
	`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			url: `${process.env.EVE_SERVER_URL}/eve/v1/telegram`,
			secret_token: process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN,
			allowed_updates: ["message", "callback_query"],
		}),
	},
);

const data = await res.json();
console.log(data);
