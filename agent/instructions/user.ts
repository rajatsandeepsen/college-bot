import { eq } from "drizzle-orm";
import { defineDynamic, defineInstructions } from "eve/instructions";
import { db, users } from "@/db";
import { formatUserInstructions } from "@/lib/instructions.ts";
import { checkTelegramAuth } from "../tools/print_info";

export default defineDynamic({
	events: {
		"turn.started": async (_event, ctx) => {
			const caller = ctx.session.auth.current;

			const userId = checkTelegramAuth(caller);

			const [user] = await db.select().from(users).where(eq(users.id, userId));

			return defineInstructions({
				content: formatUserInstructions(user).join("\n"),
				role: "system",
			});
		},
	},
});
