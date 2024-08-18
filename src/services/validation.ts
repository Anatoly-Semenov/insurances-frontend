// Hooks
import { useSumInsured } from "~/hooks"

// Types
import type { Validation as ValidationType } from "@common-repo/types/src"
import { Calculator } from "@common-repo/types/src"

type Value = ValidationType.Value

export class Validation<T = Value> {
	private readonly value: T
	private readonly regexp = {
		chassis:
			/(([АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{1,2})(\d{2,3})|(\d{4}[АВЕКМНОРСТУХ]{2})(\d{2})|(\d{3}C?D{1,2}\d{3})(\d{2})|([АВЕКМНОРСТУХ]{2}\d{3}[АВЕКМНОРСТУХ])(\d{2})|([АВЕКМНОРСТУХ]\d{4})(\d{2})|(\d{3}[АВЕКМНОРСТУХ])(\d{2})|(\d{4}[АВЕКМНОРСТУХ])(\d{2}))/i,
		email:
			/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
		fio: /^[А-ЯЁ][а-яё]*(\-[А-ЯЁ][а-яё]*)* [А-ЯЁ][а-яё]*(\-[А-ЯЁ][а-яё]*)* [А-ЯЁ][а-яё]*(\-[А-ЯЁ][а-яё]*)*$/,
		emailBroker:
			/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@test-url.ru$/i,
		carGosNumber: /^([АВЕКМНОРСТУХ]{1}[0-9]{3}[АВЕКМНОРСТУХ]{2}[0-9]{2,3})?$/,
		phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
		paymentAccount: /^\d{3}-\d{2}-\d{3}-\d{1}-\d{4}-\d{6}$/,
		passportSeries: /^([0-9]{2}\s{1}[0-9]{2})?$/,
		passportCode: /^([0-9]{3}[-]{1}[0-9]{3})?$/,
		okwed: /^(\d{1,2}(\.\d+)*\ *;\ *){1,21}$/,
		inn: /^(([0-9]{12})|([0-9]{10}))?$/,
		passportNumber: /^([0-9]{6})?$/,
		innCompany: /^([0-9]{10})?$/,
		vin: /[A-HJ-NPR-Z0-9]{17}/,
		tabelKm: /^[0-9]{1,8}$/,
		innIp: /^([0-9]{12})?$/,
		ogrn: /^([0-9]{13})?$/,
		kpp: /^([0-9]{9})?$/
	}

	constructor(value: T) {
		this.value = value
	}

	isNotEmpty(): boolean {
		return !!this.value
	}

	isPhone(): boolean {
		return this.value?.length === 18
	}

	isPhoneOld(): boolean {
		return this.value?.length === 16
	}

	isInn(): boolean {
		return !!this.value && this.regexp.inn.test(`${this.value as number}`)
	}

	isInnCompany(): boolean {
		return (
			!!this.value && this.regexp.innCompany.test(`${this.value as number}`)
		)
	}

	isInnIp(): boolean {
		return !!this.value && this.regexp.innIp.test(`${this.value as number}`)
	}

	isOgrn(): boolean {
		return this.regexp.ogrn.test(`${this.value as number}`)
	}

	isKpp(): boolean {
		return this.regexp.kpp.test(`${this.value as number}`)
	}

	isPassportSeries(): boolean {
		return this.regexp.passportSeries.test(`${this.value as number}`)
	}

	isPassportNumber(): boolean {
		return this.regexp.passportNumber.test(`${this.value as number}`)
	}

	isPassportCode(): boolean {
		return this.regexp.passportCode.test(`${this.value as number}`)
	}

	isBic(): boolean {
		return `${this.value as number}`.length === 9
	}

	isBankWallet(): boolean {
		return `${this.value as number}`.length === 20
	}

	isRelationInsuranceSumToCost(
		bindingId: number,
		exceptionIds: number[]
	): boolean {
		const from: number = exceptionIds.includes(bindingId) ? 50 : 35
		const to: number = exceptionIds.includes(bindingId) ? 70 : 50

		return this.value >= from && this.value <= to
	}

	isOkwed(): boolean {
		return this.regexp.okwed.test(`${this.value as number}`)
	}

	isPaymentAccount(): boolean {
		return this.regexp.paymentAccount.test(`${this.value as number}`)
	}

	isEmail(): boolean {
		return this.regexp.email.test(this.value as string)
	}

	isEmailBroker(): boolean {
		return this.regexp.emailBroker.test(this.value as string)
	}

	isVin(): boolean {
		return this.regexp.vin.test(`${this.value as number}`)
	}

	isChassis(): boolean {
		return this.regexp.chassis.test(`${this.value as number}`)
	}

	isCoefficient(): boolean {
		return this.value > 0 && this.value < 11
	}

	isCoefficientEco(): boolean {
		return this.value > 0 && this.value < 4
	}

	isCoefficientSmr(): boolean {
		return this.value >= 1 && this.value <= 1.5
	}

	isDate(): boolean {
		const { $dayjs } = useNuxtApp()

		return $dayjs(this.value as string).isValid()
	}

	isDateFactory(func: () => boolean): boolean {
		if (this.isDate()) {
			return func()
		} else {
			return false
		}
	}

	isDateFeature(): boolean {
		if (this.isDate()) {
			const { $dayjs } = useNuxtApp()

			return $dayjs().isBefore(this.value as string)
		} else {
			return false
		}
	}

	isToday(): boolean {
		if (this.isDate()) {
			const { $dayjs } = useNuxtApp()

			return $dayjs().isSame(this.value as string)
		} else {
			return false
		}
	}

	isAdult(): boolean {
		if (this.isDate()) {
			const { $dayjs } = useNuxtApp()

			const age = $dayjs().diff(this.value as string, "years")
			return age >= 18
		} else {
			return false
		}
	}

	isNumber(): boolean {
		const value = Number(this.value)

		return !!(value || value === 0)
	}

	isNotZero(): boolean {
		if (this.isNumber()) {
			return Number(this.value) > 0
		}

		return false
	}

	isSumInsured(
		calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
	): boolean {
		const { fromNumber, toNumber } = useSumInsured(calculatorType)

		if (this.isNumber()) {
			const value = Number(this.value)

			return value >= fromNumber && value <= toNumber
		}

		return false
	}

	isFioKm(): boolean {
		return this.value === "нет КМ" || this.regexp.fio.test(this.value as string)
	}

	isTableNumberKM(): boolean {
		return (
			this.value === "нет КМ" || this.regexp.tabelKm.test(this.value as string)
		)
	}
}
