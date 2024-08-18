export namespace UiInput {
	export type Type =
		| "textarea"
		| "color"
		| "date"
		| "datetime-local"
		| "email"
		| "month"
		| "number"
		| "url"
		| "week"
		| "search"
		| "tel"
		| "text"
		| "password"
		| "submit"
		| "reset"
		| "radio"
		| "checkbox"
		| "button"
		| "file"
		| "image"

	export enum TypeEnum {
		TEXTAREA = "textarea",
		COLOR = "color",
		DATE = "date",
		DATETIME = "datetime-local",
		EMAIL = "email",
		MONTH = "month",
		NUMBER = "number",
		URL = "url",
		WEEK = "week",
		SEARCH = "search",
		TEL = "tel",
		TEXT = "text",
		PASSWORD = "password",
		SUBMIT = "submit",
		RESET = "reset",
		RADIO = "radio",
		CHECKBOX = "checkbox",
		BUTTON = "button",
		FILE = "file",
		IMAGE = "image"
	}

	export type Size = "large" | "default" | "small"

	export enum SizeEnum {
		LARGE = "large",
		DEFAULT = "default",
		SMALL = "small"
	}
}
