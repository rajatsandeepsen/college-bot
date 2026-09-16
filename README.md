# College Bot Workshop

Let's build a bot using [eve](https://eve.dev) framework.

## Requirements

- Install [git](https://git-scm.com/install)
- Install [nodejs](https://nodejs.org) or [bun](https://bun.sh) if you're cool
- Create a [sarvam](https://dashboard.sarvam.ai) account
- Create a [github](https://github.com/signup) account and repo
- Install [telegram](https://telegram.org) and create an account
- Create a [telegram bot](https://t.me/BotFather) via BotFather
- Create a [vercel](https://vercel.com/signup) account

## Basic

### Init

```bash
npx eve@latest init my-agent
cd my-agent
npm install
npm install sarvam-ai-sdk
```

### Create a .env file

```env
SARVAM_API_KEY=
TELEGRAM_BOT_TOKEN=
# any random code to secure your bot
TELEGRAM_WEBHOOK_SECRET_TOKEN=
# after deploying to vercel
EVE_SERVER_URL=
```

### Add Your AI

```ts
// agent/agent.ts
import { defineAgent } from "eve";
import { sarvam } from "sarvam-ai-sdk";
import { SarvamChatModelInfo } from "sarvam-ai-sdk/info";

export default defineAgent({
	model: sarvam("sarvam-105b", {
		reasoning_effort: "low",
	}),
	modelContextWindowTokens: SarvamChatModelInfo["sarvam-105b"].context_window,
	defaultTools: false,
});
```

### Create a Simple Tool

```ts
// agent/tools/get_weather.ts
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
	description: "Get the current weather for a city.",
	inputSchema: z.object({ city: z.string().min(1) }),
	async execute({ city }) {
		return { city, condition: "Sunny", temperatureF: 72 };
	},
});
```

### Add Telegram Support

```ts
// agent/channels/telegram.ts
import { defaultTelegramAuth, telegramChannel } from "eve/channels/telegram";

export default telegramChannel({
	botUsername: "your_bot_username",
	credentials: {
		botToken: process.env.TELEGRAM_BOT_TOKEN,
		webhookSecretToken: process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN,
	},
	onMessage: async (ctx, message) => {
		if (message.chat.type !== "private" || !message.from || message.from.isBot)
			return null;

		await ctx.telegram.startTyping();
		await ctx.telegram.sendMessage("Hello");

		return { auth: defaultTelegramAuth(message) };
	},
});
```

### Run

```bash
npm run dev
```

### Build

```bash
npm run build
```
