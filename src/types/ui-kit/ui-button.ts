export namespace UiButton {
	export type Type =
		| "primary"
		| "secondary"
		| "ghost"
		| "dashed"
		| "danger"
		| "link"
		| "default"

	export enum TypeEnum {
		PRIMARY = "primary",
		SECONDARY = "secondary",
		GHOST = "ghost",
		DASHED = "dashed",
		DANGER = "danger",
		LINK = "link",
		DEFAULT = "default"
	}

	export type Size = "small" | "large" | "default"

	export enum SizeEnum {
		SMALL = "small",
		LARGE = "large",
		DEFAULT = "default"
	}

	export type Shape = "default" | "circle" | "round"

	export enum ShapeEnum {
		DEFAULT = "default",
		CIRCLE = "circle",
		ROUND = "round"
	}
}
