import _cloneDeep from "lodash/cloneDeep"

// Components
import { message as antMessage } from "ant-design-vue/lib/components"

import { BaseCalculator, StatePassport } from "~/store/base-calculator"

// Hooks
import { useCalculatorApi, useError } from "~/hooks"

// Stores
import { useConfigStore, useInfoStore } from "~/store"

// Types
import { DealService, Calculator, EcoService, Info } from "@common-repo/types/src"

interface IndustryInterface {
	id: number
	isStop: boolean
	name: string
}

type IndustryObject = IndustryInterface | object

// Data
const calculatorType = Calculator.TypeEnum.ECO
const baseCalculator = new BaseCalculator(calculatorType)
const baseState: any = baseCalculator.getState()

// Set default state data
baseState.insurer.main = {
	...baseState.insurer.main
}

const state = {
	...baseState,

	payment: {
		main: {
			startedAt: "",
			finishedAt: "",
			coefficient: "1",
			cv: 0
		},
		price: {
			isProlongation: false,
			sumInsured: 0,
			franchise: "" as string | number,
			address: ""
		},
		object: {
			industry: {},
			facilityTypes: [] as number[],
			facilityDescription: {},
			facilityName: "",
			facilityAddress: "",
			isFacilityForeign: false,
			isDisasterTerritory: false,
			isFacilityWasteStorage: false
		}
	},

	registration: {
		contract: {
			numberVsp: "",
			fullName: "нет КМ",
			personnelNumber: "нет КМ",
			clientType: ""
		},
		placement: {
			region: "",
			city: ""
		},
		signatory: {
			signatory: "",
			signatoryGenitive: "",
			position: "",
			positionGenitive: "",
			based: ""
		},
		bank: {
			bik: "",
			kpp: "",
			corWallet: "",
			wallet: "",
			bankName: "",
			email: "",
			phone: ""
		}
	}
}

type State = typeof state

export const useEcoStore = defineStore("eco", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),
		resetState(): void {
			this.resetStateByData(state)
		},

		// @override
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

			await Promise.all([
				infoStore.fetchEcoIndustries(),
				infoStore.fetchEcoFacilitiesTypes(),
				infoStore.fetchEcoFacilitiesDescriptions()
			])
		},

		setFacilityType({
			type = "add",
			value
		}: {
			type: "add" | "delete"
			value: number
		}) {
			const index: number = this.payment.object.facilityTypes.findIndex(
				(id: number) => id === value
			)

			if (type === "delete") {
				if (index > -1) this.payment.object.facilityTypes.splice(index, 1)
			} else if (type === "add") {
				if (index === -1) this.payment.object.facilityTypes.push(value)
			}
		},

		setDealAdditional(deal: EcoService.PrefetchedDeal): void {
			this.setDealAdditionalSignatory(deal)
			this.setDealAdditionalRegistration(deal)
			this.setDealAdditionalPayment(deal)
		},

		setDealAdditionalSignatory(deal: EcoService.Deal): void {
			type SigningInfo = EcoService.Deal["signingPersonInfo"]
			type Passport = DealService.SigningPassport

			const signingInfo: SigningInfo | undefined = deal?.signingPersonInfo

			const passport: Passport | undefined = signingInfo?.passport

			if (signingInfo) {
				this.insurer.signatory.fullName = signingInfo?.fio
				this.insurer.signatory.personInn = signingInfo?.inn

				if (passport) {
					this.insurer.signatory.series = passport.passportSeriesNumber
					this.insurer.signatory.passportOffice = passport.passportOffice
					this.insurer.signatory.code = passport.passportDivisionCode
					this.insurer.signatory.dob = passport.birthDate
					this.insurer.signatory.dateOfIssue = passport.passportIssueDate
					this.insurer.signatory.placeOfBirth = passport.birthPlace
				}

				// Set additional data
				this.insurer.signatory.signatory = signingInfo.signatory
				this.insurer.signatory.signatoryGenitive = signingInfo.signatoryGenitive
				this.insurer.signatory.position = signingInfo.position
				this.insurer.signatory.positionGenitive = signingInfo.positionGenitive
			}
		},

		setDealAdditionalPayment(deal: EcoService.Deal): void {
			this.payment.main.startedAt = deal?.startDate || ""
			this.payment.main.finishedAt = deal?.endDate || ""
			this.payment.main.coefficient = deal?.multiplyingCoefficient || ""
			this.payment.main.cv = deal?.kv || ""

			this.payment.object.facilityType = deal?.facilitiesTypes || []
			this.payment.object.facilityName = deal?.facilityName
			this.payment.object.facilityAddress = deal?.facilityAddress
			this.payment.object.isFacilityForeign = deal?.facilityForeign
			this.payment.object.isDisasterTerritory = deal?.facilityDisasterProne
			this.payment.object.isFacilityWasteStorage = deal?.facilityWasteStorage

			if (deal?.facilityDescription?.id) {
				this.payment.object.facilityDescription = deal.facilityDescription.id
			}

			if (deal?.industry?.id) {
				this.payment.object.industry = deal.industry.id
			}

			deal.facilitiesTypes.forEach(({ id }) => {
				this.payment.object.facilityTypes.push(id)
			})

			this.payment.price.sumInsured = deal.insuranceSum
			this.payment.price.franchise = deal.franchise
		},

		setDealAdditionalRegistration(deal: EcoService.Deal): void {
			this.registration.contract.numberVsp = deal.vsp
			this.registration.contract.fullName = deal.fioKm
			this.registration.contract.personnelNumber = deal.tnKm
			this.registration.contract.clientType = deal.clientType
			this.registration.contract.clientTypeBank = deal.clientTypeBank
			this.registration.contract.terBank = deal.terBank
			this.registration.contract.gosb = deal.gosb

			this.registration.placement.region = deal.region
			this.registration.placement.city = deal.city

			this.registration.bank.bik = deal.companyRequisites?.bik || ""
			this.registration.bank.kpp = deal.companyRequisites?.kpp || ""
			this.registration.bank.corWallet =
				deal.companyRequisites?.correspondentAccount || ""
			this.registration.bank.wallet = deal.companyRequisites?.bankAccount || ""
			this.registration.bank.bankName = deal.companyRequisites?.bankInfo || ""
			this.registration.bank.email = deal.dealContact.email
			this.registration.bank.phone = deal.dealContact.phone
		},

		async sendCommercialOffer(email: string): Promise<void> {
			const payload: EcoService.SendCommercialOffer = {
				dealId: this.deal.id,
				email
			}

			if (email) {
				if (!this.deal.id) {
					await this.saveDeal()
				}

				const $api = useCalculatorApi(Calculator.TypeEnum.ECO)

				const response = await $api.sendCommercialOffer(payload)

				if (response?.IsSuccess || response?.isSuccess) {
					antMessage.success(`Расчет успешно отправлен клиенту ${email}`)
				}
			} else {
				antMessage.error("Сохраните сделку и укажите почту клиента")
			}
		}
	},

	getters: {
		...baseCalculator.getGetters(),

		// @override
		getCanCloseSignatory(): boolean {
			return !!(
				this.insurer.signatory.fullName &&
				this.insurer.signatory.signatory &&
				this.insurer.signatory.signatoryGenitive &&
				this.insurer.signatory.position &&
				this.insurer.signatory.positionGenitive &&
				this.insurer.signatory.based
			)
		},

		// @override
		getCanCloseInsurer(): boolean {
			return !!(
				this.insurer.main.companyType &&
				this.insurer.main.companyInn &&
				this.getCanCloseSignatory
			)
		},

		// @override
		getCanVerify(): boolean {
			const companyType: Info.CompanyType = this.insurer.main.companyType

			let passportsChecks: boolean[]

			if (companyType === Info.CompanyType.IP) {
				passportsChecks = this.insurer.passports.map(
					({
						passportOffice,
						dateOfIssue,
						isForeign,
						fullName,
						series
					}: StatePassport) => {
						return !!(
							(isForeign || passportOffice) &&
							dateOfIssue &&
							fullName &&
							series
						)
					}
				)
			} else {
				passportsChecks = this.insurer.passports.map(
					({ fullName }: StatePassport) => {
						return !!fullName
					}
				)
			}

			return !!(
				!passportsChecks.includes(false) &&
				(this.insurer.main.companyInn as string)
			)
		},

		// @override
		getCanCloseDealAdditional(): boolean {
			const companyType: Info.CompanyType = this.insurer.main.companyType

			const passportsChecks: boolean[] = this.insurer.passports.map(
				(passport: StatePassport) => {
					const isForeignPersonPassportDateTo: boolean =
						!passport.isForeign || !!passport.foreignPersonPassportDateTo

					if (companyType === Info.CompanyType.IP) {
						const isPassportOffice: boolean =
							passport.isForeign || !!passport.passportOffice

						return !!(
							isForeignPersonPassportDateTo &&
							passport.dateOfIssue &&
							passport.fullName &&
							passport.series &&
							isPassportOffice
						)
					} else {
						return !!passport.fullName
					}
				}
			)

			const canClosePassports: boolean = !passportsChecks.includes(false)

			return !!(
				(this.insurer.signatory.fullName as string) &&
				this.getCanCloseRegistration &&
				this.getCanClosePayment &&
				canClosePassports
			)
		},

		getObjectData() {
			return (
				name: Info.InfoType,
				id: number | string | object
			): IndustryObject | object => {
				if (typeof id !== "object") {
					const infoStore = useInfoStore()

					return infoStore.getItemById<IndustryObject>({
						type: "dynamic",
						name,
						id
					})
				}

				return {}
			}
		},

		getFacilityDescription() {
			return (id: number | object): IndustryObject => {
				return this.getObjectData(Info.InfoType.FACILITIES_DESCRIPTION, id)
			}
		},

		getFacilityType() {
			return (id: number): IndustryObject => {
				return this.getObjectData(Info.InfoType.FACILITIES_TYPES, id)
			}
		},

		getFacilityTypes() {
			return (ids: number[]): IndustryObject[] => {
				return ids.map((id) => {
					return this.getFacilityType(id)
				})
			}
		},

		getIndustryObject() {
			return (id: number): IndustryObject => {
				return this.getObjectData(Info.InfoType.INDUSTRIES, id)
			}
		},

		getCalculatePayload(): EcoService.Deal {
			return this.getSaveData
		},

		getIsValidCalculationAdditional(): boolean {
			const { facilityDescription, facilityTypes, industry } =
				this.payment.object

			return !!(facilityDescription && industry && facilityTypes.length)
		},

		getCanClosePayment(): boolean {
			const { errorCoefficient } = useError()

			const canCoefficient: boolean = !errorCoefficient(
				+this.payment.main.coefficient,
				calculatorType
			)

			return !!(
				this.payment.price.sumInsured % 100000 === 0 &&
				this.payment.main.finishedAt &&
				this.payment.main.startedAt &&
				this.payment.main.cv &&
				canCoefficient
			)
		},

		getCanCloseRegistration(): boolean {
			return !!(
				this.registration.contract.personnelNumber &&
				this.registration.contract.clientTypeBank &&
				this.registration.contract.clientType &&
				this.registration.contract.fullName &&
				this.registration.contract.terBank &&
				this.registration.placement.region &&
				this.registration.placement.city &&
				this.registration.contract.gosb &&
				this.registration.bank.email &&
				this.registration.bank.phone
			)
		},

		getSaveData(): EcoService.Deal {
			const configStore = useConfigStore()

			return {
				dealId: this.deal.id,
				price: 0,
				verificationGuid: configStore.getVerificationGuid("eco"),
				companyRequisites: this.getCompanyRequisites,
				dealContact: this.getDealContact,
				startDate: this.payment.main.startedAt,
				endDate: this.payment.main.finishedAt,
				kv: this.payment.main.cv,
				...this.getRegistrationContractData,
				fioTechsales: "",
				tnTechsales: "",
				region: +this.registration.placement.region,
				city: +this.registration.placement.city,
				kpp: this.insurer.main.kpp,
				reasonDate: this.insurer.signatory?.reasonDate || "",
				segment: 0,
				status: this.deal.status || 10,
				personInfoList: this.getPersonInfoList,
				signingPersonInfo: this.getSigningPersonInfoWithSignatory,
				owner: this.deal.responsibleEmail,
				employees: [],
				multiplyingCoefficient: +this.payment.main.coefficient,
				facilitiesTypes: this.getFacilityTypes(
					this.payment.object.facilityTypes
				),
				facilityAddress: this.payment.object.facilityAddress,
				facilityDescription: this.getFacilityDescription(
					this.payment.object.facilityDescription
				),
				facilityDisasterProne: this.payment.object.isDisasterTerritory,
				facilityForeign: this.payment.object.isFacilityForeign,
				facilityWasteStorage: this.payment.object.isFacilityWasteStorage,
				facilityName: this.payment.object.facilityName,
				franchise: +this.payment.price.franchise,
				industry: this.getIndustryObject(this.payment.object.industry),
				insuranceSum: this.payment.price.sumInsured
			}
		}
	}
})
