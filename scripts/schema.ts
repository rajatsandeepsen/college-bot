import { z } from "zod";

export const commandSchema = z.object({
	command: z.string().regex(/^[a-z0-9_]{1,32}$/, "Invalid Telegram command"),
	description: z.string().min(1).max(256),
});

export const botCommandScopeSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("default"),
	}),
	z.object({
		type: z.literal("all_private_chats"),
	}),
	z.object({
		type: z.literal("all_group_chats"),
	}),
	z.object({
		type: z.literal("all_chat_administrators"),
	}),
	z.object({
		type: z.literal("chat"),
		chat_id: z.union([z.number().int(), z.string()]),
	}),
	z.object({
		type: z.literal("chat_administrators"),
		chat_id: z.union([z.number().int(), z.string()]),
	}),
	z.object({
		type: z.literal("chat_member"),
		chat_id: z.union([z.number().int(), z.string()]),
		user_id: z.number().int(),
	}),
]);

export const languageCodeSchema = z
	.string()
	.regex(/^[a-zA-Z]{2,3}([-_][a-zA-Z]{2,4})?$/);
