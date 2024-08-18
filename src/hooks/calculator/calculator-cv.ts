import { Calculator as CalculatorCv } from "~/types"
import { Calculator } from "@common-repo/types/src"

function minFactory(type: Calculator.Type): number {
	switch (type) {
		case Calculator.TypeEnum.OSAGO_SPECTECH:
			return CalculatorCv.CvMin.OSAGO_SPECTECH
		case Calculator.TypeEnum.SPECTECH:
			return CalculatorCv.CvMin.SPECTECH
		case Calculator.TypeEnum.ASSET:
			return CalculatorCv.CvMin.ASSET
		case Calculator.TypeEnum.ECO:
			return CalculatorCv.CvMin.ECO
		case Calculator.TypeEnum.SMR:
			return CalculatorCv.CvMin.SMR
		default:
			return CalculatorCv.CvMin.BASE
	}
}

function maxFactory(type: Calculator.Type): number {
	switch (type) {
		case Calculator.TypeEnum.OSAGO_SPECTECH:
			return CalculatorCv.CvMin.OSAGO_SPECTECH
		case Calculator.TypeEnum.KASCO:
			return CalculatorCv.CvMax.KASCO_UNKNOWN
		case Calculator.TypeEnum.SPECTECH:
			return CalculatorCv.CvMax.SPECTECH
		case Calculator.TypeEnum.ASSET:
			return CalculatorCv.CvMax.ASSET
		case Calculator.TypeEnum.BREAK:
			return CalculatorCv.CvMax.BREAK
		case Calculator.TypeEnum.ECO:
			return CalculatorCv.CvMax.ECO
		case Calculator.TypeEnum.SMR:
			return CalculatorCv.CvMax.SMR
		default:
			return CalculatorCv.CvMax.BASE
	}
}

export function useCalculatorCv(
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	const min: number = minFactory(calculatorType)
	const max: number = maxFactory(calculatorType)

	return { min, max }
}
