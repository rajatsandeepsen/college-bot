import { telegram } from "./telegram";

const { data, error } = await telegram("/setMyCommands", {
	body: {
		scope: { type: "all_private_chats" },
		commands: [
			{
				command: "subscriptions",
				description: "list all my future notification",
			},
			{
				command: "unsubscribe",
				description: "remove me from all future notification",
			},
			// {
			// 	command: "events",
			// 	description: "list recent events",
			// },
			// {
			// 	command: "clubs",
			// 	description: "list every clubs on the campus",
			// },
		],
	},
});

console.log({ data, error });
