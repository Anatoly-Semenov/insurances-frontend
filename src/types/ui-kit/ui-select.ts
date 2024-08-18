export namespace UiSelect {
	export type Size = "small" | "large" | "default"

	export enum SizeEnum {
		SMALL = "small",
		LARGE = "large",
		DEFAULT = "default"
	}

	export interface Option {
		label?: any
		value?: string | number | null
		children?: Omit<Option, "children">[]
		disabled?: boolean
		[name: string]: any
	}

	export type Options = Option[]

	export enum Mode {
		MULTIPLE = "multiple",
		TAGS = "tags",
		DEFAULT = ""
	}
}
