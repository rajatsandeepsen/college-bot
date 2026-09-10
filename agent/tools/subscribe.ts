import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
	description: "Subscribe the current Telegram user to future notifications.",
	inputSchema: z.object({}),
	async execute(_input, ctx) {
		const caller = ctx.session.auth.current;

		console.log(JSON.stringify(caller, null, 4));

		if (!caller || caller.principalType !== "user") {
			throw new Error("This tool requires an authenticated Telegram user.");
		}

		const telegramUserId = caller.attributes.user_id;
		const chatId = caller.attributes.chat_id;

		if (!telegramUserId || !chatId) {
			throw new Error("The Telegram user or chat ID is unavailable.");
		}

		return { subscribed: true };
	},
});
