import type { EventBusKey } from "@vueuse/core"

export const getDataByInn: EventBusKey<{ name: "getDataByInn" }> =
	Symbol("symbol-key")
