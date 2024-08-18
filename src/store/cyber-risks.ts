import _cloneDeep from "lodash/cloneDeep"

import { BaseCalculator, StatePassport } from "~/store/base-calculator"

// Stores
import { useConfigStore } from "~/store"

// Types
import {
	Calculator,
	CyberService,
	DealService,
	Info
} from "@common-repo/types/src"

import { useCalculatorApi } from "~/hooks"

// Data
const baseCalculator = new BaseCalculator(Calculator.TypeEnum.CYBER)

const state = {
	...baseCalculator.getState(),

	packages: [] as DealService.AvailableTariff[],

	packageOptions: [] as DealService.OptionsByTariff,

	payment: {
		main: {
			startedAt: "",
			finishedAt: "",
			coefficient: 1,
			cv: 0
		},
		packages: {
			activePackage: 1
		},
		price: {
			isProlongation: false,
			prolongationDocNumber: "",
			sumInsured: 0
		}
	},

	registration: {
		contract: {
			numberVsp: "",
			fullName: "нет КМ",
			personnelNumber: "нет КМ",
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

export const useCyberRisksStore = defineStore("cyber-risks", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),
		resetState(): void {
			this.resetStateByData(state)
		},
		setDealAdditional(deal: CyberService.PrefetchedDeal): void {
			// Registration
			this.registration.bank.bik = deal?.companyRequisites?.bik || ""
			this.registration.bank.corWallet =
				deal?.companyRequisites?.correspondentAccount || ""
			this.registration.bank.wallet = deal?.companyRequisites?.bankAccount || ""
			this.registration.bank.bankName = deal?.companyRequisites?.bankInfo || ""
			this.registration.bank.email = deal?.companyRequisites?.email || ""
			this.registration.bank.phone = deal?.companyRequisites?.phone || ""
			this.registration.placement.region = deal?.region || ""
			this.registration.placement.city = deal?.cityId || ""
			this.registration.contract.clientType = deal?.clientType || ""
			this.registration.contract.terBank = deal?.terBank || ""
			this.registration.contract.gosb = deal?.gosb || ""
			this.registration.contract.numberVsp = deal?.vsp || ""
			this.registration.contract.fullName = deal?.fioKm || ""
			this.registration.contract.personnelNumber = deal?.tnKm || ""
			this.registration.contract.clientTypeBank = deal?.clientTypeBank || ""

			// Payment
			this.payment.main.startedAt = deal?.startDate || ""
			this.payment.main.finishedAt = deal?.endDate || ""
			this.payment.main.coefficient = deal?.multiplier || ""
			this.payment.main.cv = deal?.commission || ""
			this.payment.price.isProlongation = deal?.isProlongation || false
			this.payment.price.prolongationDocNumber =
				deal?.prolongationDocNumber || ""

			const program = deal.programs?.[0]

			if (program) {
				this.payment.price.sumInsured = program?.insuranceAmount || ""
				this.payment.packages.activePackage = program?.tariff || 1
			}

			this.payment.main.startedAt = deal?.startDate || ""

			this.fetchListsAfterUploadData(deal)
		},
		async fetchListsAfterUploadData(
			deal: CyberService.PrefetchedDeal
		): Promise<void> {
			Promise.all([
				this.fetchGosbIfExist(deal?.terBank || ""),
				this.fetchRegionDataIfExist(deal.region, deal.cityId)
			])
		},
		async fetchPackages(): Promise<void> {
			const $api = useCalculatorApi(this.calculatorType)

			try {
				const [
					{ entity: tariffs, isSuccess: isTariffs },
					{ entity: options, isSuccess: isOptions }
				] = await Promise.all([
					$api.fetchAvailableTariffs(),
					$api.fetchOptionsByTariff(1)
				])

				if (isTariffs) {
					this.packages = tariffs
				}

				if (isOptions) {
					this.packageOptions = options
				}
			} catch (error) {
				throw error
			}
		}
	},

	getters: {
		...baseCalculator.getGetters(),

		// @override
		getCanVerify(): boolean {
			const companyType: Info.CompanyType = this.insurer.main
				.companyType as Info.CompanyType

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

		// @override
		getCanCloseDealAdditional(): boolean {
			const companyType: Info.CompanyType = this.insurer.main
				.companyType as Info.CompanyType

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

			const payment: boolean = !!(
				this.payment.main.startedAt &&
				this.payment.main.finishedAt &&
				this.payment.main.coefficient &&
				this.payment.main.cv &&
				this.payment.packages.activePackage &&
				this.payment.price.sumInsured
			)

			const registration: boolean = !!(
				this.registration.contract.fullName &&
				this.registration.contract.personnelNumber &&
				this.registration.contract.clientType &&
				this.registration.contract.clientTypeBank &&
				this.registration.contract.terBank &&
				this.registration.contract.gosb &&
				this.registration.placement.region &&
				this.registration.placement.city &&
				this.registration.bank.bik &&
				this.registration.bank.corWallet &&
				this.registration.bank.wallet &&
				this.registration.bank.bankName &&
				this.registration.bank.email &&
				this.registration.bank.phone
			)

			return payment && registration && canClosePassports
		},

		getPackages(): State["packages"] {
			return this.packages
		},

		getActivePackage(): State["payment"]["packages"]["activePackage"] {
			return this.payment.packages.activePackage
		},

		getPackageOptions(): State["packageOptions"] {
			// @ts-ignore
			return this.packageOptions
		},

		getProgramOptions(): number[] {
			switch (this.getActivePackage) {
				case 1:
					return [1, 2, 3, 4, 5]
				case 2:
					return [1, 2, 3]
				case 3:
					return [1, 2]
				default:
					return [1]
			}
		},

		getActiveProgram(): DealService.ProgramModel {
			return {
				nid: 1,
				insuranceAmount: this.payment.price.sumInsured || 0,
				// @ts-ignore
				insurancePremium: this.getPrice,
				tariff: this.getActivePackage,
				options: this.getProgramOptions
			}
		},

		getSaveData(): CyberService.Deal {
			const configStore = useConfigStore()

			return {
				// @ts-ignore
				dealId: this.deal.id,
				brokerEmail: this.deal.responsibleEmail,
				insured: +this.insurer.main.companyType,
				companyFullName: this.insurer.main.companyName,
				companyName: this.insurer.main.companyShortName,
				personalName: this.insurer.passports[0].fullName,
				birthPlace: this.insurer.passports[0].placeOfBirth,
				verificationGuid: configStore.getVerificationGuid("cyberRisk"),
				...this.getRegistrationContractData,
				passport: {
					passportSeries: this.insurer.passports[0].series,
					passportOffice: this.insurer.passports[0].passportOffice,
					passportDivisionCode: this.insurer.passports[0].code,
					passportDate: this.insurer.passports[0].dateOfIssue,
					birthday: this.insurer.passports[0].dob
				},
				companyRequisites: {
					inn: this.insurer.main.companyInn,
					kpp: this.insurer.main.kpp,
					regDate: this.insurer.main.regDate,
					ifns: this.insurer.main.ifns,
					ogrn: this.insurer.main.ogrn,
					okved: this.insurer.main.okved,
					legalAddress: {
						cityPlace: this.insurer.companyAddress.cityPlace,
						street: this.insurer.companyAddress.street,
						house: this.insurer.companyAddress.house,
						building: this.insurer.companyAddress.build,
						office: this.insurer.companyAddress.office,
						addressFull: this.getAddressFull
					},
					bik: this.registration.bank.bik,
					correspondentAccount: this.registration.bank.corWallet,
					bankAccount: this.registration.bank.wallet,
					bankInfo: this.registration.bank.bankName,
					email: this.registration.bank.email,
					phone: this.registration.bank.phone
				},
				startDate: this.payment.main.startedAt,
				endDate: this.payment.main.finishedAt,
				multiplier: +this.payment.main.coefficient,
				commission: this.payment.main.cv,
				region: +this.registration.placement.region,
				cityId: +this.registration.placement.city,
				isProlongation: this.payment.price.isProlongation,
				prolongationDocNumber: this.payment.price.prolongationDocNumber,
				personInfo: {
					signatory: this.insurer.signatory.signatory,
					signatoryGenitive: this.insurer.signatory.signatoryGenitive,
					position: this.insurer.signatory.position,
					positionGenetive: this.insurer.signatory.positionGenitive,
					reason: this.insurer.signatory.based,
					document: this.insurer.signatory.reasonDocument!,
					date: this.insurer.signatory.reasonDate!
				},
				owner: this.deal.responsibleEmail,
				programs: [this.getActiveProgram]
			}
		}
	}
})
