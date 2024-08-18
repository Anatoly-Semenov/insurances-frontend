// Libs
import _cloneDeep from "lodash/cloneDeep"

// Store
import { useConfigStore } from "~/store"

import {
	state as defaultState,
	State as BaseState,
	BaseCalculator
} from "./base-calculator"

// Mocks
import { culture as emptyCulture } from "~/mocks"

// Types
import { CalculatorBaseStore } from "~/types"

import { DealService, AgroService, Calculator } from "@common-repo/types/src"

type BaseGetters = CalculatorBaseStore.Getters

// Data
const baseState: Partial<BaseState> = _cloneDeep(defaultState)

baseState.calculatorName = "Агро"
baseState.calculatorType = Calculator.TypeEnum.AGRO

delete baseState.insurer
delete baseState.signatoryEmpty
delete baseState.activeSignatoryName

const emptyCalculationResults = {
	totalInsurancePremiumToPayEmergencyRisk: 0,
	totalInsurancePremiumEmergencyRisk: 0,
	totalInsuranceCostEmergencyRisk: 0,
	totalInsurancePremium50Percent: 0,
	totalInsuranceSumEmergencyRisk: 0,
	totalInsurancePremium: 0,
	totalInsuranceCost: 0,
	totalInsuranceSum: 0
}

const state = {
	...baseState,

	main: {
		inn: "",
		subjectType: 0,
		region: "" as number | ""
	},

	calculation: {
		isEmergencyRisk: false
	},

	cultures: [] as AgroService.Culture[],

	calculationResults: {
		...emptyCalculationResults
	}
}

type State = typeof state

export const useAgroStore = defineStore("agro", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		baseActions(): CalculatorBaseStore.Actions {
			const baseCalculator = new BaseCalculator()

			return baseCalculator.getActions<CalculatorBaseStore.Actions>()
		},

		setMainField(fieldName: keyof State["main"], value: string | number): void {
			// @ts-ignore
			return (this.main[fieldName] = value)
		},

		setCalculatorType(calculatorType: Calculator.Type): void {
			this.baseActions().setCalculatorType.call(this, calculatorType)
		},

		setRegion(value: number | ""): void {
			this.main.region = value

			this.calculation.isEmergencyRisk = false
			this.resetCalculationResults()
			this.resetCultures()
		},

		resetCultures(): void {
			this.cultures = []
		},

		resetCalculationResults(): void {
			this.calculationResults = { ...emptyCalculationResults }
		},

		addCulture(): void {
			const culture = { ...emptyCulture }
			culture.id = this.cultures.length

			this.cultures.push(culture)
		},

		setCultureValue(index: number, field: any, value: any): void {
			// @ts-ignore
			this.cultures[index][field] = value
		},

		setCultureValueNumber(index: number, field: any, value: any): void {
			// @ts-ignore
			this.cultures[index][field] = +value || 0
		},

		deleteCulture(index: number): void {
			this.cultures.splice(index, 1)
		},

		setDealData(fieldName: Calculator.DealDataField, value: string): void {
			this.baseActions().setDealData.call(this, fieldName, value)
		},

		calculate(): void {
			// this is stub
		},

		setDealId(id: number): void {
			this.deal!.id = id
		},

		setLoading(payload: boolean): void {
			this.isLoading = payload
		},

		async saveDeal(payload = { isSaveCalculation: false }): Promise<void> {
			this.baseActions().saveDeal.call(this, payload)
		},

		async fetchDeals(): Promise<void> {
			this.baseActions().fetchDeals.call(this)
		},

		async fetchDeal(id: string | number): Promise<void> {
			this.baseActions().fetchDeal.call(this, id)
		},

		setDeals(deals: DealService.ArchiveDeal[]): void {
			this.baseActions().setDeals.call(this, deals)
		},

		async calculateDeal(): Promise<void> {
			const promises = [this.calculateAllRisks()]

			if (this.calculation.isEmergencyRisk) {
				promises.push(this.calculateEmergencyRisk())
			}

			await Promise.all(promises)
		},

		async calculateAllRisks(): Promise<void> {
			const { $agroApi } = useNuxtApp()
			this.isLoadingSave = true

			try {
				const { isSuccess, entity } = await $agroApi.calculateAllRisks(
					this.getCalculateData
				)

				if (isSuccess && entity) {
					this.setCalculationAllRisks(entity)
				}
			} catch (error) {
			} finally {
				this.isLoadingSave = false
			}
		},

		async calculateEmergencyRisk(): Promise<void> {
			const { $agroApi } = useNuxtApp()
			this.isLoadingSave = true

			try {
				const { isSuccess, entity } = await $agroApi.calculateEmergencyRisk(
					this.getCalculateData
				)

				if (isSuccess && entity) {
					this.setCalculationEmergencyRisks(entity)
				}
			} catch (error) {
			} finally {
				this.isLoadingSave = false
			}
		},

		async fetchCommercialOffer(): Promise<void> {
			const { $agroApi } = useNuxtApp()
			this.isLoadingSave = true

			try {
				await $agroApi.fetchCommercialOffer(this.getCalculateData)
			} catch (error) {
			} finally {
				this.isLoadingSave = false
			}
		},

		toggleEmergencyRisk(): void {
			this.calculation.isEmergencyRisk = !this.calculation.isEmergencyRisk
		},

		setDeal(deal: AgroService.Deal) {
			this.calculationResults.totalInsurancePremiumToPayEmergencyRisk =
				deal.totalInsurancePremiumToPayEmergencyRisk
			this.calculationResults.totalInsurancePremiumEmergencyRisk =
				deal.totalInsurancePremiumEmergencyRisk
			this.calculationResults.totalInsuranceCostEmergencyRisk =
				deal.totalInsuranceCostEmergencyRisk
			this.calculationResults.totalInsurancePremium50Percent =
				deal.totalInsurancePremium50Percent
			this.calculationResults.totalInsuranceSumEmergencyRisk =
				deal.totalInsuranceSumEmergencyRisk
			this.calculationResults.totalInsurancePremium = deal.totalInsurancePremium
			this.calculationResults.totalInsuranceCost = deal.totalInsuranceCost
			this.calculationResults.totalInsuranceSum = deal.totalInsuranceSum
			this.main.subjectType = deal.subjectType
			this.deal!.responsibleEmail = deal.owner
			this.main.region = deal.regionId
			this.cultures = deal.cultures
			this.main.inn = deal.inn
			this.deal!.id = deal.id
		},

		setCalculationEmergencyRisks(entity: AgroService.CalculateAllRisks) {
			this.calculationResults.totalInsurancePremiumToPayEmergencyRisk =
				entity.totalInsurancePremiumToPayEmergencyRisk
			this.calculationResults.totalInsurancePremiumEmergencyRisk =
				entity.totalInsurancePremiumEmergencyRisk
			this.calculationResults.totalInsuranceCostEmergencyRisk =
				entity.totalInsuranceCostEmergencyRisk
			this.calculationResults.totalInsurancePremium50Percent =
				entity.totalInsurancePremium50Percent
			this.calculationResults.totalInsuranceSumEmergencyRisk =
				entity.totalInsuranceSumEmergencyRisk
		},

		setCalculationAllRisks(entity: AgroService.CalculateAllRisks) {
			this.setCalculationEmergencyRisks(entity)

			this.calculationResults.totalInsurancePremium =
				entity.totalInsurancePremium
			this.calculationResults.totalInsuranceCost = entity.totalInsuranceCost
			this.calculationResults.totalInsuranceSum = entity.totalInsuranceSum
		},

		resetState(): void {
			const emptyState: State = _cloneDeep(state)

			Object.keys(state).forEach((name) => {
				// @ts-ignore
				this.$state[name as Calculator.Tab] = emptyState[name as Calculator.Tab]
			})
		}
	},

	getters: {
		baseGetters(): BaseGetters {
			const baseCalculator = new BaseCalculator()

			return baseCalculator.getGetters<BaseGetters>()
		},

		getMainField(): (fieldName: keyof State["main"]) => any {
			return (fieldName) => this.main[fieldName]
		},

		getCultures(): AgroService.Culture[] {
			return this.cultures
		},

		getCultureValue(): (index: number, field: any) => any {
			return (index, field) => {
				// @ts-ignore
				return this.cultures[index][field]
			}
		},

		getCalculationField(): (fieldName: keyof State["calculation"]) => any {
			return (fieldName) => this.calculation[fieldName]
		},

		getCalculationResultsField(): (
			fieldName: keyof State["calculationResults"]
		) => any {
			return (fieldName) => this.calculationResults[fieldName]
		},

		getFieldDeal(): BaseGetters["getFieldDeal"] {
			return this.baseGetters.getFieldDeal.call(
				this
			) as BaseGetters["getFieldDeal"]
		},

		getField(): BaseGetters["getField"] {
			return this.baseGetters.getField.call(this) as BaseGetters["getField"]
		},

		getDeals(): DealService.ArchiveDeal[] {
			return this.deals || []
		},

		getRegion(): State["main"]["region"] {
			return this.main.region
		},

		getPrice(): State["price"] {
			return this.price
		},

		getIsEmergencyRisk(): boolean {
			return this.calculation.isEmergencyRisk
		},

		getIsCalculated(): boolean {
			return !!(
				this.calculationResults.totalInsurancePremiumToPayEmergencyRisk ||
				this.calculationResults.totalInsurancePremiumEmergencyRisk ||
				this.calculationResults.totalInsuranceCostEmergencyRisk ||
				this.calculationResults.totalInsurancePremium50Percent ||
				this.calculationResults.totalInsuranceSumEmergencyRisk ||
				this.calculationResults.totalInsurancePremium ||
				this.calculationResults.totalInsuranceCost ||
				this.calculationResults.totalInsuranceSum
			)
		},

		getCanOffer(): boolean {
			return !!this.deal!.id && this.getIsCalculated
		},

		getIsValidCalculation(): boolean {
			return !!(
				this.deal!.responsibleEmail &&
				this.cultures.length &&
				this.main.region &&
				this.main.inn
			)
		},

		getCalculateData(): AgroService.CalculatePayload {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			// @ts-ignore
			return {
				createDate: $dayjs().format(configStore.getFormatDatesInsurance),
				subjectType: this.main.subjectType,
				owner: this.deal!.responsibleEmail,
				regionId: this.main.region || 0,
				cultures: this.getCultures,
				inn: this.main.inn,
				id: this.deal!.id,
				factPlace: ""
			}
		},

		getSaveData(): AgroService.Deal {
			return {
				...this.calculationResults,
				...this.getCalculateData
			}
		}
	}
})
