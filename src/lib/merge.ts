import type { users } from "@/db";

export type Subscription = NonNullable<
	(typeof users.$inferSelect)["subscriptions"]
>[number];

export type Dimension = "category" | "type" | "club" | "department";

export type SubscriptionInput = Partial<{
	categories: string;
	types: string;
	clubs: string;
	departments: string;
}>;

const mergeDimension = (
	current: Subscription[],
	prefix: Dimension,
	data: string,
): Subscription[] => {
	const [parent, value] = data.split(":");

	if (value === "all") {
		const rest = current.filter((s) => !s.startsWith(`${prefix}:`));
		return [...rest, `${prefix}:all`];
	}

	const tag = `${prefix}:${value}` as Subscription;
	const next = current.filter((s) => s !== `${prefix}:all`);

	if (next.includes(tag)) return next;
	return [...next, tag];
};

export const mergeSubscriptions = (
	current: Subscription[],
	input: SubscriptionInput,
) => {
	let subscriptions = [...current];

	if (input.categories)
		subscriptions = mergeDimension(subscriptions, "category", input.categories);
	if (input.types)
		subscriptions = mergeDimension(subscriptions, "type", input.types);
	if (input.clubs)
		subscriptions = mergeDimension(subscriptions, "club", input.clubs);
	if (input.departments)
		subscriptions = mergeDimension(
			subscriptions,
			"department",
			input.departments,
		);

	return subscriptions;
};
