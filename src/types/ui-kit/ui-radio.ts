export namespace UiRadio {
	export interface Option {
		label?: any
		value?: string | number | null
		children?: Omit<Option, "children">[]
		disabled?: boolean
		[name: string]: any
	}

	export type Options = Option[]

	export type OptionType = "default" | "button"

	export enum OptionTypeEnum {
		DEFAULT = "default",
		BUTTON = "button"
	}

	export type ButtonStyle = "outline" | "solid"

	export enum ButtonStyleEnum {
		OUTLINE = "outline",
		SOLID = "solid"
	}

	export type Size = "large" | "default" | "small"

	export enum SizeEnum {
		LARGE = "large",
		DEFAULT = "default",
		SMALL = "small"
	}
}
