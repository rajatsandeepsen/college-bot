import { eq } from "drizzle-orm";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { clubKeys, departmentKeys } from "@/college";
import { categoryEnum, db, typeEnum, users } from "@/db";
import { unmergeSubscriptions } from "@/lib/unmerge.ts";
import { checkTelegramAuth } from "./print_info.ts";

const inputSchema = z
	.object({
		categories: z.enum(["all", ...categoryEnum.enumValues]).optional(),
		types: z.enum(["all", ...typeEnum.enumValues]).optional(),
		clubs: z.enum(["all", ...clubKeys] as [string, ...string[]]).optional(),
		departments: z
			.enum(["all", ...departmentKeys] as [string, ...string[]])
			.optional(),
	})
	.refine(
		(input) =>
			input.categories !== undefined ||
			input.types !== undefined ||
			input.clubs !== undefined ||
			input.departments !== undefined,
		{
			message: "Pass at least one of categories, types, clubs, or departments.",
		},
	);

export default defineTool({
	description:
		"To unsubscribe the user from campus event notifications. Pass only the filters to remove — other subscriptions are kept.",
	inputSchema,
	async execute(input, ctx) {
		const id = checkTelegramAuth(ctx.session.auth.current);

		const [existing] = await db
			.select({ subscriptions: users.subscriptions })
			.from(users)
			.where(eq(users.id, id));

		const subscriptions = unmergeSubscriptions(
			existing?.subscriptions ?? [],
			input,
		);

		await db.insert(users).values({ id, subscriptions }).onConflictDoUpdate({
			target: users.id,
			set: { subscriptions },
		});

		return { unsubscribed: true, input, subscriptions };
	},
	toModelOutput: (out) => {
		if (out.unsubscribed) {
			const active =
				out.subscriptions.length > 0 ? out.subscriptions.join(", ") : "none";

			return {
				type: "text",
				value: `You have been unsubscribed from the selected campus event filters. Active subscriptions: ${active}`,
			};
		}

		return {
			type: "text",
			value: `Unable to unsubscribe`,
		};
	},
});
