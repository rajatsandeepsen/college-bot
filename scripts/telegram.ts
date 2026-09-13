import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
import {
	botCommandScopeSchema,
	commandSchema,
	languageCodeSchema,
} from "./schema";

const schema = createSchema({
	"/setWebhook": {
		method: "post",
		input: z.object({
			url: z.url(),
			max_connections: z.number().int().min(1).max(100).optional(),
			allowed_updates: z.array(z.string()).optional(),
			drop_pending_updates: z.boolean().optional(),
			secret_token: z
				.string()
				.min(1)
				.max(256)
				.regex(/^[A-Za-z0-9_-]+$/)
				.optional(),
		}),
	},
	"/setMyCommands": {
		method: "post",
		input: z.object({
			commands: z.array(commandSchema).min(1).max(100),
			scope: botCommandScopeSchema.optional(),
			language_code: languageCodeSchema.optional(),
		}),
	},
	"/sendMessage": {
		method: "post",
		input: z.object({
			chat_id: z.string().min(1),
			text: z.string().min(1).max(4096),
		}),
	},
});

export const telegram = createFetch({
	baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`,
	schema: schema,
	defaultOutput: z.object({
		ok: z.boolean(),
		error_code: z.number(),
		description: z.string(),
	}),
});
