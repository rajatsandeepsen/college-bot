import { telegram } from "./telegram";

const { data, error } = await telegram("/setMyCommands", {
	body: {
		scope: { type: "all_private_chats" },
		commands: [
			{
				command: "me",
				description: "view your profile & preferences that the bot reads",
			},
			{
				command: "clubs",
				description: "list clubs on the campus",
			},
			{
				command: "departments",
				description: "list departments on the campus",
			},
			{
				command: "subscriptions",
				description: "list all my future notification",
			},
			{
				command: "unsubscribe",
				description: "remove me from all future notification",
			},
		],
	},
});

console.log({ data, error });
