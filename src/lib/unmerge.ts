import type { Dimension, Subscription, SubscriptionInput } from "./merge.ts";

const unmergeDimension = (
	current: Subscription[],
	prefix: Dimension,
	value: string,
): Subscription[] => {
	if (value === "all") {
		return current.filter((s) => !s.startsWith(`${prefix}:`));
	}

	return current.filter((s) => s !== `${prefix}:${value}`);
};

export const unmergeSubscriptions = (
	current: Subscription[],
	input: SubscriptionInput,
) => {
	let subscriptions = [...current];

	if (input.categories)
		subscriptions = unmergeDimension(
			subscriptions,
			"category",
			input.categories,
		);
	if (input.types)
		subscriptions = unmergeDimension(subscriptions, "type", input.types);
	if (input.clubs)
		subscriptions = unmergeDimension(subscriptions, "club", input.clubs);
	if (input.departments)
		subscriptions = unmergeDimension(
			subscriptions,
			"department",
			input.departments,
		);

	return subscriptions;
};
