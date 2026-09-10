import { defineHook } from "eve/hooks";

export default defineHook({
	events: {
		async "session.started"(_event, ctx) {
			console.info("session started", { sessionId: ctx.session.id });
		},
		async "message.completed"(event) {
			console.info("model finished", {
				length: event.data.message?.length ?? 0,
			});
		},
	},
});
