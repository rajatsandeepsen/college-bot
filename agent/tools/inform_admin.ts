import {
	sendTelegramMessage,
	splitTelegramMessageText,
} from "eve/channels/telegram";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
	description:
		"To inform the person who build this bot, aka admin. About bugs, issues, misinformation about events etc",
	inputSchema: z.object({ message: z.string() }),
	async execute({ message }) {
		const chatId = process.env.TELEGRAM_ADMIN_ID;

		const chunks = splitTelegramMessageText(message);

		for (const text of chunks) {
			await sendTelegramMessage({
				chatId,
				body: { text },
			});
		}
	},
	label: {
		start: () => `Informing admin`,
		complete: () => `Informed admin`,
	},
});
