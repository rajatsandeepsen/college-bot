import { telegram } from "./telegram";

const { data, error } = await telegram("/setMyCommands", {
	body: {
		scope: { type: "all_private_chats" },
		commands: [
			{
				command: "subscribe",
				description: "",
			},
			{
				command: "unsubscribe",
				description: "",
			},
		],
	},
});

console.log({ data, error });
