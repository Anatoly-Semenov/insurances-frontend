// Hooks
import { useStore, useCalculatorConfig } from "~/hooks"

// Types
import { Calculator } from "@common-repo/types/src"

export function useCalculatorTotal(
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	const { isCustomCalculator } = useCalculatorConfig(calculatorType)

	const { store } = useStore(calculatorType)

	const cv = computed((): number => {
		return isCustomCalculator ? 0 : store.getFieldPayment("main", "cv")
	})

	const sumInsured = computed((): number => {
		return isCustomCalculator ? 0 : store.getFieldPayment("price", "sumInsured")
	})

	const price = computed((): number => {
		const value: number = store.getPrice

		if (value) {
			return Math.round(Number(value.toFixed(2)) * 100) / 100
		}

		return 0
	})

	const priceRub = computed((): number => {
		const value: number = price.value * (cv.value / 100)

		if (value) {
			return Math.round(Number(value.toFixed(2)) * 100) / 100
		}

		return 0
	})

	return { cv, sumInsured, price, priceRub }
}
