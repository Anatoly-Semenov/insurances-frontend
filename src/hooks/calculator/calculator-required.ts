// Hooks
import { useStore } from "~/hooks"

// Types
import { Calculator, Info } from "@common-repo/types/src"

export function useCalculatorRequired(
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	const { store } = useStore(calculatorType)

	const companyType = computed(
		(): Info.CompanyType => store.getCompanyType as Info.CompanyType
	)

	const isRequiredCompanyName = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredCompanyShortName = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredKpp = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredRegDate = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredIfns = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredOgrn = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredOkved = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPassportFullName = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return true
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return true
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPassportDob = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPassportSeries = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return true
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return false
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPassportDateOfIssue = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return true
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPassportOffice = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return true
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPersonPassportDateTo = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return true
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredCitizenship = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return true
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isForeignerValidityPeriodEnd = computed((): boolean => {
		return false
	})

	const isForeignerDocumentType = computed((): boolean => {
		return false
	})

	const isForeignerSeriesAndNumber = computed((): boolean => {
		return false
	})

	const isForeignerIssuedBy = computed((): boolean => {
		return false
	})

	const isForeignerDateOfIssue = computed((): boolean => {
		return false
	})

	const isForeignerValidFrom = computed((): boolean => {
		return false
	})

	const isForeignerKindOfActivity = computed((): boolean => {
		return false
	})

	const isRequiredSignatory = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredSignatoryGenitive = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPosition = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredPositionGenitive = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredBased = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return true
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return true
				case Calculator.TypeEnum.SMR:
					return true
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return true
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredReasonDocument = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredReasonDate = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.CYBER:
					return true
				case Calculator.TypeEnum.SPECTECH:
					return true
				case Calculator.TypeEnum.KASCO:
					return false
				case Calculator.TypeEnum.SMR:
					return false
				case Calculator.TypeEnum.CASH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.MOTOR:
					return false
				case Calculator.TypeEnum.AGRO:
					return false
				case Calculator.TypeEnum.ASSET:
					return false
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredFullAddress = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				default:
					return true
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				case Calculator.TypeEnum.OSAGO_SPECTECH:
					return false
				case Calculator.TypeEnum.BREAK:
					return false
				case Calculator.TypeEnum.ECO:
					return false
				case Calculator.TypeEnum.KASCO:
					return false
				default:
					return true
			}
		} else {
			return true
		}
	})

	const isRequiredCityPlace = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredStreet = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredHouse = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredBuild = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				default:
					return false
			}
		} else {
			return false
		}
	})

	const isRequiredOffice = computed((): boolean => {
		if (companyType.value === Info.CompanyType.IP) {
			switch (calculatorType) {
				default:
					return false
			}
		} else if (companyType.value === Info.CompanyType.COMPANY) {
			switch (calculatorType) {
				default:
					return false
			}
		} else {
			return false
		}
	})

	return {
		isRequiredPersonPassportDateTo,
		isRequiredPassportDateOfIssue,
		isForeignerValidityPeriodEnd,
		isRequiredSignatoryGenitive,
		isRequiredCompanyShortName,
		isRequiredPassportFullName,
		isForeignerSeriesAndNumber,
		isRequiredPositionGenitive,
		isForeignerKindOfActivity,
		isRequiredReasonDocument,
		isRequiredPassportOffice,
		isRequiredPassportSeries,
		isForeignerDocumentType,
		isForeignerDateOfIssue,
		isRequiredCompanyName,
		isRequiredCitizenship,
		isRequiredFullAddress,
		isRequiredPassportDob,
		isForeignerValidFrom,
		isRequiredReasonDate,
		isForeignerIssuedBy,
		isRequiredSignatory,
		isRequiredCityPlace,
		isRequiredPosition,
		isRequiredRegDate,
		isRequiredOffice,
		isRequiredStreet,
		isRequiredBuild,
		isRequiredBased,
		isRequiredOkved,
		isRequiredHouse,
		isRequiredOgrn,
		isRequiredIfns,
		isRequiredKpp
	}
}
