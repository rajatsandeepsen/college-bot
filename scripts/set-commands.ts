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
			{
				command: "events",
				description: "",
			},
			{
				command: "clubs",
				description: "",
			},
		],
	},
});

console.log({ data, error });
