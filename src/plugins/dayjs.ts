import dayjs, { Dayjs } from "dayjs"

// Formats
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/ru"

// Types
interface DayjsPlugin {
	$dayjs(
		date?: dayjs.ConfigType,
		format?: dayjs.OptionType,
		locale?: string,
		strict?: boolean
	): Dayjs
}

declare module "#app" {
	interface NuxtApp extends DayjsPlugin {}
}

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties extends DayjsPlugin {}
}

export default defineNuxtPlugin(() => {
	dayjs.extend(customParseFormat)
	dayjs.locale("ru")

	return {
		provide: { dayjs }
	}
})
