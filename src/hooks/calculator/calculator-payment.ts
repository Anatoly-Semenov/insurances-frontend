// Libs
import _debounce from "lodash/debounce"

// Hooks
import {
	useCalculatorStarted,
	useCalculatorCv,
	useFields,
	useError,
	useStore
} from "~/hooks"

// Types
import { Calculator, DealService } from "@common-repo/types/src"

export function useCalculatorPayment(
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	// Data
	const types = Calculator.TypeEnum
	const { min: minCv, max: maxCv } = useCalculatorCv(calculatorType)

	// Store
	const { store, configStore } = useStore(calculatorType)

	function getField<T = string>(fieldName: string): T {
		return store.getField<T>(Calculator.Tab.PAYMENT, "main", fieldName)
	}

	// Computed
	const insurancePeriod = computed(() => getField<number>("insurancePeriod"))
	const worksFinishedAt = computed(() => getField<number>("worksFinishedAt"))
	const worksStartedAt = computed(() => getField<number>("worksStartedAt"))
	const coefficient = computed(() => getField<number>("coefficient"))
	const finishedAt = computed(() => getField<string>("finishedAt"))
	const startedAt = computed(() => getField<string>("startedAt"))
	const franchise = computed(() => getField<number>("franchise"))
	const cv = computed(() => getField<number>("cv"))

	const isFranchise = computed((): boolean => {
		const list: Calculator.Type[] = [types.ASSET]

		return list.includes(calculatorType)
	})

	const calculate = computed(() => {
		return _debounce(
			() => {
				store.calculate()
			},
			250,
			{
				maxWait: 1000
			}
		)
	})

	const isDisabledPeriod = computed((): boolean => {
		return calculatorType === types.ECO
	})

	const isCoefficientVisible = computed((): boolean => {
		const allowed: Calculator.Type[] = [
			types.SPECTECH,
			types.ASSET,
			types.CYBER,
			types.BREAK,
			types.SMR,
			types.ECO
		]

		return allowed.includes(calculatorType)
	})

	const isCvVisible = computed((): boolean => {
		const allowed: Calculator.Type[] = [
			types.ASSET,
			types.CYBER,
			types.BREAK,
			types.ECO,
			types.SMR,
			types.SPECTECH
		]

		return allowed.includes(calculatorType)
	})

	const isFull = computed((): boolean => {
		const availableList: Calculator.Type[] = [Calculator.TypeEnum.SPECTECH]

		return availableList.includes(calculatorType)
	})

	const coefficientMask = computed((): string[] => {
		if (calculatorType === types.SPECTECH) {
			return ["#", "#.#"]
		}

		if (calculatorType === types.CYBER) {
			return ["#", "##"]
		}

		if (calculatorType === types.SMR) {
			return ["#", "#.##"]
		}

		return ["#####"]
	})

	const isSmrStartedAtPopover = computed((): boolean => {
		return !!(calculatorType === types.SMR && worksStartedAt.value)
	})

	const isSmrFinishedAtPopover = computed((): boolean => {
		return !!(calculatorType === types.SMR && worksFinishedAt.value)
	})

	const isDisabledFinishedAt = computed((): boolean => {
		const excludes: string[] = [
			Calculator.TypeEnum.BREAK,
			Calculator.TypeEnum.CYBER,
			Calculator.TypeEnum.SPECTECH
		]

		return excludes.includes(calculatorType)
	})

	const errorCoefficientValue = computed((): string => {
		return errorCoefficient(coefficient.value, calculatorType)
	})

	// Methods
	const { beforeTodayDisabled, disabledBeforeDate } = useFields()
	const { errorEmpty, errorCoefficient } = useError()

	function set(
		fieldName: string,
		value: any,
		isCalculate: boolean = true
	): void {
		store.setData(Calculator.Tab.PAYMENT, "main", fieldName, value)

		const calculateCalculators: Calculator.Type[] = [Calculator.TypeEnum.CYBER]

		const canCalculate: boolean =
			calculateCalculators.includes(calculatorType) && isCalculate

		if (canCalculate) calculate.value()
	}

	function setStartedAt(value: string, isCalculate: boolean = true): void {
		const { staredAt, finishedAt } = useCalculatorStarted(value)

		set("startedAt", staredAt, isCalculate)
		set("finishedAt", finishedAt, isCalculate)

		if (calculatorType === types.SMR) {
			store.setPpgoDates(finishedAt)
		}
	}

	function setEcoStartedAt(): void {
		const { $dayjs } = useNuxtApp()

		const todayPlusTenDays = $dayjs()
			.add(10, "day")
			.format(configStore.getFormatDatesInsurance)

		const startedAt = $dayjs(
			todayPlusTenDays,
			configStore.getFormatDatesInsurance
		).format(configStore.getFormatDates)

		const { finishedAt } = useCalculatorStarted(startedAt)

		set("startedAt", startedAt)
		set("finishedAt", finishedAt)
	}

	function setSpectechStartedAt(
		value: string,
		isCalculate: boolean = true
	): void {
		const { staredAt } = useCalculatorStarted(value)

		set("startedAt", staredAt, isCalculate)
		setInsurancePeriod(insurancePeriod.value, isCalculate)
	}

	function setFinishedAt(value: string): void {
		set("finishedAt", value)

		if (calculatorType === types.SMR) {
			store.setPpgoDates(value)
		}
	}

	function setDefaultCvIfNeeded(isCalculate: boolean = true): void {
		if (!cv.value) {
			set("cv", maxCv, isCalculate)
		}
	}

	function setDefaultStartedAtIfNeeded(isCalculate: boolean = true): void {
		if (!startedAt.value) {
			const { $dayjs } = useNuxtApp()

			const today: string = $dayjs().format(configStore.getFormatDates)

			setStartedAt(today, isCalculate)
		}
	}

	function setDefaultData(isCalculate: boolean = true): void {
		setDefaultCvIfNeeded(isCalculate)
		setDefaultStartedAtIfNeeded(isCalculate)
	}

	function preparePaymentData(): void {
		if (store.getDealStatus === DealService.Status.IN_PROCESS) {
			setDefaultData(false)

			if (calculatorType === types.ECO) {
				setEcoStartedAt()
			}
			if (calculatorType === types.SPECTECH) {
				setSpectechStartedAt("", false)
			}
		}
	}

	function setInsurancePeriod(
		value: number,
		isCalculate: boolean = true
	): void {
		set("insurancePeriod", value, isCalculate)

		const { $dayjs } = useNuxtApp()

		const finishedAt = $dayjs(startedAt.value, configStore.getFormatDates)
			.add(value, "month")
			.add(-1, "day")
			.format(configStore.getFormatDates)

		set("finishedAt", finishedAt, isCalculate)
	}

	return {
		setDefaultStartedAtIfNeeded,
		isSmrFinishedAtPopover,
		isSmrStartedAtPopover,
		errorCoefficientValue,
		isCoefficientVisible,
		isDisabledFinishedAt,
		setDefaultCvIfNeeded,
		setSpectechStartedAt,
		beforeTodayDisabled,
		disabledBeforeDate,
		setInsurancePeriod,
		preparePaymentData,
		isDisabledPeriod,
		insurancePeriod,
		coefficientMask,
		errorCoefficient,
		setEcoStartedAt,
		worksFinishedAt,
		worksStartedAt,
		setDefaultData,
		setFinishedAt,
		setStartedAt,
		coefficient,
		isCvVisible,
		configStore,
		isFranchise,
		finishedAt,
		errorEmpty,
		calculate,
		franchise,
		startedAt,
		isFull,
		store,
		types,
		minCv,
		maxCv,
		set,
		cv
	}
}
