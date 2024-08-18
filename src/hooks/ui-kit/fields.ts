// Store
import { useConfigStore } from "~/store"

// Types
import { UiRadio } from "~/types"
import { Dayjs } from "dayjs"

export function useFields() {
	const isFocus = ref<boolean>(false)
	const isValidation = ref<boolean>(false)

	const onClick = (isDisabled: boolean): void => {
		if (!isValidation.value && !isDisabled) {
			isValidation.value = true
		}

		if (!isFocus.value && !isDisabled) {
			isFocus.value = true
		}
	}

	const onClickAway = (): void => {
		if (isFocus.value) isFocus.value = false
	}

	const titleFactory = (title: string, error: string): string => {
		let titleReady: string = title || ""

		if (error && isValidation.value) titleReady += ` - ${error}`

		return titleReady
	}

	function prepareOptions(list: string[]): UiRadio.Options {
		return list.map((item: string) => {
			return {
				value: item,
				label: item
			}
		})
	}

	const selectorFactory = ({
		isReadOnly = false,
		disabled = false,
		componentName = "",
		active = false,
		error = "",
		title = "",
		size = ""
	}): any => {
		let selectorReady = componentName

		// State
		if (isFocus.value) selectorReady += " _focus"
		if (title) selectorReady += " _title"
		if (disabled) selectorReady += " _disabled"
		if (isReadOnly) selectorReady += " _read-only"
		if (active) selectorReady += " _active"
		if (error && isValidation.value) selectorReady += " _error"

		// Size
		if (typeof size === "string") {
			selectorReady += ` _${size}`
		}

		return selectorReady
	}

	const numberFormatterRegex = /\B(?=(\d{3})+(?!\d))/g
	const numberParserRegex = /\s?|( *)/g
	const numberParserRubRegex = /\₽\s?|( *)/g

	const numberFormatter = (value: string | number): string => {
		return `${value}`.replace(numberFormatterRegex, " ")
	}

	const numberRubFormatter = (value: string | number): string => {
		return `₽ ${value}`.replace(numberFormatterRegex, " ")
	}

	const numberParser = (value: string): string => {
		return value.replace(numberParserRegex, "")
	}

	const numberRubParser = (value: string): string => {
		return value.replace(numberParserRubRegex, "")
	}

	const beforeTodayDisabled = (current: Dayjs): any => {
		const { $dayjs } = useNuxtApp()

		return $dayjs().add(-1, "d").isAfter(current)
	}

	function disabledBeforeDate(date: string): (current: Dayjs) => boolean {
		const configStore = useConfigStore()
		const { $dayjs } = useNuxtApp()

		return (current) =>
			$dayjs(date, configStore.getFormatDates).isAfter(current)
	}

	const afterTodayDisabled = (current: Dayjs): any => {
		const { $dayjs } = useNuxtApp()

		return $dayjs().isBefore(current)
	}

	return {
		beforeTodayDisabled,
		afterTodayDisabled,
		disabledBeforeDate,
		numberRubFormatter,
		numberFormatter,
		numberRubParser,
		selectorFactory,
		prepareOptions,
		isValidation,
		titleFactory,
		numberParser,
		onClickAway,
		isFocus,
		onClick
	}
}
