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
npx.cmd eve@latest init my-agent
cd my-agent
npm.cmd install
npm.cmd install sarvam-ai-sdk
```

### Create a .env file

```env
SARVAM_API_KEY=
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

```bash
npx eve dev
```

### Add Telegram Support

```ts
// agent/channels/telegram.ts
import { defaultTelegramAuth, telegramChannel } from "eve/channels/telegram";

export default telegramChannel({
	botUsername: "your_bot_username",
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
npx eve dev
# or
# npm run dev
```

```bash
npx eve build
# or
# npm run build
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

### Add These Scripts

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
	subscriptions: text().array().default([]),
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

Run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### Give Your Bot a Personality

```md
// agent/instructions.md
You are the campus events assistant for our college.

Help students get alerts about events on campus. Keep replies short and friendly.
Do not make up event dates or venues — search the web or say you do not know.
```

### Add Web Search

eve ships a built-in web search tool. Point it at [Exa](https://exa.ai):

```ts
// agent/tools/web_search.ts
import { webSearch } from "eve/tools/web_search";

export default webSearch({ provider: "exa" });
```

### Subscribe Tool

Tools get `ctx` at runtime — use it to read who is chatting and save to the database:

```ts
// agent/tools/subscribe.ts
import { eq } from "drizzle-orm";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { db, users } from "@/db";

export default defineTool({
	description: "Subscribe the user to campus event notifications.",
	inputSchema: z.object({
		category: z.enum(["tech", "art", "all"]).optional(),
	}),
	async execute({ category }, ctx) {
		const auth = ctx.session.auth.current;
		if (auth?.issuer !== "telegram")
			throw new Error("This tool needs a Telegram user.");

		const userId = auth.attributes.user_id as string;
		const filter = category ? `category:${category}` : "category:all";

		const [existing] = await db
			.select({ subscriptions: users.subscriptions })
			.from(users)
			.where(eq(users.id, userId));

		const subscriptions = [
			...new Set([...(existing?.subscriptions ?? []), filter]),
		];

		await db
			.insert(users)
			.values({ id: userId, subscriptions })
			.onConflictDoUpdate({
				target: users.id,
				set: { subscriptions },
			});

		return { subscribed: true, subscriptions };
	},
	toModelOutput: (out) => ({
		type: "text",
		value: `Subscribed to: ${out.subscriptions.join(", ")}`,
	}),
});
```

`toModelOutput` shapes what the model sees. The full return value is still available to channels.

### Inform the Admin

Send a proactive Telegram message from any tool:

```ts
// agent/tools/inform_admin.ts
import { sendTelegramMessage } from "eve/channels/telegram";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
	description: "Report bugs or wrong event info to the bot admin.",
	inputSchema: z.object({ message: z.string() }),
	async execute({ message }) {
		await sendTelegramMessage({
			chatId: process.env.TELEGRAM_ADMIN_ID,
			body: { text: message },
		});
	},
	label: {
		start: () => "Informing admin",
		complete: () => "Informed admin",
	},
});
```

Add to `.env`:

```env
TELEGRAM_ADMIN_ID=
```

### Admin-Only Tools (Dynamic)

`defineDynamic` lets you expose tools only when needed — here, only for the admin on each turn:

```ts
// agent/tools/admin.ts
import { eq } from "drizzle-orm";
import { sendTelegramMessage } from "eve/channels/telegram";
import { defineDynamic, defineTool } from "eve/tools";
import { z } from "zod";
import { db, events, users } from "@/db";

export default defineDynamic({
	events: {
		"turn.started": (_event, ctx) => {
			const auth = ctx.session.auth.current;
			if (auth?.attributes.user_id !== process.env.TELEGRAM_ADMIN_ID)
				return null;

			return {
				add_event: defineTool({
					description: "Add a campus event to the database.",
					inputSchema: z.object({
						name: z.string(),
						category: z.enum(["tech", "art"]),
						type: z.enum(["competition", "workshop", "other"]),
						data: z.record(z.string(), z.string()),
					}),
					async execute(input) {
						const [event] = await db
							.insert(events)
							.values(input)
							.returning();
						return { event };
					},
				}),
				notify_subscribers: defineTool({
					execution: "background",
					description: "Notify subscribed students about an event.",
					inputSchema: z.object({ eventId: z.number() }),
					async execute({ eventId }) {
						const [event] = await db
							.select()
							.from(events)
							.where(eq(events.id, eventId));

						const recipients = await db.select().from(users);

						for (const user of recipients) {
							await sendTelegramMessage({
								chatId: user.id,
								body: { text: `📢 ${event.name}` },
							});
						}

						return { sent: recipients.length };
					},
				}),
			};
		},
	},
});
```

`execution: "background"` runs long work without blocking the chat reply.

### Handle Slash Commands in Telegram

Return `null` from `onMessage` to handle a command yourself instead of starting an agent turn:

```ts
// agent/channels/telegram.ts
import { eq } from "drizzle-orm";
import { defaultTelegramAuth, telegramChannel } from "eve/channels/telegram";
import { db, users } from "@/db";

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

		if (!message.text?.startsWith("/"))
			return { auth: defaultTelegramAuth(message) };

		if (message.text === "/subscriptions") {
			const [user] = await db
				.select({ subscriptions: users.subscriptions })
				.from(users)
				.where(eq(users.id, String(message.from.id)));

			await ctx.telegram.sendMessage(
				user?.subscriptions?.join("\n") ?? "No subscriptions yet.",
			);
			return null;
		}

		return null;
	},
});
```

### Observe with Hooks

Hooks listen to runtime events. They cannot change what the model sees:

```ts
// agent/hooks/audit.ts
import { defineHook } from "eve/hooks";

export default defineHook({
	events: {
		async "session.started"(_event, ctx) {
			console.log("new session", ctx.session.id);
		},
		async "message.completed"(event) {
			console.log("reply done", event.data.message?.length);
		},
	},
});
```

### Deploy Again

```bash
npm run build
```

Push to GitHub and redeploy on Vercel with the new env vars (`EXA_API_KEY`, `DATABASE_URL`, `TELEGRAM_ADMIN_ID`).
