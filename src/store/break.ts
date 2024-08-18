import _cloneDeep from "lodash/cloneDeep"

import { BaseCalculator, StatePassport } from "~/store/base-calculator"

// Types
import { BreakService, Calculator, Info } from "@common-repo/types/src"

import { useConfigStore } from "~/store/config"

// Data
const baseCalculator = new BaseCalculator(Calculator.TypeEnum.BREAK)
const baseState: any = baseCalculator.getState()

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
			assetAddress: "",
			cv: 0
		},
		price: {
			isProlongation: false,
			sumInsured: 1000000,
			address: ""
		}
	},

	registration: {
		contract: {
			numberVsp: "",
			fullName: "нет КМ",
			personnelNumber: "",
			clientType: "",
			clientTypeBank: "",
			terBank: "",
			gosb: ""
		},
		placement: {
			region: "",
			city: ""
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

const baseGetters: any = baseCalculator.getGetters()

delete baseGetters.getCalculatePayload

export const useBreakStore = defineStore("break", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),

		resetState(): void {
			this.resetStateByData(state)
		},

		setDealAdditional(deal: BreakService.Deal): void {
			this.setDealAdditionalSignatory(deal)
			this.setDealAdditionalPayment(deal)
			this.setDealAdditionalRegistration(deal)
		},

		setDealAdditionalSignatory(deal: BreakService.Deal): void {
			this.insurer.signatory.fullName = deal.signingPersonInfo?.fio
			this.insurer.signatory.personInn = deal.signingPersonInfo?.inn
			this.insurer.signatory.series =
				deal.signingPersonInfo?.passport?.passportSeriesNumber
			this.insurer.signatory.passportOffice =
				deal.signingPersonInfo?.passport?.passportOffice
			this.insurer.signatory.code =
				deal.signingPersonInfo?.passport?.passportDivisionCode
			this.insurer.signatory.dob = deal.signingPersonInfo?.passport?.birthDate
			this.insurer.signatory.dateOfIssue =
				deal.signingPersonInfo?.passport?.passportIssueDate
			this.insurer.signatory.placeOfBirth =
				deal.signingPersonInfo?.passport?.birthPlace
		},

		setDealAdditionalPayment(deal: BreakService.Deal): void {
			this.payment.main.startedAt = deal.startDate
			this.payment.main.finishedAt = deal.endDate
			this.payment.main.coefficient = deal.multiplyingKoef
			this.payment.main.cv = deal.kv

			this.payment.price.sumInsured = deal.insSum
			this.payment.price.assetAddress = deal.assetAddress
		},

		setDealAdditionalRegistration(deal: BreakService.Deal): void {
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
			this.registration.bank.kpp = deal.kpp
			this.registration.bank.corWallet =
				deal.companyRequisites?.correspondentAccount || ""
			this.registration.bank.wallet = deal.companyRequisites?.bankAccount || ""
			this.registration.bank.bankName = deal.companyRequisites?.bankInfo || ""
			this.registration.bank.email = deal.dealContact.email
			this.registration.bank.phone = deal.dealContact.phone
		}
	},

	getters: {
		...baseGetters,

		// @override
		getCanCloseInsurer(): boolean {
			return !!(this.insurer.main.companyType && this.insurer.main.companyInn)
		},

		// @override
		getCanCloseDealAdditional(): boolean {
			const companyType: Info.CompanyType = this.insurer.main.companyType

			const passportsChecks: boolean[] = this.insurer.passports.map(
				(passport: StatePassport) => {
					const isValidityPeriodEnd: boolean = passport.isForeign
						? !!passport.validityPeriodEnd
						: true

					if (companyType === Info.CompanyType.IP) {
						return !!(
							passport.passportOffice &&
							passport.dateOfIssue &&
							passport.fullName &&
							passport.series &&
							isValidityPeriodEnd
						)
					} else {
						return !!passport.fullName && isValidityPeriodEnd
					}
				}
			)

			const canClosePassports: boolean = !passportsChecks.includes(false)

			return !!(
				this.payment.price.assetAddress &&
				this.insurer.signatory.fullName &&
				this.getCanCloseRegistration &&
				this.getCanClosePayment &&
				canClosePassports
			)
		},

		// @override
		getCanCloseSignatory(): boolean {
			return !!this.insurer.signatory.fio
		},

		getCanClosePayment(): boolean {
			return !!(
				this.payment.main.cv &&
				this.payment.main.startedAt &&
				this.payment.main.finishedAt &&
				this.payment.main.coefficient &&
				this.payment.price.assetAddress &&
				this.payment.price.sumInsured % 100000 === 0
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

		// @override
		getCanVerify(): boolean {
			const companyType: Info.CompanyType = this.insurer.main.companyType

			let passportsChecks: boolean[]

			if (companyType === Info.CompanyType.IP) {
				passportsChecks = this.insurer.passports.map(
					({
						passportOffice,
						dateOfIssue,
						fullName,
						series
					}: StatePassport) => {
						return !!(passportOffice && dateOfIssue && fullName && series)
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

		getSaveData(): BreakService.Deal {
			const configStore = useConfigStore()

			return {
				// @ts-ignore
				dealId: this.deal.id,
				assetAddress: this.payment.price.assetAddress,
				dealContact: this.getDealContact,
				signingPersonInfo: this.getSigningPersonInfo,
				insSum: this.payment.price.sumInsured,
				verificationGuid: configStore.getVerificationGuid("break"),
				companyRequisites: this.getCompanyRequisites,
				startDate: this.payment.main.startedAt,
				endDate: this.payment.main.finishedAt,
				multiplyingKoef: +this.payment.main.coefficient,
				...this.getRegistrationContractData,
				region: +this.registration.placement.region,
				city: +this.registration.placement.city,
				owner: this.deal.responsibleEmail,
				employees: [],
				fioTechsales: "",
				tnTechsales: "",
				price: this.price,
				reasonDate: this.insurer.signatory?.reasonDate || "",
				status: this.deal.status || 10,
				kpp: this.insurer.main.kpp,
				kv: this.payment.main.cv,
				segment: 0,
				personInfoList: this.getPersonInfoList
			}
		},

		getCalculatePayload(): BreakService.Deal {
			return this.getSaveData
		}
	}
})
