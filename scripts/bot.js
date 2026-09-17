const res = await fetch(`https://api.telegram.org/bot<1234567890>/setWebhook`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		url: `https://sjcet-bot.vercel.app/eve/v1/telegram`,
		secret_token: "<1234567890>",
		allowed_updates: ["message", "callback_query"],
	}),
});

// node ./bot.js
