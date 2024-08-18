import { Calculator } from "@common-repo/types/src"

export function useCalculatorConfig(
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	const isCustomCalculator: boolean =
		calculatorType === Calculator.TypeEnum.AGRO

	return {
		isCustomCalculator
	}
}
