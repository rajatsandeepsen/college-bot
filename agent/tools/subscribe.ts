import { defineTool } from "eve/tools";
import { z } from "zod";
import { db, users } from "@/db";
import { checkTelegramAuth } from "./print_info.ts";

export default defineTool({
	description:
		"To subscribe the user to get real time notifications and alert about campus events.",
	inputSchema: z.object({
		categories: z.enum(["all", "tech"]).default("all"),
	}),
	async execute(input, ctx) {
		const id = checkTelegramAuth(ctx.session.auth.current);

		await db.insert(users).values({
			id,
		});

		return { subscribed: true, input };
	},
	label: {
		start: ({ categories }) =>
			`Subscribe to '${categories}' events from campus`,
		complete: ({ categories }, out) =>
			`Subscribed to '${categories}' events from campus`,
	},
	toModelOutput: (out) => {
		if (out.subscribed)
			return {
				type: "text",
				value: `You have been subscribed to '${out.input.categories}' events from campus`,
			};

		return {
			type: "text",
			value: `Unable to subscribe`,
		};
	},
});
