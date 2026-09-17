# College Bot Workshop

Let's build a bot using [eve](https://eve.dev) framework.

Demo: [SJCET Bot](https://t.me/sjcet_bot)

## Requirements

- Install [git](https://git-scm.com/install)
- Install [VSCode](https://code.visualstudio.com/download) or any of your favorite IDE
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

### Run, Build, Deploy

```bash
npm run dev
```

```bash
npm run build
```

- Save this repository to your GitHub account
- Import the repository into the Vercel and deploy with necessary .env secrets

## Advanced

Let's add more features to our bot.

### Install

```bash
npm install drizzle-orm postgres @exalabs/ai-sdk
npm install -d drizzle-kit @better-fetch/fetch
```

### Add More Secrets

```env
# from https://exa.ai
EXA_API_KEY=

# from https://supabase.com
DATABASE_URL=
DATABASE_URL_DIRECT=
```

### Get Ready for Database Migration

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL_DIRECT,
	},
});
```

Add These Scripts

```jsonc
// package.json
{
	"scripts": {
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate"
	}
}
```

```ts
// src/db/schema.ts
import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text().primaryKey(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).unique(),
});

export const categoryEnum = pgEnum("category", ["tech", "art"]);
export const typeEnum = pgEnum("type", ["competition", "workshop", "other"]);

export const events = pgTable("events", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }),
	category: categoryEnum().default("tech").notNull(),
	type: typeEnum().default("other").notNull(),
	club: text({ enum: ["iedc", "ieee"] }),
	department: text({ enum: ["ai", "cse"] }),
	data: jsonb().notNull(),
});
```

```ts
// src/db/index.ts
import { defineRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const relations = defineRelations(schema, () => ({}));

const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle({ client, relations });

export * from "./schema.ts";
```
