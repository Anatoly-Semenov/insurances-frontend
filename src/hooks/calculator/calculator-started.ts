// Store
import { useConfigStore } from "~/store"

export function useCalculatorStarted(staredAt: string = "") {
	const configStore = useConfigStore()
	const { $dayjs } = useNuxtApp()

	if (!staredAt) {
		staredAt = $dayjs().format(configStore.getFormatDates)
	}

	const finishedAt = $dayjs(staredAt, configStore.getFormatDates)
		.add(1, "year")
		.add(-1, "d")
		.format(configStore.getFormatDates)

	return { staredAt, finishedAt }
}
