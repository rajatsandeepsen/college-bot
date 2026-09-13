import type { SessionAuthContext } from "eve/context";
import { defineTool } from "eve/tools";
import { z } from "zod";

export const checkTelegramAuth = (data: SessionAuthContext | null) => {
	if (data?.issuer !== "telegram")
		throw new Error("This tool requires an authenticated Telegram user.");

	const userId = data.attributes.user_id as string;
	const chatId = data.attributes.chat_id as string;

	console.log("user:", { userId, chatId });
	console.log("attributes:", data.attributes);

	if (!userId || !chatId) {
		throw new Error("The Telegram user ID or chat ID is unavailable.");
	}

	return userId ?? chatId;
};

export default defineTool({
	description: "To print information about user",
	inputSchema: z.object({}),
	async execute(_, ctx) {
		checkTelegramAuth(ctx.session.auth.current);
	},
	label: {
		start: () => `Printing info`,
		complete: () => `Printed info`,
	},
});
