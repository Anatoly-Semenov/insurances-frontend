import { Calculator } from "@common-repo/types/src"
import { CalculatorMarkdown } from "~/types"

export function useCalculatorMarkdown(type: Calculator.Type): string {
	switch (type) {
		case Calculator.TypeEnum.ECO:
			return CalculatorMarkdown.ECO
		case Calculator.TypeEnum.BREAK:
			return CalculatorMarkdown.BREAK
		default:
			return ""
	}
}
