import { useEventBus } from "@vueuse/core"
import _cloneDeep from "lodash/cloneDeep"

// Events
import { getDataByInn } from "~/events"

// Hooks
import { useCalculatorInsurances, useCalculatorApi, useError } from "~/hooks"
import { useAuthStore, useConfigStore, useInfoStore } from "~/store"

import { VerificationGuid } from "./config"

// Components
import { message as antMessage } from "ant-design-vue"

// Types
import { _GettersTree, DefineStoreOptions } from "pinia"
import { IndexInsurance } from "~/types"

import {
	VerificationService,
	CalculatorSignatory,
	CalculatorInsurer,
	DealService,
	InfoService,
	Calculator,
	Info
} from "@common-repo/types/src"

export type SecondDocumentType = Info.SecondDocumentType | ""
type CompanyType = Info.CompanyType | ""
export type Status = DealService.Status | 0
export type ForeignerField =
	| "documentType"
	| "citizenship"
	| "seriesAndNumber"
	| "dateOfIssue"
	| "validFrom"
	| "validTo"
	| "issuedBy"
	| "kindOfActivity"

const defaultPassport = {
	fullName: "",
	personInn: "",
	series: "",
	passportOffice: "",
	code: "",
	dob: "",
	dateOfIssue: "",
	validityPeriodEnd: "",
	placeOfBirth: "",
	// Foreigner
	isForeign: false,
	foreigner: {
		documentType: "" as SecondDocumentType,
		citizenship: "",
		seriesAndNumber: "",
		dateOfIssue: "", // date
		validFrom: "", // date
		validTo: "", // date
		issuedBy: "",
		kindOfActivity: ""
	}
}

export type StatePassport = typeof defaultPassport & {
	foreignPersonPassportDateTo?: string
}

export const state = {
	isVerify: false,

	isLoading: false,

	isLoadingDataByInn: false,

	isLoadingSave: false,

	isLoadingClose: false,

	price: 0 as number,

	verificationGuid: "" as VerificationGuid,

	calculatorType: Calculator.TypeEnum.CYBER as Calculator.Type,

	calculatorName: "" as string,

	activeSignatoryName: "" as string,

	deal: {
		id: 0,
		date: "",
		status: DealService.Status.IN_PROCESS as Status,
		responsibleEmail: ""
	},

	deals: [] as DealService.ArchiveDeal[],

	signatoryEmpty: {},

	insurer: {
		main: {
			companyType: "" as CompanyType,
			companyShortName: "",
			companyName: "",
			companyInn: "",

			// Only For companies
			regDate: "",
			okved: "",
			ifns: "",
			ogrn: "",
			kpp: "",

			// Additional
			ogrnIssueDate: "",
			opfCode: "",
			opfId: "",
			okonx: "",
			okpo: "",
			opf: ""
		},

		companyAddress: {
			isManualAddress: false,
			address: "",

			// Manual address
			cityPlace: "",
			country: "",
			region: "",
			street: "",
			office: "",
			house: "",
			build: "",

			// Additional
			city_kladr_id: "",
			kladr_id: "",
			fias_id: ""
		},

		passports: [_cloneDeep(defaultPassport)] as StatePassport[],

		signatory: {} as CalculatorInsurer.Signatory
	}
}

const stateFactory = (
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
): State => {
	const stateObject = _cloneDeep(state)

	let signatory: CalculatorInsurer.Signatory

	switch (calculatorType) {
		case Calculator.TypeEnum.CYBER:
			signatory = {
				signatory: "",
				signatoryGenitive: "",
				position: "",
				positionGenitive: "",
				based: "",
				reasonDocument: "",
				reasonDate: ""
			}
			break
		case Calculator.TypeEnum.ECO:
			signatory = {
				fullName: "",
				personInn: "",
				series: "",
				passportOffice: "",
				code: "",
				dob: "",
				dateOfIssue: "",
				placeOfBirth: "",
				address: "",
				isManualAddress: false,

				// Signatory additional
				signatory: "",
				signatoryGenitive: "",
				position: "",
				positionGenitive: "",
				based: "",
				reasonDocument: "",
				reasonDate: "",

				// Manual address
				cityPlace: "",
				street: "",
				house: "",
				build: "",
				office: ""
			}
			break
		default:
			signatory = {
				fullName: "",
				personInn: "",
				series: "",
				passportOffice: "",
				code: "",
				dob: "",
				dateOfIssue: "",
				placeOfBirth: "",
				address: "",
				isManualAddress: false,

				// Manual address
				cityPlace: "",
				street: "",
				house: "",
				build: "",
				office: ""
			}
			break
	}

	stateObject.insurer.signatory = { ...signatory }
	stateObject.signatoryEmpty = { ...signatory }

	return stateObject
}

export type State = typeof state
export type BaseStore = Omit<
	DefineStoreOptions<string, State, _GettersTree<State>, any>,
	"id"
>

export class BaseCalculator {
	private calculatorType: Calculator.Type
	private state: State

	constructor(calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER) {
		this.calculatorType = calculatorType
		this.state = stateFactory(calculatorType)

		this.setVerificationGuid()
	}

	setVerificationGuid() {
		switch (this.calculatorType) {
			case Calculator.TypeEnum.CYBER:
				this.state.verificationGuid = "cyberRisk"
				break
			case Calculator.TypeEnum.ASSET:
				this.state.verificationGuid = "asset"
				break
			case Calculator.TypeEnum.SPECTECH:
				this.state.verificationGuid = "spectech"
				break
			case Calculator.TypeEnum.KASCO:
				this.state.verificationGuid = "kasco"
				break
			case Calculator.TypeEnum.SMR:
				this.state.verificationGuid = "smr"
				break
			case Calculator.TypeEnum.CASH:
				this.state.verificationGuid = "cash"
				break
			case Calculator.TypeEnum.BREAK:
				this.state.verificationGuid = "nonDamageBi"
				break
			case Calculator.TypeEnum.ECO:
				this.state.verificationGuid = "eco"
				break
			case Calculator.TypeEnum.MOTOR:
				this.state.verificationGuid = "motorAssistant"
				break
		}
	}

	getState(): State {
		this.setSignatoryAddress()

		return this.state
	}

	setSignatoryAddress() {
		if (this.calculatorType == Calculator.TypeEnum.CYBER) {
			state.insurer.signatory.address = ""

			// Manual address
			state.insurer.signatory.cityPlace = ""
			state.insurer.signatory.street = ""
			state.insurer.signatory.house = ""
			state.insurer.signatory.build = ""
			state.insurer.signatory.office = ""
			state.insurer.signatory.isManualAddress = false
		}
	}

	getActions<T = BaseStore["actions"]>(): T {
		return this.baseCalculatorActions as T
	}

	getGetters<T = BaseStore["getters"]>(): T {
		return this.baseCalculatorGetters as T
	}

	private baseCalculatorActions: BaseStore["actions"] = {
		async fetchDataByInn(): Promise<void> {
			this.setLoading(true)

			this.isLoadingDataByInn = true

			const { $verificationApi } = useNuxtApp()
			const configStore = useConfigStore()

			const inn: string = this.insurer.main.companyInn
			const VerificationGuid: string = configStore.getVerificationGuid(
				this.verificationGuid
			)

			try {
				const { entity: company, isSuccess } =
					await $verificationApi.fetchDataByInn(inn, VerificationGuid)

				if (isSuccess) {
					this.setUploadedData(company)

					if (this.calculatorType === Calculator.TypeEnum.KASCO) {
						await this.fetchOpfIdByCode()
						await this.fetchPreApprove()
					}
				}
			} catch (error) {
				throw error
			} finally {
				this.setLoading(false)
				this.isLoadingDataByInn = false
			}
		},

		async fetchOpfIdByCode(): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			try {
				const { entity: opf, isSuccess } = await $kascoApi.fetchInsuranceOpfsByCode(
					this.insurer.main.opfCode
				)

				if (isSuccess) {
					this.insurer.main.opfId = opf.id
				}
			} catch (error) {
				throw error
			}
		},

		setLoading(payload: boolean): void {
			this.isLoading = payload
		},

		setDealId(id: number): void {
			this.deal.id = id
		},

		setPolicyholderEmail(email: string): void {
			if (typeof this?.registration?.bank?.email === "string") {
				this.registration.bank.email = email
			}
		},

		setCalculatorType(calculatorType: Calculator.Type): void {
			this.calculatorType = calculatorType

			const { getInsuranceByName } = useCalculatorInsurances()

			const insurance: IndexInsurance.Data = getInsuranceByName(calculatorType)!
			this.calculatorName = insurance.name
		},

		setUploadedData(company: VerificationService.Company): void {
			const data = company.companyInfo.suggestions[0].data

			if (data) {
				// Set main insurer data
				this.setUploadedInsurerData(data)

				// Set KPP
				if (this?.registration?.bank?.kpp !== undefined) {
					this.registration.bank.kpp = data?.kpp || ""
				}

				// Set signatory
				if (data?.management) {
					const { name = "", post = "" } = data.management

					if (this.insurer.signatory && this.getIsEmptySignatory) {
						this.insurer.signatory.fullName = name
						this.insurer.signatory.signatory = name
						this.insurer.signatory.position = post
					}
				}

				// Set address
				this.setUploadedAddressData(data)
			}
		},

		setUploadedAddressData(data: VerificationService.SuggestionData): void {
			if (this.insurer.companyAddress && data?.address) {
				this.insurer.companyAddress.address = data.address.value

				const address: VerificationService.SuggestionDataAddresses["data"] =
					data?.address?.data

				if (address) {
					const street: string = address?.street || address?.settlement || ""

					this.insurer.companyAddress.city_kladr_id = address.city_kladr_id
					this.insurer.companyAddress.office = address.tax_office
					this.insurer.companyAddress.kladr_id = address.kladr_id
					this.insurer.companyAddress.fias_id = address.fias_id
					this.insurer.companyAddress.country = address.country
					this.insurer.companyAddress.region = address.region
					this.insurer.companyAddress.build = address.area
					this.insurer.companyAddress.street = street

					if (!this.insurer.companyAddress.cityPlace) {
						this.insurer.companyAddress.cityPlace = address.city
					}

					if (!this.insurer.companyAddress.house) {
						this.insurer.companyAddress.house = address.house
					}
				}
			}
		},

		setUploadedInsurerData(data: VerificationService.SuggestionData): void {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			// Set company name
			if (data?.name) {
				const { full_with_opf = "", short_with_opf = "" } = data.name

				this.insurer.main.companyName = full_with_opf.replace(/\(|\)|"|'/g, "")
				this.insurer.main.companyShortName = short_with_opf.replace(
					/\(|\)|"|'/g,
					""
				)
			}

			// Set registration date if exist
			if (data?.state?.registration_date) {
				this.insurer.main.regDate = $dayjs
					// @ts-ignore
					.unix(+data.state.registration_date / 1000)
					.format(configStore.getFormatDates)
			}

			// Set Kladr
			this.insurer.main.kladr = data?.address?.data?.kladr_id || ""

			// Set Opf
			this.insurer.main.opf = data?.opf?.full || ""
			this.insurer.main.opfCode = data?.opf?.code || ""

			// Set Okpo
			this.insurer.main.okpo = data?.okpo || ""

			const ogrnData: number | string = data?.ogrn_date

			// Set Ogrn issue date
			if (typeof ogrnData === "number") {
				this.insurer.main.ogrnIssueDate = $dayjs
					// @ts-ignore
					.unix(ogrnData / 1000)
					.format(configStore.getFormatDates)
			} else {
				this.insurer.main.ogrnIssueDate = ogrnData || ""
			}

			// Set passport name
			if (this.insurer.main.companyType === Info.CompanyType.IP) {
				const person: VerificationService.Manager | null = data.managers?.[0]
				const fullName: string = data?.name?.full || ""

				if (person) {
					this.insurer.passports[0].fullName = person.name
					this.insurer.passports[0].personInn = person.inn

					if (this.getIsEmptySignatory) {
						this.insurer.signatory.signatory = person.name
						this.insurer.signatory.fullName = person.name
					}
				} else if (fullName) {
					this.insurer.passports[0].fullName = fullName
					if (this.getIsEmptySignatory) {
						this.insurer.signatory.signatory = fullName
						this.insurer.signatory.fullName = fullName
					}
				}
			} else if (this.insurer.main.companyType === Info.CompanyType.COMPANY) {
				const managersCount = data?.managers?.length || 0

				if (managersCount > 1) {
					for (let i = 1; i < managersCount; i++) {
						this.addPassport()
					}
				}

				data.managers.forEach(({ name, inn }, index) => {
					this.insurer.passports[index].fullName = name
					this.insurer.passports[index].personInn = inn

					if (
						this.insurer.signatory &&
						this.getIsEmptySignatory &&
						index === 0
					) {
						this.insurer.signatory.fullName = name
						this.insurer.signatory.signatory = name
					}
				})
			}

			this.insurer.main.ogrn = data?.ogrn || ""

			// Set main company data
			if (this.insurer.main.companyType === Info.CompanyType.COMPANY) {
				this.insurer.main.kpp = data?.kpp || ""
				this.insurer.main.okved = data?.okved || ""
				this.insurer.main.ifns = data?.ifns || ""

				if (data?.documents && !this.insurer.main.regDate) {
					this.insurer.main.regDate = $dayjs
						// @ts-ignore
						.unix(+data?.documents?.ftsRegistration?.issueDate / 1000)
						.format(configStore.getFormatDates)
				}
			}
		},

		async fetchDeals(): Promise<void> {
			const $api = useCalculatorApi(this.calculatorType)

			const email: string = this?.deal?.responsibleEmail || ""

			try {
				const { entityAll: deals } = await $api.fetchDeals(email)

				this.setDeals(deals)
			} catch (e) {
				throw "Failed fetch deals"
			}
		},

		async fetchDeal(id: string | number): Promise<void> {
			const $api = useCalculatorApi(this.calculatorType)

			this.setLoading(true)

			try {
				const { entity, isSuccess } = await $api.fetchDeal(
					id,
					this.calculatorType
				)

				if (isSuccess) {
					this.setDeal(entity)

					const bus = useEventBus<string>(getDataByInn)
					bus.emit()

					if (this.prefetchDealLists) await this.prefetchDealLists()
				} else {
					const router = useRouter()
					router.push("/")
				}
			} catch (e) {
				throw `Failed fetch deal with id ${id}`
			} finally {
				this.setLoading(false)
			}
		},

		async prefetchDealLists(): Promise<void> {
			const infoStore = useInfoStore()

			const terBank: number = this.registration.contract.terBank
			const regionId: number = this.registration.placement.region

			if (terBank) {
				infoStore.fetchGosb(terBank)
			}

			if (regionId) {
				infoStore.fetchGosb(terBank)
			}
		},

		async copyDeal(id: string | number): Promise<void> {
			await this.fetchDeal(id)

			this.deal.status = DealService.Status.IN_PROCESS
			this.deal.id = 0

			this.copyDealAdditional()

			const calculatorsWithReCalculation: Calculator.Type[] = [
				Calculator.TypeEnum.CYBER
			]

			if (calculatorsWithReCalculation.includes(this.calculatorType)) {
				await this.calculate()
			}
		},

		copyDealAdditional(): void {},

		async deleteDeal(id: string | number): Promise<void> {
			const $api = useCalculatorApi(this.calculatorType)

			try {
				await $api.deleteDeal(id)

				const dealIndex: number = this.deals.findIndex(
					({ cid }: DealService.ArchiveDeal) => cid === id
				)
				this.deals.splice(dealIndex, 1)
			} catch (e) {
				throw `Failed delete deal with id: ${id}`
			}
		},

		setDeals(deals: DealService.ArchiveDeal[]): void {
			if (deals) {
				this.deals = deals.sort((a, b) => {
					return +b.cid - +a.cid
				})
			}
		},

		setDeal(deal: DealService.Deal): void {
			this.setDealMain(deal)
			this.setDealAdditional(deal)
			this.fetchDataByInn()
		},

		setDealMain(deal: DealService.Deal): void {
			this.setDealMainInfo(deal)
			this.setDealAddress(deal)
			this.setDealPassport(deal)
			this.setDealForeigner(deal)
			this.setDealSignatory(deal)

			this.setDealIntroData(deal)
		},

		setDealIntroData(deal: DealService.Deal): void {
			const authStore = useAuthStore()

			this.deal.status = deal.status

			if (deal?.dealId) this.setDealId(deal.dealId)

			if (Calculator?.DealDataField?.RESPONSIBLE_EMAIL) {
				this.setDealData(
					Calculator.DealDataField.RESPONSIBLE_EMAIL,
					authStore.getEmail
				)
			}

			if (deal?.owner) {
				this.deal.responsibleEmail = deal.owner
			}
		},

		setDealMainInfo(deal: DealService.Deal): void {
			const requisites: DealService.CompanyRequisites | undefined =
				deal?.companyRequisites

			// Main
			this.insurer.main.companyType =
				deal.insured || requisites.companyType || ""
			this.insurer.main.companyName =
				deal?.companyFullName || requisites?.companyFullName || ""
			this.insurer.main.companyShortName =
				deal.companyName || requisites?.companyName || ""
			this.insurer.main.companyInn = requisites.inn || ""
			this.insurer.main.okonx = requisites?.okonx || ""
			this.insurer.main.kpp = requisites?.kpp || ""

			if (typeof this?.registration?.bank?.kpp !== "undefined") {
				this.registration.bank.kpp = requisites?.kpp || ""
			}

			this.insurer.main.regDate = requisites?.regDate || ""

			this.insurer.main.ifns = requisites.ifns || ""
			this.insurer.main.ogrn = requisites?.ogrn || deal?.ogrn || ""
			this.insurer.main.okved = requisites?.okved || deal?.okved || ""
		},

		setDealAddress(deal: DealService.Deal): void {
			const legalAddress: DealService.Deal["companyRequisites"]["legalAddress"] =
				deal?.companyRequisites?.legalAddress

			// Set Address
			if (legalAddress) {
				const {
					addressFull = "",
					cityPlace = "",
					building = "",
					street = "",
					office = "",
					house = ""
				} = legalAddress

				this.insurer.companyAddress.address = addressFull
				this.insurer.companyAddress.cityPlace = cityPlace
				this.insurer.companyAddress.street = street
				this.insurer.companyAddress.office = office
				this.insurer.companyAddress.build = office
				this.insurer.companyAddress.house = house
			}
		},

		setDealPassport(deal: DealService.Deal): void {
			const passports: DealService.Passport[] | undefined = deal?.personInfoList
			const passport: DealService.Passport | undefined = deal?.passport

			if (passports) {
				passports.forEach((item: DealService.PersonInfo) => {
					this.insurer.passports = []

					const passport = {
						dateOfIssue: item?.passport?.passportIssueDate || "",
						passportOffice: item?.passport?.passportOffice || "",
						series: item?.passport?.passportSeriesNumber || "",
						code: item?.passport?.passportDivisionCode || "",
						placeOfBirth: item?.passport?.birthPlace || "",
						foreignPersonPassportDateTo:
							item?.passport?.validityPeriodEnd || "",
						dob: item?.passport?.birthDate || "",
						isForeign: item.isForeignPerson,
						fullName: item?.fio || "",
						personInn: item?.inn || "",
						foreigner: {
							citizenship: item.citizenship || "",
							dateOfIssue: "",
							documentType: "",
							issuedBy: "",
							kindOfActivity: "",
							seriesAndNumber: "",
							validFrom: "",
							validTo: ""
						}
					}

					this.insurer.passports.push(passport)
				})
			} else if (passport) {
				this.insurer.passports[0] = {
					fullName: deal?.personalName || "",
					personInn: "",
					series: passport?.passportSeries || "",
					passportOffice: passport?.passportOffice || "",
					code: passport?.passportDivisionCode || "",
					dob: passport?.birthday || "",
					dateOfIssue: passport?.passportDate || "",
					placeOfBirth: deal?.birthPlace || "",
					foreigner: {
						citizenship: "",
						dateOfIssue: "",
						documentType: "",
						issuedBy: "",
						kindOfActivity: "",
						seriesAndNumber: "",
						validFrom: "",
						validTo: ""
					}
				}
			}
		},

		setDealForeigner(deal: DealService.Deal): void {
			const passports: DealService.Passport[] | undefined = deal?.personInfoList

			if (passports) {
				passports.forEach((passport, passportIndex: number) => {
					const foreigner: DealService.SecondDocumentObj | undefined =
						passport?.secondDocument

					type ForeignerKey = keyof DealService.SecondDocumentObj

					if (foreigner) {
						let canSetData: boolean = false

						Object.keys(foreigner).forEach((key) => {
							if (foreigner[key as ForeignerKey]) {
								canSetData = true
							}
						})

						if (canSetData) {
							this.setDealForeignerData(foreigner, passportIndex)
						}
					}
				})
			}
		},

		setDealForeignerData(
			foreigner: DealService.SecondDocumentObj,
			passportIndex: number
		): void {
			const {
				issueDate = null,
				office = null,
				seriesNumber = null,
				type = null,
				validityPeriodEnd = null,
				validityPeriodStart = null
			} = foreigner

			if (this.insurer.passports.length < passportIndex + 1) {
				this.addPassport()
			}

			this.insurer.passports[passportIndex].isForeign = true
			this.insurer.passports[passportIndex].foreigner.dateOfIssue = issueDate
			this.insurer.passports[passportIndex].foreigner.issuedBy = office
			this.insurer.passports[passportIndex].foreigner.seriesAndNumber =
				seriesNumber
			this.insurer.passports[passportIndex].foreigner.documentType = type
			this.insurer.passports[passportIndex].foreigner.validTo =
				validityPeriodEnd
			this.insurer.passports[passportIndex].foreigner.validFrom =
				validityPeriodStart
		},

		resetForeignerData(passportIndex: number): void {
			const passport: StatePassport | undefined =
				this.insurer.passports[passportIndex]

			if (passport) {
				Object.keys(passport.foreigner).forEach((key: string) => {
					this.insurer.passports[passportIndex].foreigner[key] = ""
				})
			}
		},

		setDealSignatory(deal: DealService.Deal): void {
			const personInfo = deal.personInfo as DealService.PersonInfo
			const signingInfo: DealService.SigningPersonInfo = deal.signingPersonInfo!

			const canSetSignatory: boolean = !!this.insurer.signatory

			if (deal?.dealContact) {
				this.insurer.signatory.reasonDate = deal.dealContact?.reasonDate || ""
				this.insurer.signatory.based = deal.dealContact?.reason || ""
				this.insurer.signatory.reasonDocument = deal.dealContact?.document || ""
			}

			if (signingInfo) {
				this.insurer.signatory.signatory = signingInfo.signatory
				this.insurer.signatory.signatoryGenitive = signingInfo.signatoryGenitive
				this.insurer.signatory.position = signingInfo.position
				this.insurer.signatory.positionGenitive = signingInfo.positionGenitive
				this.insurer.signatory.dateOfIssue =
					signingInfo.passport.passportIssueDate
				this.insurer.signatory.series =
					signingInfo.passport.passportSeriesNumber
				this.insurer.signatory.address = signingInfo.legalAddress.addressFull
			} else if (typeof personInfo === "object" && canSetSignatory) {
				this.insurer.signatory.signatory = personInfo.signatory
				this.insurer.signatory.signatoryGenitive = personInfo.signatoryGenitive
				this.insurer.signatory.position = personInfo.position
				this.insurer.signatory.positionGenitive = personInfo.positionGenetive
				this.insurer.signatory.based = personInfo.reason
				this.insurer.signatory.reasonDocument = personInfo.document
				this.insurer.signatory.reasonDate = personInfo.date
			}
		},

		setDealData(fieldName: Calculator.DealDataField, value: string): void {
			this.deal[fieldName] = value
		},

		setData<T = any>(
			tab: Calculator.Tab,
			component: string,
			fieldName: string,
			value: T
		): void {
			// @ts-ignore
			this.$state[tab][component][fieldName] = value
		},

		setPassportData(
			fieldName: keyof StatePassport,
			value: any,
			index: number = 0
		): void {
			this.insurer.passports[index][fieldName] = value

			// Set signatory data if exist
			if (this.$state.activeSignatoryName) {
				this.setActiveSignatoryName(this.$state.activeSignatoryName)
			}
		},

		setForeignerData(
			fieldName: ForeignerField,
			value: string | SecondDocumentType,
			index: number = 0
		): void {
			this.insurer.passports[index].foreigner[fieldName] = value
		},

		async verify(): Promise<void> {
			const { $verificationApi, $analytics } = useNuxtApp()

			try {
				const { entity, isSuccess } = await $verificationApi.verifyCompany(
					this.getVerifyPayload
				)

				if (isSuccess) {
					this.setVerify(entity?.verificationInfo?.isAllPermitted || false)

					$analytics.check115({
						calcName: this.calculatorName,
						isSuccess: true,
						value: this.getPrice
					})
				} else {
					$analytics.check115({
						calcName: this.calculatorName,
						isSuccess: false,
						value: this.getPrice
					})
				}
			} catch (error) {
				$analytics.check115({
					calcName: this.calculatorName,
					isSuccess: false,
					value: this.getPrice
				})

				throw error
			}
		},

		setVerify(payload: boolean): void {
			this.isVerify = payload
		},

		setTimeoutVerify(value: boolean, timeout: number = 1200): void {
			window.setTimeout(() => {
				if (!this.getIsVerify) {
					this.setVerify(value)
				}
			}, timeout)
		},

		async saveDeal(
			{ isSaveCalculation } = { isSaveCalculation: false }
		): Promise<void> {
			this.isLoadingSave = true

			const { $analytics, $event } = useNuxtApp()

			try {
				const $api = useCalculatorApi(this.calculatorType)

				const {
					entity,
					IsSuccess = false,
					isSuccess = false
				} = await $api[
					isSaveCalculation && this.deal.id ? "saveCalculation" : "saveDeal"
				](this.getSaveData)

				if (IsSuccess || isSuccess) {
					antMessage.success("Сделка успешно cохранена")

					$analytics.saveDeal({
						calcName: this.calculatorName,
						isSuccess: true,
						value: this.getPrice
					})

					$event.saveDeal(this.calculatorType, this.getDealId)
				} else {
					$analytics.saveDeal({
						calcName: this.calculatorName,
						isSuccess: false,
						value: this.getPrice
					})
				}

				let dealId: number = 0

				switch (typeof entity) {
					case "number":
						dealId = entity
						break
					case "object":
						if (entity?.id) {
							dealId = entity.id
						}
						break
					default:
						return
				}

				if (dealId) {
					const isVerify: boolean = this.getIsVerify

					this.setDealId(dealId as number)

					this.redirectToDeal(dealId)

					this.setTimeoutVerify(isVerify)
				}
			} catch (error) {
				antMessage.error("Не удалось сохранить сделку")

				$analytics.saveDeal({
					calcName: this.calculatorName,
					isSuccess: false,
					value: this.getPrice
				})
			} finally {
				this.isLoadingSave = false
			}
		},

		redirectToDeal(dealId: number): void {
			const router = useRouter()
			const route = useRoute()

			const tab = route?.query?.tab
			let path = `/${this.calculatorType}/${dealId}`

			if (tab) {
				path += `?tab=${tab}`
			}

			router.push(path)
		},

		async closeDeal(): Promise<void> {
			if (this.getIsVerify) {
				this.isLoadingClose = true

				try {
					const $api = useCalculatorApi(this.calculatorType)

					const response = await $api.closeDeal(this.getSaveData)

					if (response?.IsSuccess || response?.isSuccess) {
						antMessage.success("Сделка успешно оформлена")

						this.setDealStatus(DealService.Status.SENDED)

						{
							const { $event } = useNuxtApp()

							$event.closeDeal(this.calculatorType, this.getDealId)
						}
					}
				} catch (error) {
					antMessage.error("Не удалось оформить сделку")
				} finally {
					this.isLoadingClose = false
				}
			} else {
				antMessage.info("Сделайте проверку по 115ФЗ")
			}
		},

		changeInn(companyInn: string): void {
			const companyType: CompanyType = this.insurer.main.companyType
			const verificationGuid: string = this.verificationGuid
			const calculatorType: string = this.calculatorType
			const kldadr: string = this.insurer?.main?.kladr
			const deal: State["deal"] = { ...this.deal }

			this.resetState()

			if (kldadr !== undefined) this.insurer.main.kladr = kldadr
			this.insurer.main.companyType = companyType
			this.insurer.main.companyInn = companyInn
			this.verificationGuid = verificationGuid
			this.calculatorType = calculatorType
			this.deal = deal
		},

		async calculate(): Promise<void> {
			if (!this.getIsSended) {
				const { $analytics, $event } = useNuxtApp()

				if (this.getIsValidCalculation) {
					const $api = useCalculatorApi(this.calculatorType)

					try {
						const { entity: price, isSuccess } = await $api.calculate(
							this.getCalculatePayload
						)

						Promise.all([
							$analytics.calculation({
								calcName: this.calculatorName,
								isSuccess: true,
								value: this.getPrice
							}),

							$event.doCalculation(this.calculatorType)
						])

						if (isSuccess) {
							// Set price
							this.price = price

							antMessage.success(`Успешный расчет сделки ${price}`)
						} else {
							// Reset price
							this.price = 0
							antMessage.error("Ошибка расчета сделки")
						}
					} catch (error) {
						// Reset price
						this.price = 0

						$analytics.calculation({
							calcName: this.calculatorName,
							isSuccess: false,
							value: this.getPrice
						})

						antMessage.error("Ошибка расчета сделки")

						throw error
					}
				}
			}
		},

		resetStateByData(data: any): void {
			const emptyState: State = _cloneDeep(data)

			const notResetKeys = [
				"verificationGuid",
				"calculatorType",
				"calculatorName"
			]

			Object.keys(emptyState).forEach((name) => {
				if (!notResetKeys.includes(name)) {
					this.$state[name as Calculator.Tab] =
						// @ts-ignore
						emptyState[name as Calculator.Tab]
				}
			})
		},

		setRegistrationDataFromProfile(): void {
			const authStore = useAuthStore()
			const profile = authStore.getProfile
			const user = authStore.getUser

			const setIfNotExist = (
				key: string,
				value: any,
				object: "contract" | "placement" = "contract"
			) => {
				if (!this.registration?.[object]?.[key]) {
					this.registration[object][key] = value
				}
			}

			if (profile) {
				setIfNotExist("numberVsp", profile.UF_VSP_NUMBER)
				setIfNotExist("terBank", profile.TB)
				setIfNotExist("gosb", profile.GOSB)
			} else if (user) {
				setIfNotExist("numberVsp", user.vsp)
				setIfNotExist("terBank", user.terBankId)
				setIfNotExist("gosb", user.gosbId)

				setIfNotExist("region", user.regionId, "placement")
				setIfNotExist("city", user.cityId, "placement")
			}
		},

		async fetchDataByBik(bik: number): Promise<void> {
			const { $infoApi } = useNuxtApp()
			try {
				const response: InfoService.DataByBikResponse =
					await $infoApi.fetchDataByBik(bik)

				this.setDataByBik(response)
			} catch (error) {
				throw error
			}
		},

		addPassport(): void {
			this.insurer.passports.push(_cloneDeep(defaultPassport))
		},

		deletePassportByIndex(index: number): void {
			this.insurer.passports.splice(index, 1)
		},

		setDataByBik(response: string) {
			const responseData: InfoService.DataByBikResponse = JSON.parse(response)

			const data: InfoService.DataByBik = responseData?.suggestions?.[0]

			if (data && this.registration.bank) {
				this.registration.bank.corWallet =
					data?.data?.correspondent_account || ""
				this.registration.bank.bankName = data?.value || ""
			}
		},

		setDealStatus(status: DealService.Status): void {
			if (typeof status === "number") {
				this.deal.status = status
			}
		},

		async fetchGosbIfExist(terBank: string): Promise<void> {
			if (terBank) {
				const infoStore = useInfoStore()

				await infoStore.fetchGosb(terBank)
			}
		},

		async fetchRegionDataIfExist(region: number): Promise<void> {
			if (region) {
				const infoStore = useInfoStore()

				await Promise.all([
					infoStore.fetchInfo(Info.InfoType.REGIONS),
					infoStore.fetchCities(region)
				])
			}
		},

		setActiveSignatoryName(name: string): void {
			this.$state.activeSignatoryName = name

			const passport = name
				? this.getPassportByName(name)
				: _cloneDeep(defaultPassport)

			this.setSignatoryByPassportData(passport)
		},

		setSignatoryByPassportData(passport: StatePassport): void {
			this.resetSignatoryData()

			this.insurer.signatory.signatory = passport.fullName
			this.insurer.signatory.fullName = passport.fullName

			// Set signatory passport
			this.insurer.signatory.passportOffice = passport.passportOffice
			this.insurer.signatory.placeOfBirth = passport.placeOfBirth
			this.insurer.signatory.dateOfIssue = passport.dateOfIssue
			this.insurer.signatory.series = passport.series
			this.insurer.signatory.code = passport.code
			this.insurer.signatory.dob = passport.dob
			this.insurer.signatory.personInn = passport.personInn
		},

		resetSignatoryData(): void {
			this.insurer.signatory = { ...this.signatoryEmpty }
		}
	}

	private baseCalculatorGetters: BaseStore["getters"] = {
		getIsLoadingSave(): State["isLoadingSave"] {
			return this.isLoadingSave
		},

		getIsLoadingClose(): State["isLoadingClose"] {
			return this.isLoadingClose
		},

		getIsLoading(): boolean {
			return this.isLoading || this.getIsLoadingSave || this.getIsLoadingClose
		},

		getIsVerify(): State["isVerify"] {
			return this.isVerify
		},

		getPrice(): State["price"] {
			return this.price
		},

		getCalculatorType(): State["calculatorType"] {
			return this.calculatorType
		},

		getDealId(): State["deal"]["id"] {
			return this.deal.id
		},

		getDealStatus(): State["deal"]["status"] {
			return this.deal.status
		},

		getInn(): State["insurer"]["main"]["companyInn"] {
			return this.insurer.main.companyInn
		},

		getSumInsured(): number {
			return this.payment?.price?.sumInsured || 0
		},

		getPolicyholderEmail(): string {
			return this?.registration?.bank?.email || ""
		},

		getDeals(): DealService.ArchiveDeal[] {
			return this.deals
		},

		getHaveCompanyType(): boolean {
			return !!this.getCompanyType
		},

		getCompanyType(): CompanyType {
			return this.insurer.main.companyType
		},

		getIsValidInn(): boolean {
			const { $validation } = useNuxtApp()

			const validation = $validation(this.insurer.main.companyInn)

			return validation.isInn()
		},

		getField<T = string | null>(): (
			tab: Calculator.Tab,
			componentName: string,
			fieldName: string
		) => T {
			return (tab, componentName, fieldName) => {
				// @ts-ignore
				return this?.[tab]?.[componentName]?.[fieldName] || null
			}
		},

		getFieldDeal(): (fieldName: Calculator.DealDataField) => any {
			return (fieldName) => {
				return this.deal[fieldName]
			}
		},

		getFieldForeigner(): (fieldName: ForeignerField, index: number) => any {
			return (fieldName, index = 0) => {
				return this.insurer.passports[index].foreigner[fieldName]
			}
		},

		getFieldInsurer<T = any>(): (
			componentName: string,
			fieldName: string
		) => T {
			return (componentName, fieldName) => {
				return this.getField(Calculator.Tab.INSURER, componentName, fieldName)
			}
		},

		getFieldPassport(): (fieldName: keyof StatePassport, index: number) => any {
			return (fieldName, index = 0) => {
				return this.insurer.passports[index][fieldName]
			}
		},

		getFieldPayment(): (componentName: string, fieldName: string) => any {
			return (componentName, fieldName) => {
				return this.getField(Calculator.Tab.PAYMENT, componentName, fieldName)
			}
		},

		getFieldRegistration(): (componentName: string, fieldName: string) => any {
			return (componentName, fieldName) => {
				return this.getField(
					Calculator.Tab.REGISTRATION,
					componentName,
					fieldName
				)
			}
		},

		getPassportByName(): (name: string) => StatePassport {
			return (name) => {
				return this.insurer.passports.find(
					({ fullName }: StatePassport) => fullName === name
				)!
			}
		},

		getPassports(): StatePassport[] {
			return this.insurer.passports
		},

		getPassportsLength(): number {
			return this.getPassports.length
		},

		getCanVerify(): boolean {
			const passportsChecks: boolean[] = this.insurer.passports.map(
				({ fullName }) => {
					return !!fullName
				}
			)

			return !!(
				!passportsChecks.includes(false) && this.insurer.main.companyInn
			)
		},

		getVerifyPayload(): VerificationService.CompanyPayload {
			const configStore = useConfigStore()

			const PersonInfo = this.insurer.passports.map(
				({ dob, placeOfBirth, fullName, series, personInn }) => {
					return {
						BirthDate: dob,
						BirthPlace: placeOfBirth,
						FullName: fullName,
						Passport: series,
						inn: personInn
					}
				}
			)

			return {
				ApiClientGuid: configStore.getVerificationGuid(this.verificationGuid),
				PersonInfo,
				Query: {
					query: this.insurer.main.companyInn
				}
			}
		},

		getCalculatePayload(): DealService.CalculatePayload {
			const payload: DealService.CalculatePayload = {
				isProlongation: this.payment?.price?.isProlongation || false,
				insuranceSum: this.payment?.price?.sumInsured || 0,
				multiplier: this.payment?.main?.coefficient || 0,
				commission: this.payment?.main?.cv || 0
			}

			if (this.payment?.packages?.activePackage) {
				payload.tariff = this.payment.packages.activePackage
			}

			return payload
		},

		getIsBlocked(): boolean {
			return false
		},

		getIsSended(): boolean {
			return this.deal.status === DealService.Status.SENDED
		},

		getIsDisabledFields(): boolean {
			return this.getIsBlocked || this.getIsSended
		},

		getAddressFullManual(): string {
			if (this?.insurer?.companyAddress) {
				const { cityPlace, street, house, build, office } =
					this.insurer.companyAddress

				const addresses: string[] = [cityPlace, street, house, build, office]

				let fullAddress = ""

				addresses.forEach((item: string, index: number) => {
					if (item) {
						const value = index > 0 ? `,${item}` : item

						fullAddress += value
					}
				})

				return fullAddress
			}

			return ""
		},

		getAddressFull(): string {
			if (this?.insurer?.companyAddress?.address) {
				return this.insurer.companyAddress.address
			} else {
				return this.getAddressFullManual
			}
		},

		getCanCloseSignatory(): boolean {
			if (this.insurer.signatory) {
				const isSignatoryBased: boolean =
					this.insurer.signatory.based === CalculatorSignatory.ReasonRu.CHARTER
						? !!this.insurer.signatory.based
						: !!(
								this.insurer.signatory.based &&
								this.insurer.signatory.reasonDate &&
								this.insurer.signatory.reasonDocument
						  )

				return !!(
					this.insurer.signatory.signatory &&
					this.insurer.signatory.position &&
					this.insurer.signatory.positionGenitive &&
					this.insurer.signatory.signatoryGenitive &&
					isSignatoryBased
				)
			}

			return false
		},

		getCanCloseInsurer(): boolean {
			const calculatorsWithoutSignatory: Calculator.Type[] = [
				Calculator.TypeEnum.SMR
			]

			let isMain: boolean = !!(
				this.insurer.main.companyType &&
				this.insurer.main.companyName &&
				this.insurer.main.companyShortName &&
				this.insurer.main.companyInn
			)

			// Insurer company fields
			if (this.insurer.main.companyType === Info.CompanyType.COMPANY) {
				isMain = !!(
					isMain &&
					this.insurer.main.kpp &&
					this.insurer.main.ogrn &&
					this.insurer.main.okved
				)
			}

			const canCloseSignatory: boolean = calculatorsWithoutSignatory.includes(
				this.calculatorType
			)
				? true
				: !!this.getCanCloseSignatory

			return !!(
				isMain &&
				(!this.insurer.companyAddress || this.insurer.companyAddress.address) &&
				this.insurer.passports[0].fullName &&
				canCloseSignatory
			)
		},

		getCanCloseDeal(): boolean {
			const canCloseDealAdditional: boolean = this.getCanCloseDealAdditional

			const isResponsibleEmail: boolean = !!this.deal.responsibleEmail

			return (
				isResponsibleEmail &&
				this.getCanCloseInsurer &&
				canCloseDealAdditional &&
				this.isVerify
			)
		},

		getIsEmptySignatory(): boolean {
			return (
				!this.insurer.signatory ||
				!(
					this.insurer.signatory.signatory ||
					this.insurer.signatory.fullName ||
					this.insurer.signatory.signatoryGenitive ||
					this.insurer.signatory.position ||
					this.insurer.signatory.positionGenitive ||
					this.insurer.signatory.address ||
					this.insurer.signatory.personInn ||
					this.insurer.signatory.code ||
					this.insurer.signatory.dob ||
					this.insurer.signatory.dateOfIssue ||
					this.insurer.signatory.placeOfBirth
				)
			)
		},

		getPersonInfoList(): DealService.PersonInfo[] {
			return this.insurer.passports.map((passport: StatePassport) => {
				const data: any = {
					citizenship: passport?.foreigner?.citizenship || "",
					fio: passport?.fullName || "",
					id: -1,
					inn: passport?.personInn || "",
					isForeignPerson: passport?.isForeign || false,
					isSignatory: true,
					legalAddress: {
						addressFull: this?.getAddressFull || "",
						building: this?.insurer?.companyAddress?.build || "",
						cityKladr: "",
						cityPlace: this?.insurer?.companyAddress?.cityPlace || "",
						country: "",
						federalDistrict: "",
						flat: this?.insurer?.companyAddress?.office || "",
						house: this?.insurer?.companyAddress?.house || "",
						kladr: "",
						office: "",
						region: "",
						street: this?.insurer?.companyAddress?.street || "",
						useAddressFull: true
					},

					passport: {
						birthDate: passport?.dob || "",
						birthPlace: passport?.placeOfBirth || "",
						passportDivisionCode: passport?.code || "",
						passportIssueDate: passport?.dateOfIssue || "",
						passportOffice: passport?.passportOffice || "",
						passportSeriesNumber: passport?.series
					},

					secondDocument: this.getPersonSecondDocument(passport)
				}

				if (passport.isForeign) {
					data.passport.validityPeriodEnd = passport.foreignPersonPassportDateTo
				}

				return data
			})
		},

		getPersonSecondDocument(): (
			passport: StatePassport
		) => DealService.SecondDocument {
			return (passport) => {
				const isStatic =
					this.$state.calculatorType === Calculator.TypeEnum.CYBER

				if (isStatic) {
					return passport.foreigner?.documentType || null
				} else {
					return passport.isForeign
						? ({
								activityType: "",
								issueDate: passport.foreigner?.dateOfIssue || null,
								office: passport.foreigner?.issuedBy || null,
								seriesNumber: passport.foreigner?.seriesAndNumber || null,
								type: passport.foreigner?.documentType || null,
								validityPeriodEnd: passport.foreigner?.validTo || null,
								validityPeriodStart: passport.foreigner?.validFrom || null
						  } as DealService.SecondDocumentObj)
						: null
				}
			}
		},

		getIsValidCalculation(): boolean {
			const { errorCoefficient } = useError()
			const isValidSumInsured: boolean = !!this.payment?.price?.sumInsured

			if (this.calculatorType === Calculator.TypeEnum.CYBER) {
			}

			const isCoefficient: boolean =
				this.calculatorType === Calculator.TypeEnum.CYBER
					? !errorCoefficient(this.payment?.main?.coefficient || 0)
					: true

			const hasCoefficient: boolean =
				typeof this.payment?.main?.coefficient !== "undefined"

			const isValidCoefficient: boolean = hasCoefficient ? isCoefficient : true

			const isAdditional: boolean =
				typeof this.getIsValidCalculationAdditional === "boolean"
					? this.getIsValidCalculationAdditional
					: true

			return isValidSumInsured && isValidCoefficient && isAdditional
		},

		getSigningPersonInfo(): DealService.SigningPersonInfo {
			return {
				fio: this?.insurer?.signatory?.fullName || "",
				inn: this?.insurer?.signatory?.personInn || "",
				position: this?.insurer?.signatory?.position || "",
				positionGenitive: this?.insurer?.signatory?.positionGenitive || "",
				signatory:
					this?.insurer?.signatory?.signatory ||
					this?.insurer?.signatory?.fullName ||
					"",
				signatoryGenitive: this?.insurer?.signatory?.signatoryGenitive || "",
				passport: {
					birthDate: this?.insurer?.signatory?.dob || "",
					birthPlace: this?.insurer?.signatory?.placeOfBirth || "",
					passportDivisionCode: this?.insurer?.signatory?.code || "",
					passportIssueDate: this?.insurer?.signatory?.dateOfIssue || "",
					passportOffice: this?.insurer?.signatory?.passportOffice || "",
					passportSeriesNumber: this?.insurer?.signatory?.series || ""
				},
				legalAddress: {
					addressFull: this?.insurer?.signatory?.address || "",
					building: this?.insurer?.signatory?.build || "",
					cityKladr: "",
					cityPlace: this?.insurer?.signatory?.cityPlace || "",
					country: "",
					federalDistrict: "",
					flat: this?.insurer?.signatory?.office || "",
					house: this?.insurer?.signatory?.house || "",
					kladr: "",
					office: "",
					region: "",
					street: this?.insurer?.signatory?.street || "",
					useAddressFull: true
				}
			}
		},

		getSigningPersonInfoWithSignatory(): DealService.SigningPersonInfo | void {
			if (this.insurer.signatory) {
				return {
					...this.getSigningPersonInfo,
					signatory: this.insurer.signatory.signatory,
					signatoryGenitive: this.insurer.signatory.signatoryGenitive,
					position: this.insurer.signatory.position,
					positionGenitive: this.insurer.signatory.positionGenitive,
					verifyPos: ""
				}
			}
		},

		getRegistrationContractData(): DealService.RegistrationContractData {
			return {
				clientType: +this.registration.contract.clientType || 0,
				terBank: +this.registration.contract.terBank || 0,
				gosb: +this.registration.contract.gosb || 0,
				vsp: this.registration.contract.numberVsp || "",
				fioKm: this.registration.contract.fullName || "",
				tnKm: this.registration.contract.personnelNumber || "нет КМ",
				clientTypeBank: +this.registration.contract.clientTypeBank || 0
			}
		},

		getDealContact(): DealService.DealContact {
			return {
				fio: this.insurer.signatory?.signatory || "",
				reason: this.insurer.signatory?.based || 0,
				reasonDate: this.insurer.signatory?.reasonDate || "",
				document: this.insurer.signatory?.reasonDocument || "",
				email: this.registration?.bank?.email || "",
				phone: this.registration?.bank?.phone || ""
			}
		},

		getOgrnIssueDate(): string {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			if (this.insurer.main.ogrnIssueDate) {
				$dayjs(
					this.insurer.main.ogrnIssueDate,
					configStore.getFormatDates
				).toISOString()
			}

			return ""
		},

		geOpfCode(): string {
			return this.insurer.main.opfCode
		},

		getCompanyRequisites(): DealService.CompanyRequisites {
			const value: DealService.CompanyRequisites = {
				companyType:
					this.insurer?.main?.companyType || Info.CompanyType.COMPANY,
				correspondentAccount: this.registration.bank.corWallet,
				companyName: this.insurer.main.companyShortName,
				companyFullName: this.insurer.main.companyName,
				bankAccount: this.registration.bank.wallet,
				bankInfo: this.registration.bank.bankName,
				ogrnIssueDate: this.getOgrnIssueDate,
				regDate: this.insurer.main.regDate,
				inn: this.insurer.main.companyInn,
				bik: this.registration.bank.bik,
				okonx: this.insurer.main.okonx,
				okved: this.insurer.main.okved,
				ifns: this.insurer.main.ifns,
				okpo: this.insurer.main.okpo,
				ogrn: this.insurer.main.ogrn,
				kpp: this.insurer.main.kpp,
				opf: this.insurer.main.opf
			}

			if (this.insurer.companyAddress) {
				value.legalAddress = {
					cityKladr: this.insurer.companyAddress.city_kladr_id,
					cityPlace: this.insurer.companyAddress.cityPlace,
					kladr: this.insurer.companyAddress.kladr_id,
					country: "Россия",
					federalDistrict: "",
					flat: "",
					building: this.insurer.companyAddress.build,
					office: this.insurer.companyAddress.office,
					region: this.insurer.companyAddress.region,
					street: this.insurer.companyAddress.street,
					house: this.insurer.companyAddress.house,
					addressFull: this.getAddressFull,
					useAddressFull: true
				}

				value.companyAddressKladr = this.insurer.companyAddress.kladr_id
			}

			return value
		},

		getCanDraft(): boolean {
			return true
		}
	}
}
