import { eq } from "drizzle-orm";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { clubKeys, departmentKeys } from "@/college";
import { categoryEnum, db, typeEnum, users } from "@/db";
import { mergeSubscriptions } from "@/lib/merge.ts";
import { checkTelegramAuth } from "./print_info.ts";

const inputSchema = z.object({
	categories: z
		.enum(["all", ...categoryEnum.enumValues])
		.transform((e) => `category:${e}` as const)
		.optional(),
	types: z
		.enum(["all", ...typeEnum.enumValues])
		.transform((e) => `type:${e}` as const)
		.optional(),
	clubs: z
		.enum(["all", ...clubKeys])
		.transform((e) => `club:${e}` as const)
		.optional(),
	departments: z
		.enum(["all", ...departmentKeys])
		.transform((e) => `department:${e}` as const)
		.optional(),
});
/*
.transform((d, ctx) => {
	const subs = [d.categories, d.clubs, d.departments, d.types].filter(
		(item) => item !== undefined,
	);

	if (subs.length !== 0) return subs;

	ctx.issues.push({
		code: "too_small",
		minimum: 1,
		input: d,
		origin: "array",
	});

	return z.NEVER;
});
 */

export default defineTool({
	description:
		"To subscribe the user to get real time notifications and alert about campus events. Pass only the filters to add — existing subscriptions are kept.",
	inputSchema,
	async execute(input, ctx) {
		const id = checkTelegramAuth(ctx.session.auth.current);

		const [existing] = await db
			.select({ subscriptions: users.subscriptions })
			.from(users)
			.where(eq(users.id, id));

		const subscriptions = mergeSubscriptions(
			existing?.subscriptions ?? [],
			input,
		);

		await db
			.insert(users)
			.values({ id, subscriptions })
			.onConflictDoUpdate({
				target: users.id,
				set: { subscriptions, updatedAt: new Date() },
			});

		return { subscribed: true, input, subscriptions };
	},
	toModelOutput: (out) => {
		if (out.subscribed)
			return {
				type: "text",
				value: `You have been subscribed to campus events: ${out.subscriptions.join(", ")}`,
			};

		return {
			type: "text",
			value: `Unable to subscribe`,
		};
	},
});
