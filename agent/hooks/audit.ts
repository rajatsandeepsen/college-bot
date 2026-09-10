import { defineHook } from "eve/hooks";

export default defineHook({
	events: {
		async "session.started"(_event, ctx) {
			console.info("session started", ctx);
		},
	},
});
