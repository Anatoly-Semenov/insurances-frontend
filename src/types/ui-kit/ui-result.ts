export namespace UiResult {
	export type status =
		| "success"
		| "error"
		| "info"
		| "warning"
		| "404"
		| "403"
		| "500"

	export enum statusEnum {
		SUCCESS = "success",
		ERROR = "error",
		INFO = "info",
		WARNING = "warning",
		NOT_FOUND = "404",
		FORBIDDEN = "403",
		INTERNAL_SERVER = "500"
	}
}
