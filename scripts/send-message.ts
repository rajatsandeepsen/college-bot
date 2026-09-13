import { telegram } from "./telegram";

const { data, error } = await telegram("/sendMessage", {
	body: {
		chat_id: process.env.TELEGRAM_ADMIN_ID,
		text: "hi",
	},
});

console.log({ data, error });
