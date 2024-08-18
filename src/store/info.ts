import _cloneDeep from "lodash/cloneDeep"

// Hooks
import { useCalculatorApi } from "~/hooks"

// Types
import { UiSelect, Info } from "~/types"
import { Calculator, InfoService } from "@common-repo/types/src"

type BaseMethods = Exclude<Info.ApiMethod, "fetchCities" | "fetchGosb">
type InfoType = Info.InfoType | Info.InfoTypeStatic | Info.InfoTypeKasco

// Methods
function convertNumberToInfo(numbers: number[]): Info.List {
	return numbers.map((number) => {
		return {
			id: number,
			name: Number(number.toFixed(2))?.toLocaleString() + " ₽"
		}
	})
}

// Data
const state: Info.IState = {
	activeCalculatorType: Calculator.TypeEnum.CYBER,

	dynamic: {
		[Info.InfoType.INCOMPLETE_CONSTRUCTION_TYPES]: [],
		[Info.InfoType.PLEDGE_AGREEMENT_CATALOG]: [],
		[Info.InfoType.ASSET_INSURANCE_OBJECTS]: [],
		[Info.InfoType.FACILITIES_DESCRIPTION]: [],
		[Info.InfoType.LOAN_AGREEMENT_CATALOG]: [],
		[Info.InfoType.SUBJECTS_OF_FEDERATION]: [],
		[Info.InfoType.CONTRACTOR_EXPERIENCE]: [],
		[Info.InfoType.SUB_CATEGORY_TS_TYPE]: [],
		[Info.InfoType.SBS_DOCUMENTS_TYPES]: [],
		[Info.InfoType.DYNAMIC_FRANCHISE]: [],
		[Info.InfoType.CONSERVATION_TYPE]: [],
		[Info.InfoType.FEDERAL_DISTRICTS]: [],
		[Info.InfoType.CAR_DOCUMENT_TYPE]: [],
		[Info.InfoType.FACILITIES_TYPES]: [],
		[Info.InfoType.ASSET_INDUSTRIES]: [],
		[Info.InfoType.GO_INSURANCE_SUM]: [],
		[Info.InfoType.MACHINERY_GROUPS]: [],
		[Info.InfoType.CATEGORY_TS_TYPE]: [],
		[Info.InfoType.COUNTRY_CATALOG]: [],
		[Info.InfoType.TERRITORY_TYPES]: [],
		[Info.InfoType.ASSET_FACTORS]: [],
		[Info.InfoType.CLIENT_TYPES]: [],
		[Info.InfoType.BANK_FINANCE]: [],
		[Info.InfoType.REALTY_TYPE]: [],
		[Info.InfoType.INDUSTRIES]: [],
		[Info.InfoType.WORK_TYPE]: [],
		[Info.InfoType.TER_BANKS]: [],
		[Info.InfoType.SEGMENTS]: [],
		[Info.InfoType.BINDINGS]: [],
		[Info.InfoType.SBS_OPFS]: [],
		[Info.InfoType.REGIONS]: [],
		[Info.InfoType.FACTORS]: [],
		[Info.InfoType.MODELS]: [],
		[Info.InfoType.CITIES]: [],
		[Info.InfoType.REALTY]: [],
		[Info.InfoType.MARKS]: [],
		[Info.InfoType.GOSB]: [],

		[Info.InfoTypeKasco.NS]: [],
		[Info.InfoTypeKasco.DAGO]: [],
		[Info.InfoTypeKasco.OPS_LIST]: [],
		[Info.InfoTypeKasco.CAR_TYPES]: [],
		[Info.InfoTypeKasco.DATA_BY_VIN]: [],
		[Info.InfoTypeKasco.SBS_DOCUMENT_TYPES]: []
	},
	static: {
		[Info.InfoTypeStatic.PAYMENT_FREQUENCY]: [
			{
				name: "Единовременная",
				id: 120
			},
			{
				name: "Ежеквартальная",
				id: 30
			}
		],
		[Info.InfoTypeStatic.SECOND_DOCUMENT]: [
			{
				name: "Вид на жительство иностранного гражданина",
				id: Info.SecondDocumentType.RESIDENCE_PERMIT
			},
			{
				name: "Разрешение на работу",
				id: Info.SecondDocumentType.WORK_PERMIT
			},
			{
				name: "Миграционная карта",
				id: Info.SecondDocumentType.MIGRATION_CARD
			}
		],
		[Info.InfoTypeStatic.USAGE_VEHICLE]: [
			{
				id: 1,
				name: "Личное"
			},
			{
				id: 2,
				name: "Перевозка опасных и легковоспламеняющихся грузов"
			},
			{
				id: 3,
				name: "Дорожные и специальные ТС"
			},
			{
				id: 4,
				name: "Регулярные пассажирские перевозки/перевозки пассажиров по заказам"
			},
			{
				id: 5,
				name: "Экстренные и коммунальные службы"
			},
			{
				id: 6,
				name: "Прочее"
			}
		],
		[Info.InfoTypeStatic.COMPANY_TYPES]: [
			{
				name: "Юридическое лицо",
				id: Info.CompanyType.COMPANY
			},
			{
				name: "Индивидуальный предприниматель",
				id: Info.CompanyType.IP
			},
			{
				name: "Физ. лицо",
				id: Info.CompanyType.PERSON
			}
		],
		[Info.InfoTypeStatic.BENEFICIARY]: [
			{
				name: "Страхователь",
				id: 5
			},
			{
				name: "Иное",
				id: 3
			}
		],
		[Info.InfoTypeStatic.CITIZENSHIP]: [
			{
				name: "Резидент",
				id: 1
			},
			{
				name: "Не резидент",
				id: 2
			},
			{
				name: "Без гражданства",
				id: 3
			}
		],
		[Info.InfoTypeStatic.PHONE_TYPES]: [
			{
				name: "Мобильный",
				id: 1
			},
			{
				name: "Домашний",
				id: 2
			},
			{
				name: "Рабочий",
				id: 3
			}
		],
		[Info.InfoTypeStatic.BASED_ENG]: [
			{
				id: "article",
				name: "Устава"
			},
			{
				id: "attorney",
				name: "Доверенности"
			},
			{
				id: "other",
				name: "Иное"
			}
		],
		[Info.InfoTypeStatic.FRANCHISE]: [
			{
				id: 0,
				name: "Без Франшизы"
			},
			{
				id: 5000,
				name: "5 000"
			},
			{
				id: 10000,
				name: "10 000"
			},
			{
				id: 15000,
				name: "15 000"
			},
			{
				id: 18000,
				name: "18 000"
			},
			{
				id: 20000,
				name: "20 000"
			},
			{
				id: 25000,
				name: "25 000"
			},
			{
				id: 30000,
				name: "30 000"
			}
		],
		[Info.InfoTypeStatic.GENDERS]: [
			{
				name: "Мужской",
				id: 1
			},
			{
				name: "Женский",
				id: 2
			}
		],
		[Info.InfoTypeStatic.BASED]: [
			{
				name: "Устава",
				id: "Устава"
			},
			{
				name: "Доверенности",
				id: "Доверенности"
			},
			{
				name: "Иное",
				id: "Иное"
			}
		],
		[Info.InfoTypeStatic.BAIL]: [
			{
				name: "залог",
				id: 83
			},
			{
				name: "не залог",
				id: 554
			}
		],
		[Info.InfoTypeStatic.SUBJECT_TYPE]: [
			{
				name: "Субъект малого предпринимательства",
				id: 0
			},
			{
				name: "Субъект среднего предпринимательства / Не является таковым",
				id: 1
			}
		]
	}
}

type State = typeof state

export const useInfoStore = defineStore("info", {
	state: (): State => {
		return _cloneDeep(state)
	},
	actions: {
		setActiveCalculatorType(value: Calculator.Type | null): void {
			this.activeCalculatorType = value
		},

		async fetchInfo(
			type: Info.InfoType = Info.InfoType.TER_BANKS
		): Promise<void> {
			const { $infoApi } = useNuxtApp()

			const methodName = `fetch${
				type[0].toUpperCase() + type.slice(1)
			}` as BaseMethods

			try {
				// @ts-ignore
				const response = await $infoApi[methodName]()

				const data = response?.entity || response

				this.setInfo(type, data)
			} catch (error) {
				throw error
			}
		},

		async fetchKascoInfo(
			type: Info.InfoTypeKasco = Info.InfoTypeKasco.CAR_TYPES
		): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			const methodName = `fetch${
				type[0].toUpperCase() + type.slice(1)
			}` as BaseMethods

			try {
				// @ts-ignore
				const { entity } = await $kascoApi[methodName]()

				this.setInfo(type, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchCities(regionId: string | number): Promise<void> {
			if (regionId) {
				const { $infoApi } = useNuxtApp()

				try {
					const { entity } = await $infoApi.fetchCities(regionId)

					this.setInfo(Info.InfoType.CITIES, entity)
				} catch (error) {
					throw error
				}
			}
		},

		async fetchGosb(bankId: string | number): Promise<void> {
			if (bankId) {
				const { $infoApi } = useNuxtApp()
				try {
					const { entity } = await $infoApi.fetchGosb(bankId)

					this.setInfo(Info.InfoType.GOSB, entity)
				} catch (error) {
					throw error
				}
			}
		},

		async fetchModels(
			markId: string | number,
			calculatorType: Calculator.Type
		): Promise<void> {
			if (markId) {
				const { $infoApi } = useNuxtApp()

				try {
					const { entity } = await $infoApi.fetchModelsByMarkId(
						markId,
						calculatorType
					)

					this.setInfo(Info.InfoType.MODELS, entity)
				} catch (error) {
					throw error
				}
			}
		},

		async fetchEcoIndustries(): Promise<void> {
			const { $ecoApi } = useNuxtApp()
			try {
				const { entity } = await $ecoApi.fetchIndustries()

				this.setInfo(Info.InfoType.INDUSTRIES, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchEcoFacilitiesTypes(): Promise<void> {
			const { $ecoApi } = useNuxtApp()
			try {
				const { entity } = await $ecoApi.fetchFacilitiesTypes()

				this.setInfo(Info.InfoType.FACILITIES_TYPES, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchEcoFacilitiesDescriptions(): Promise<void> {
			const { $ecoApi } = useNuxtApp()
			try {
				const { entity } = await $ecoApi.fetchFacilitiesDescriptions()

				this.setInfo(Info.InfoType.FACILITIES_DESCRIPTION, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchCountryCatalog(
			calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
		): Promise<void> {
			const $api = useCalculatorApi()

			try {
				const { entity } = await $api.fetchCountryCatalog(calculatorType)

				this.setInfo(Info.InfoType.COUNTRY_CATALOG, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchBindingsByRegionId(regionId: number | string): Promise<void> {
			const { $infoApi } = useNuxtApp()

			try {
				const list = await $infoApi.fetchBindingsByRegionId({ regionId })

				this.setInfo(Info.InfoType.BINDINGS, list)
			} catch (error) {
				throw error
			}
		},

		async fetchSpectechFactors(): Promise<void> {
			const { $infoApi } = useNuxtApp()

			try {
				const list = await $infoApi.fetchSpectechFactors()

				this.setInfo(Info.InfoType.FACTORS, list.entity)
			} catch (error) {
				throw error
			}
		},

		async fetchMachineryGroups(): Promise<void> {
			const { $infoApi } = useNuxtApp()

			try {
				const list = await $infoApi.fetchMachineryGroups()

				this.setInfo(Info.InfoType.MACHINERY_GROUPS, list.entity)
			} catch (error) {
				throw error
			}
		},

		async fetchTerritoryTypes(): Promise<void> {
			const { $infoApi } = useNuxtApp()

			try {
				const list = await $infoApi.fetchTerritoryTypes()

				this.setInfo(Info.InfoType.TERRITORY_TYPES, list.entity)
			} catch (error) {
				throw error
			}
		},

		async fetchMarks(
			calculatorType: Calculator.Type = Calculator.TypeEnum.KASCO
		): Promise<void> {
			const { $infoApi } = useNuxtApp()

			try {
				const { entity } = await $infoApi.fetchMarks(calculatorType)

				this.setInfo(Info.InfoType.MARKS, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchSubcategoryTsType(
			calculatorType: Calculator.Type = Calculator.TypeEnum.OSAGO_SPECTECH
		): Promise<void> {
			const { $infoApi } = useNuxtApp()
			try {
				const { entity } = await $infoApi.fetchSubcategoryTsType(calculatorType)

				this.setInfo(Info.InfoType.SUB_CATEGORY_TS_TYPE, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchCategoryTsType(
			calculatorType: Calculator.Type = Calculator.TypeEnum.OSAGO_SPECTECH
		): Promise<void> {
			const { $infoApi } = useNuxtApp()
			try {
				const { entity } = await $infoApi.fetchCategoryTsType(calculatorType)

				this.setInfo(Info.InfoType.CATEGORY_TS_TYPE, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchCarDocumentType(
			calculatorType: Calculator.Type = Calculator.TypeEnum.OSAGO_SPECTECH
		): Promise<void> {
			const { $infoApi } = useNuxtApp()
			try {
				const { entity } = await $infoApi.fetchCarDocumentType(calculatorType)

				this.setInfo(Info.InfoType.CAR_DOCUMENT_TYPE, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchInsuranceOpfs(
			calculatorType: Calculator.Type = Calculator.TypeEnum.OSAGO_SPECTECH,
			code: string = "0"
		): Promise<void> {
			const { $infoApi } = useNuxtApp()
			try {
				const { entity } = await $infoApi.fetchInsuranceOpfs(calculatorType, +code)

				this.setInfo(Info.InfoType.SBS_OPFS, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchInsuranceDocumentsTypes(
			calculatorType: Calculator.Type = Calculator.TypeEnum.OSAGO_SPECTECH
		): Promise<void> {
			const { $infoApi } = useNuxtApp()
			try {
				const { entity } = await $infoApi.fetchInsuranceDocumentsTypes(calculatorType)

				this.setInfo(Info.InfoType.SBS_DOCUMENTS_TYPES, entity)
			} catch (error) {
				throw error
			}
		},

		async fetchAssetIndustriesTypes(
			industryId: string | number
		): Promise<void> {
			if (industryId) {
				const { $infoApi } = useNuxtApp()

				try {
					const entity = await $infoApi.fetchAssetIndustriesTypes({
						industryId
					})

					this.setInfo(Info.InfoType.ASSET_INDUSTRIES_TYPES, entity)
				} catch (error) {
					throw error
				}
			}
		},

		async fetchSubjectsOfFederation(
			district: string | number | null,
			calculatorType: Calculator.Type = Calculator.TypeEnum.ASSET
		): Promise<void> {
			if (district) {
				const { $infoApi } = useNuxtApp()

				try {
					// @ts-ignore
					const info: Info.List = await $infoApi.fetchSubjectsOfFederation({
						calculatorType,
						district
					})

					if (typeof info !== "undefined")
						this.setInfo(Info.InfoType.SUBJECTS_OF_FEDERATION, info)
				} catch (error) {
					throw error
				}
			}
		},

		async fetchDago(): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			try {
				const { entity, isSuccess } = await $kascoApi.fetchDagoSums()

				const info: Info.List = convertNumberToInfo(entity)

				if (isSuccess) this.setInfo(Info.InfoTypeKasco.DAGO, info)
			} catch (error) {
				throw error
			}
		},

		async fetchNs(): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			try {
				const { entity, isSuccess } = await $kascoApi.fetchNsSums()

				const info: Info.List = convertNumberToInfo(entity)

				if (isSuccess) this.setInfo(Info.InfoTypeKasco.NS, info)
			} catch (error) {
				throw error
			}
		},

		async fetchKascoFranchise(fullCarSum: number): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			try {
				const { entity: info, isSuccess } = await $kascoApi.fetchFranchise(
					fullCarSum
				)

				// ts-ignore
				if (isSuccess) this.setInfo(Info.InfoType.DYNAMIC_FRANCHISE, info)
			} catch (error) {
				throw error
			}
		},

		setInfo(type: Info.InfoType | Info.InfoTypeKasco, data: Info.List): void {
			this.dynamic[type] = data
		},

		resetState() {
			const emptyState: State = _cloneDeep(state)

			Object.keys(state.dynamic).forEach((name) => {
				this.$state.dynamic[name as Info.InfoType] =
					emptyState.dynamic[name as Info.InfoType]
			})
		}
	},

	getters: {
		getInfo() {
			return (
				name: InfoType = Info.InfoType.TER_BANKS,
				type: keyof Omit<State, "activeCalculatorType"> = "dynamic"
			): UiSelect.Options => {
				return (
					this?.[type]?.[name]?.map(({ id, name }) => {
						return {
							value: id,
							label: name
						}
					}) || null
				)
			}
		},

		getModelInsuranceId(): (id: number) => string {
			return (id) => {
				return (
					this.dynamic[Info.InfoType.MODELS].find((model) => model.id === id)
						?.InsuranceId || ""
				)
			}
		},

		getInfoIdByName() {
			return (
				name: InfoType = Info.InfoType.TER_BANKS,
				type: keyof Omit<State, "activeCalculatorType"> = "dynamic",
				value: string
			): number | string => {
				const id: string | number | undefined = this[type]?.[name]?.find(
					(item) => item.name.toLowerCase().includes(value.toLowerCase())
				)?.id

				if (typeof id !== "undefined") {
					return id
				}

				return ""
			}
		},

		getItemById() {
			return <T = InfoService.Info>({
				type,
				name,
				id
			}: {
				type: keyof Omit<State, "activeCalculatorType">
				name: InfoType
				id: number | string
			}): T => {
				return (
					(this?.[type]?.[name]?.find((item) => item.id == id) as T) ||
					("" as T)
				)
			}
		},

		getNameById() {
			return ({
				type,
				name,
				id
			}: {
				type: keyof Omit<State, "activeCalculatorType">
				name: InfoType
				id: number | string
			}): string => {
				return this.getItemById({ type, name, id })?.name || ""
			}
		},
		getAssetFactors(): Info.AssetFactor[] {
			return this.dynamic[Info.InfoType.ASSET_FACTORS] as Info.AssetFactor[]
		},
		getAssetInsuranceObjects(): Info.AssetInsuranceObject[] {
			return this.dynamic[
				Info.InfoType.ASSET_INSURANCE_OBJECTS
			] as Info.AssetInsuranceObject[]
		}
	}
})
