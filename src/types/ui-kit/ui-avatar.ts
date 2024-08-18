export namespace UiAvatar {
	export type Size =
		| number
		| "large" /* 75px */
		| "small" /* 36px */
		| "default" /* 36px */

	export type Shape = "circle" | "square"

	export enum SizeEnum {
		LARGE = "large" /* 75px */,
		SMALL = "small" /* 36px */,
		DEFAULT = "default" /* 36px */
	}

	export enum ShapeEnum {
		CIRCLE = "circle",
		SQUARE = "square"
	}
}
