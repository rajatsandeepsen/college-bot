import { defineHook } from "eve/hooks";

export default defineHook({
	events: {
		"*": (event, ctx) => {
			console.log(event.type, ":", ctx.session);
		},
	},
});
