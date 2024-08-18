// Types
import { Calculator } from "@common-repo/types/src"
interface GetValue {
	string: string
	number: number
}

// Methods
function getValueFrom(calculatorType: Calculator.Type): GetValue {
	switch (calculatorType) {
		case Calculator.TypeEnum.CYBER:
			return { string: "1 000 000", number: 1000000 }
		case Calculator.TypeEnum.BREAK:
			return { string: "1 000 000", number: 1000000 }
		case Calculator.TypeEnum.ECO:
			return { string: "250 000", number: 250000 }
		default:
			return { string: "500 000", number: 500000 }
	}
}

function getValueTo(calculatorType: Calculator.Type): GetValue {
	switch (calculatorType) {
		case Calculator.TypeEnum.CYBER:
			return { string: "10 000 000", number: 10000000 }
		case Calculator.TypeEnum.BREAK:
			return { string: "10 000 000", number: 10000000 }
		case Calculator.TypeEnum.ECO:
			return { string: "30 000 000", number: 30000000 }
		default:
			return { string: "5 000 000", number: 5000000 }
	}
}

export function useSumInsured(
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	const from: GetValue = getValueFrom(calculatorType)
	const to: GetValue = getValueTo(calculatorType)

	const fromString: string = from.string
	const toString: string = to.string

	const fromNumber: number = from.number
	const toNumber: number = to.number

	return {
		fromString,
		toString,
		fromNumber,
		toNumber
	}
}
