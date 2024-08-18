import { Calculator, Info, Validation } from "@common-repo/types/src"
type Value = Validation.Value

export function useError() {
	const { $validation } = useNuxtApp()

	const errorEmpty = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else {
			return ""
		}
	}

	const errorEmptyNumber = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotZero()) {
			return Validation.Errors.EMPTY_NUMBER
		} else {
			return ""
		}
	}

	const errorRelationInsuranceSumToCost = (
		value: Value,
		bindingId: number
	): string => {
		const validation = $validation(value)

		const exceptionIds = [24, 25, 29, 30]

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isNumber()) {
			return Validation.Errors.NUMBER
		} else if (
			!validation.isRelationInsuranceSumToCost(bindingId, exceptionIds)
		) {
			return exceptionIds.includes(bindingId)
				? Validation.Errors.RELATION_INSURANCE_SUM_TO_COST_EXCEPTION
				: Validation.Errors.RELATION_INSURANCE_SUM_TO_COST
		} else {
			return ""
		}
	}

	const errorCoefficient = (
		value: Value,
		calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
	): string => {
		const validation = $validation(value)

		const allowedCoefficientChecks: Calculator.Type[] = [
			Calculator.TypeEnum.CYBER
		]

		const isEco: boolean = calculatorType === Calculator.TypeEnum.ECO
		const isSmr: boolean = calculatorType === Calculator.TypeEnum.SMR

		if (
			allowedCoefficientChecks.includes(calculatorType) &&
			!validation.isCoefficient()
		) {
			return Validation.Errors.COEFFICIENT
		} else if (isEco && !validation.isCoefficientEco()) {
			return Validation.Errors.COEFFICIENT_ECO
		} else if (isSmr && !validation.isCoefficientSmr()) {
			return Validation.Errors.COEFFICIENT_SMR
		} else {
			return ""
		}
	}

	const errorInn = (value: Value, companyType?: Info.CompanyType): string => {
		const validation = $validation(value)

		let isInn: boolean
		let error: string

		switch (companyType) {
			case Info.CompanyType.IP:
				isInn = validation.isInnIp()
				error = Validation.Errors.INN_IP
				break
			case Info.CompanyType.COMPANY:
				isInn = validation.isInnCompany()
				error = Validation.Errors.INN_COMPANY
				break
			default:
				isInn = validation.isInn()
				error = Validation.Errors.INN
				break
		}

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!isInn) {
			return error
		} else {
			return ""
		}
	}

	const errorOgrn = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isOgrn()) {
			return Validation.Errors.OGRN
		} else {
			return ""
		}
	}

	const errorKpp = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isKpp()) {
			return Validation.Errors.KPP
		} else {
			return ""
		}
	}

	const errorPassportSeries = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isPassportSeries()) {
			return Validation.Errors.PASSPORT_SERIES
		} else {
			return ""
		}
	}

	const errorPassportNumber = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isPassportNumber()) {
			return Validation.Errors.PASSPORT_NUMBER
		} else {
			return ""
		}
	}

	const errorPassportCode = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isPassportCode()) {
			return Validation.Errors.PASSPORT_CODE
		} else {
			return ""
		}
	}

	const errorBic = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isBic()) {
			return Validation.Errors.BIC
		} else {
			return ""
		}
	}

	const errorBankWallet = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isNumber()) {
			return Validation.Errors.NUMBER
		} else if (!validation.isBankWallet()) {
			return Validation.Errors.BANK_WALLET
		} else {
			return ""
		}
	}

	const errorEmail = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isEmail()) {
			return Validation.Errors.EMAIL
		} else {
			return ""
		}
	}

	const errorPhone = (value: Value, isOld: boolean = false): string => {
		const validation = $validation(value)

		const isPhone: boolean = isOld
			? validation.isPhoneOld()
			: validation.isPhone()

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!isPhone) {
			return Validation.Errors.PHONE
		} else {
			return ""
		}
	}

	const errorDateFeature = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isDateFeature()) {
			return Validation.Errors.DATE_FEATURE
		} else {
			return ""
		}
	}

	const errorAge = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isAdult()) {
			return Validation.Errors.AGE
		} else {
			return ""
		}
	}

	const errorSumInsured = (
		value: Value,
		from = "1 000 000",
		to = "10 000 000",
		calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
	): string => {
		const validation = $validation(value)

		if (!validation.isSumInsured(calculatorType)) {
			return `Введите сумму в диапазоне от ${from} до ${to}`
		} else {
			return ""
		}
	}

	const errorFioKM = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isFioKm()) {
			return Validation.Errors.KM_FIO
		} else {
			return ""
		}
	}

	const errorTabelNumberKM = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isTableNumberKM()) {
			return Validation.Errors.KM_TABEL
		} else {
			return ""
		}
	}

	const errorVin = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isVin()) {
			return Validation.Errors.VIN
		} else {
			return ""
		}
	}

	const errorChassis = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNotEmpty()) {
			return Validation.Errors.EMPTY
		} else if (!validation.isChassis()) {
			return Validation.Errors.CHASSIS
		} else {
			return ""
		}
	}

	const errorId = (value: Value): string => {
		const validation = $validation(value)

		if (!validation.isNumber()) {
			return Validation.Errors.ID
		} else {
			return ""
		}
	}

	return {
		errorRelationInsuranceSumToCost,
		errorPassportSeries,
		errorPassportNumber,
		errorTabelNumberKM,
		errorPassportCode,
		errorDateFeature,
		errorEmptyNumber,
		errorCoefficient,
		errorSumInsured,
		errorBankWallet,
		errorChassis,
		errorFioKM,
		errorEmail,
		errorEmpty,
		errorPhone,
		errorOgrn,
		errorVin,
		errorBic,
		errorAge,
		errorInn,
		errorId,
		errorKpp
	}
}
