import {
	categories,
	categoryKeys,
	clubKeys,
	clubs,
	departmentKeys,
	departments,
	eventTypes,
	typeKeys,
} from "@/college";
import type { Subscription, SubscriptionInput } from "./merge.ts";

export const dimensionLabels = {
	category: "Category",
	type: "Type",
	club: "Club",
	department: "Department",
} as const;

export type SubscriptionDimension = keyof typeof dimensionLabels;

export const formatSubscription = (tag: Subscription) => {
	const [dimension, value] = tag.split(":");

	switch (dimension) {
		case "category": {
			if (value === "all") return "Category: all";
			const category = categories[value as keyof typeof categories];
			return category
				? `Category: ${category.icon} ${category.name}`
				: `Category: ${value}`;
		}
		case "type": {
			if (value === "all") return "Type: all";
			const type = eventTypes[value as keyof typeof eventTypes];
			return type ? `Type: ${type.icon} ${type.name}` : `Type: ${value}`;
		}
		case "club": {
			if (value === "all") return "Club: all";
			const club = clubs[value as keyof typeof clubs];
			return club ? `Club: ${club.icon} ${club.name}` : `Club: ${value}`;
		}
		case "department": {
			if (value === "all") return "Department: all";
			const department = departments[value as keyof typeof departments];
			return department ? `Department: ${department}` : `Department: ${value}`;
		}
		default:
			return tag;
	}
};

export const formatSubscriptions = (subscriptions: Subscription[]) => {
	if (!subscriptions.length) {
		return "You have no active subscriptions.";
	}

	return [
		"Your subscriptions:",
		...subscriptions.map((tag) => `• ${formatSubscription(tag)}`),
	].join("\n");
};

export const dimensionMenu = () => [
	[
		{ text: "Categories", callback_data: "menu:category" },
		{ text: "Types", callback_data: "menu:type" },
	],
	[
		{ text: "Clubs", callback_data: "menu:club" },
		{ text: "Departments", callback_data: "menu:department" },
	],
];

const optionRows = (
	dimension: SubscriptionDimension,
	keys: string[],
	label: (key: string) => string,
) => {
	const rows = keys.map((key) => [
		{
			text: label(key),
			callback_data: `subscribe:${dimension}:${key}`,
		},
	]);

	rows.unshift([
		{
			text: `All ${dimensionLabels[dimension].toLowerCase()}s`,
			callback_data: `subscribe:${dimension}:all`,
		},
	]);

	return rows;
};

export const dimensionKeyboard = (dimension: SubscriptionDimension) => {
	switch (dimension) {
		case "category":
			return optionRows("category", categoryKeys, (key) => {
				const category = categories[key as keyof typeof categories];
				return category ? `${category.icon} ${category.name}` : key;
			});
		case "type":
			return optionRows("type", typeKeys, (key) => {
				const type = eventTypes[key as keyof typeof eventTypes];
				return type ? `${type.icon} ${type.name}` : key;
			});
		case "club":
			return optionRows("club", clubKeys, (key) => {
				const club = clubs[key as keyof typeof clubs];
				return club ? `${club.icon} ${club.name}` : key;
			});
		case "department":
			return optionRows("department", departmentKeys, (key) => {
				const department = departments[key as keyof typeof departments];
				return department ?? key;
			});
	}
};

export const toSubscriptionInput = (
	dimension: string,
	value: string,
): SubscriptionInput => {
	const tag = `${dimension}:${value}` as Subscription;

	switch (dimension) {
		case "category":
			return { categories: tag };
		case "type":
			return { types: tag };
		case "club":
			return { clubs: tag };
		case "department":
			return { departments: tag };
		default:
			return {};
	}
};

export const parseCallbackData = (data?: string) => {
	const [action, dimension, ...valueParts] = data?.split(":") ?? [];
	return {
		action,
		dimension,
		value: valueParts.join(":"),
	};
};

export const isSubscriptionDimension = (
	dimension: string,
): dimension is SubscriptionDimension => dimension in dimensionLabels;
