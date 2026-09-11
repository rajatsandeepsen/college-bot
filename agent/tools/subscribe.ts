import type { SessionAuthContext } from "eve/context";
import { defineTool } from "eve/tools";
import { z } from "zod";

const checkTelegramAuth = (data: SessionAuthContext | null) => {
	if (data?.issuer !== "telegram")
		throw new Error("This tool requires an authenticated Telegram user.");

	const telegramUserId = data.attributes.user_id;
	const chatId = data.attributes.chat_id;

	console.log({ telegramUserId, chatId });

	if (!telegramUserId || !chatId) {
		throw new Error("The Telegram user or chat ID is unavailable.");
	}
};

export default defineTool({
	description:
		"To subscribe the user to get real time notifications and alert about campus events.",
	inputSchema: z.object({
		categories: z.enum(["all", "tech"]),
	}),
	async execute(input, ctx) {
		checkTelegramAuth(ctx.session.auth.current);
		return { subscribed: true, input };
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
