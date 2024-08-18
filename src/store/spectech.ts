import _cloneDeep from "lodash/cloneDeep"

import { BaseCalculator } from "~/store/base-calculator"

// Components
import { message as antMessage } from "ant-design-vue/lib/components"

// Mocks
import {
	assetItem as emptyAssetItem,
	beneficiaryDocument as emptyBeneficiaryDocument,
	territory as emptyTerritory
} from "~/mocks"

// Hooks
import { useConfigStore, useInfoStore } from "~/store"
import { useCalculatorApi, useUser } from "~/hooks"

// Types
import type { StatePassport } from "~/store/base-calculator"
import {
	CalculatorFields as Fields,
	SpectechService,
	InfoService,
	Calculator,
	Info
} from "@common-repo/types/src"

// Data
const baseCalculator = new BaseCalculator(Calculator.TypeEnum.SPECTECH)
const baseState: any = baseCalculator.getState()

delete baseState.insurer.companyAddress

baseState.insurer.main = {
	...baseState.insurer.main
}

const state = {
	...baseState,

	payment: {
		main: {
			insurancePeriod: 1,
			coefficient: 1,
			finishedAt: "",
			startedAt: "",
			cv: 0
		},

		price: {
			franchise: 0,
			sumInsured: 0,
			plegeSum: 0,
			premium: 0
		},

		territory: {
			isSecurityAssist: false
		}
	},

	territories: [] as SpectechService.Territories,

	registration: {
		contract: {
			numberVsp: "",
			fullName: "нет КМ",
			personnelNumber: "",
			clientType: ""
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
		},

		additional: {
			pledge: true,
			address: "",
			phone: "",
			city: ""
		},

		beneficiary: {
			beneficiaryDocumentListPledge: [{ ...emptyBeneficiaryDocument }],
			beneficiaryDocumentListLoan: [{ ...emptyBeneficiaryDocument }],
			territoryBank: ""
		},

		parent: {
			[Fields.Parent.CRM_PARENT_ID]: "",
			[Fields.Parent.CRM_LEAD_ID]: ""
		}
	}
}

type State = typeof state

type BeneficiaryDocumentName = keyof typeof state.registration.beneficiary

export const useSpectechStore = defineStore("spectech", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),

		// @override
		setDealMainInfo(deal: SpectechService.Deal): void {
			this.insurer.main.companyName = deal.companyNameFull
			this.insurer.main.companyType = deal.companyType

			const requisites: SpectechService.CompanyRequisites | undefined =
				deal?.companyRequisites

			// Requisites
			this.registration.bank.corWallet = requisites.correspondentAccount
			this.registration.bank.wallet = requisites.bankAccount
			this.registration.bank.bankName = requisites.bankInfo
			this.insurer.main.regDate = requisites.regDate
			this.registration.bank.email = requisites.email
			this.registration.bank.phone = requisites.phone
			this.insurer.main.companyInn = requisites.inn
			this.registration.bank.bik = requisites.bik
			this.insurer.main.okved = requisites.okved
			this.insurer.main.ifns = requisites.ifns
			this.insurer.main.ogrn = requisites.ogrn
			this.insurer.main.kpp = requisites.kpp
		},

		// @override
		setDealAdditional(deal: SpectechService.Deal): void {
			this.setDealAdditionalRegistration(deal)
			this.setDealAdditionalSignatory(deal)
			this.setDealAdditionalPayment(deal)

			this.fetchListsAfterUploadData(deal)
		},

		async fetchListsAfterUploadData(deal: SpectechService.Deal): Promise<void> {
			Promise.all([
				this.fetchGosbIfExist(deal?.terBank || ""),
				this.fetchRegionDataIfExist(deal.region, deal.cityId)
			])
		},

		setDealAdditionalSignatory(deal: SpectechService.Deal): void {
			this.insurer.signatory.signatoryGenitive =
				deal.personInfo.signatoryGenitive
			this.insurer.signatory.positionGenitive = deal.personInfo.positionGenitive
			this.insurer.signatory.reasonDocument = deal.personInfo.document
			this.insurer.signatory.signatory = deal.personInfo.signatory
			this.insurer.signatory.position = deal.personInfo.position
			this.insurer.signatory.reasonDate = deal.personInfo.date
			this.insurer.signatory.based = deal.personInfo.reason
		},

		setDealAdditionalRegistration(deal: SpectechService.Deal): void {
			this.registration.contract.clientTypeBank = deal.clientTypeBank
			this.registration.contract.clientType = deal.clientType
			this.registration.contract.personnelNumber = deal.tnKm
			this.registration.contract.terBank = deal.terBank
			this.registration.contract.fullName = deal.fioKm
			this.registration.contract.numberVsp = deal.vsp
			this.registration.contract.gosb = deal.gosb

			this.registration.placement.region = deal.region
			this.registration.placement.city = deal.city

			this.registration.bank.wallet = deal.companyRequisites?.bankAccount || ""
			this.registration.bank.bankName = deal.companyRequisites?.bankInfo || ""
			this.registration.bank.bik = deal.companyRequisites?.bik || ""
			this.registration.bank.kpp = deal.companyRequisites?.kpp || ""
			this.registration.bank.corWallet =
				deal.companyRequisites?.correspondentAccount || ""

			this.registration.bank.email = deal.companyRequisites.email
			this.registration.bank.phone = deal.companyRequisites.phone

			this.setDealAdditionalBeneficiaryRequisites(deal.beneficiaryRequisites)
			this.setDealAdditionalBeneficiary(deal)
		},

		setDealAdditionalBeneficiaryRequisites(
			data: SpectechService.Deal["beneficiaryRequisites"]
		): void {
			this.registration.additional.pledge = !!data.beneficiary
			this.registration.beneficiary.territoryBank = data.tb
			this.registration.additional.phone = data.brokerPhone
			this.registration.additional.address = data.address
			this.registration.additional.city = data.city
		},

		setDealAdditionalBeneficiary(deal: SpectechService.Deal): void {
			const { $dayjs } = useNuxtApp()

			const enum Beneficiary {
				LOAN = "beneficiaryDocumentListLoan",
				PLEDGE = "beneficiaryDocumentListPledge"
			}

			const configStore = useConfigStore()

			const setList = (name: Beneficiary): void => {
				if (deal?.[name]?.length) {
					this.registration.beneficiary[name] = deal[name].map(
						(
							document: SpectechService.BeneficiaryDocument
						): SpectechService.BeneficiaryDocument => {
							if (document.documentDate) {
								document.documentDate = $dayjs(
									document.documentDate,
									configStore.getFormatDatesInsurance
								).format(configStore.getFormatDates)
							}

							return document
						}
					)
				}
			}

			setList(Beneficiary.LOAN)
			setList(Beneficiary.PLEDGE)
		},

		setDealInsurancePeriod(deal: SpectechService.Deal): void {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			this.payment.main.insurancePeriod = deal.insurancePeriod
				? deal.insurancePeriod
				: $dayjs(deal.endDate, configStore.getFormatDates).diff(
						$dayjs(deal.startDate, configStore.getFormatDates),
						"months"
				  )
		},

		setDealAdditionalPayment(deal: SpectechService.Deal): void {
			this.payment.territory.isSecurityAssist = deal.isSecurityAssist
			this.payment.main.coefficient = deal.multiplyingKoef
			this.payment.price.franchise = deal.franchise
			this.payment.main.startedAt = deal.startDate
			this.payment.main.finishedAt = deal.endDate
			this.payment.price.plegeSum = deal.sumZalog
			this.payment.main.cv = deal.kv

			this.setDealAdditionalTerritories(deal.territories)

			this.setDealInsurancePeriod(deal)
		},

		setDealAdditionalTerritories(
			territories: SpectechService.Territories
		): void {
			const infoStore = useInfoStore()

			this.territories = territories.map(
				(territory: SpectechService.Territory) => {
					territory.assetList.forEach(
						(asset: SpectechService.AssetItem, index: number) => {
							territory.assetList[index].name = asset.name
								? (infoStore.getInfoIdByName!(
										Info.InfoType.MACHINERY_GROUPS,
										"dynamic",
										asset.name
								  ) as string) || ""
								: ""
						}
					)

					return territory
				}
			)
		},

		addTerritory(): void {
			const territory = { ...emptyTerritory }
			territory.id = this.territories.length

			this.territories.push(territory)
		},

		deleteTerritory(index: number): void {
			this.territories.splice(index, 1)
		},

		deleteAsset(territoryIndex: number, assetIndex: number): void {
			this.territories[territoryIndex].assetList.splice(assetIndex, 1)
		},

		addAssetItem(index: number): void {
			const assetItem = { ...emptyAssetItem }
			assetItem.keyNum = this.territories[index].assetList.length

			this.territories[index].assetList.push(assetItem)
		},

		deleteAssetItem(index: number): void {
			this.territories[index].assetList.splice(index, 1)
		},

		setAssetItemValue(
			territoryIndex: number,
			index: number,
			field: keyof SpectechService.AssetItem,
			value: any
		): void {
			this.territories[territoryIndex].assetList[index][field] = value
		},

		setMultipleSubjectOfFederations(subjects: number[], index: number) {
			const infoStore = useInfoStore()

			const result: InfoService.Info[] = []

			subjects.forEach((subject: number) => {
				result.push(
					infoStore.getItemById({
						type: "dynamic",
						name: Info.InfoType.SUBJECTS_OF_FEDERATION,
						id: subject
					})
				)
			})

			this.territories[index].subjectOfFederations = result
		},

		setTerritoryFieldValue(
			index: number,
			field: keyof SpectechService.Territory,
			value: any
		): void {
			const infoStore = useInfoStore()

			switch (field) {
				case "subjectOfFederations":
					if (Array.isArray(value)) {
						this.setMultipleSubjectOfFederations(value, index)
					} else {
						this.territories[index][field] = [
							infoStore.getItemById({
								type: "dynamic",
								name: Info.InfoType.SUBJECTS_OF_FEDERATION,
								id: value
							})
						]
					}
					break
				default:
					this.territories[index][field] = value

					if (this.territories[index].subjectOfFederations) {
						this.territories[index].subjectOfFederations = []
					}
					break
			}
		},

		setFactors({
			territoryIndex,
			type = "add",
			value
		}: {
			territoryIndex: number
			type: "add" | "delete"
			value: number
		}) {
			const index: number = this.territories[territoryIndex].factors.findIndex(
				({ id }: { id: number }) => id === value
			)

			if (type === "delete") {
				if (index > -1)
					this.territories[territoryIndex].factors.splice(index, 1)
			} else if (type === "add") {
				const infoStore = useInfoStore()

				const infoValue = infoStore.getItemById({
					type: "dynamic",
					name: Info.InfoType.FACTORS,
					id: value
				})

				if (index === -1)
					this.territories[territoryIndex].factors.push({
						...infoValue,
						value: true
					})
			}
		},

		setBeneficiaryData(
			documentName: BeneficiaryDocumentName,
			index: number,
			key: keyof SpectechService.BeneficiaryDocument,
			value: any
		): void {
			this.registration.beneficiary[documentName][index][key] = value
		},

		createBeneficiaryDoc(documentName: BeneficiaryDocumentName): void {
			this.registration.beneficiary[documentName].push({
				...emptyBeneficiaryDocument
			})
		},

		deleteBeneficiaryDoc(
			documentName: BeneficiaryDocumentName,
			index: number
		): void {
			this.registration.beneficiary[documentName].splice(index, 1)
		},

		// @override
		async calculate(): Promise<void> {
			const { $analytics } = useNuxtApp()

			if (this.getIsValidCalculation) {
				const $api = useCalculatorApi(this.calculatorType)

				try {
					const response: SpectechService.CalculateResponse =
						(await $api.calculate(
							this.getCalculatePayload
						)) as SpectechService.CalculateResponse

					$analytics.calculation({
						calcName: this.calculatorName,
						isSuccess: true,
						value: response.insuranceCost
					})

					if (response?.isSuccess) {
						// Set price
						this.price = response.insurancePremium
						this.payment.price.sumInsured = response.insuranceSum
						this.payment.price.premium = response.insurancePremium

						antMessage.success(
							`Успешный расчет сделки ${response.insuranceCost}`
						)
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
		},

		async sendPreCalculation(): Promise<void> {
			const { $spectechApi } = useNuxtApp()

			try {
				const { isSuccess } = await $spectechApi.sendDraft(this.getSaveData)

				if (isSuccess) {
					antMessage.success("Предрасчет успешно отправлен")
				} else {
					throw new Error()
				}
			} catch (e) {
				antMessage.error("Ошибка отправки предрасчета")
			}
		},

		setUploadedTerritories(
			territories: SpectechService.UploadedTerritory[]
		): void {
			let currentTerritoryIndex: number = this.territories.length - 1

			if (currentTerritoryIndex < 0) {
				this.territories.push(emptyTerritory)

				currentTerritoryIndex = 0
			}

			for (const territory of territories) {
				const newAsset: SpectechService.AssetItem = { ...emptyAssetItem }

				newAsset.productionYear = territory.productionYear + ""
				newAsset.engineNumber = territory.engineNumber
				newAsset.vendorName = territory.vendorName
				newAsset.modelName = territory.modelName
				newAsset.sumZalog = territory.sumZalog
				newAsset.name = territory.name
				newAsset.sum = territory.sum

				this.territories[currentTerritoryIndex].assetList.push(newAsset)
			}
		},

		resetState(): void {
			this.resetStateByData(state)
		}
	},

	getters: {
		...baseCalculator.getGetters(),

		getCanPreCalculation(): boolean {
			return !!(this.deal.id && this.payment.price.premium)
		},

		// @override
		getCanCloseDealAdditional(): boolean {
			const companyType: Info.CompanyType = this.insurer.main.companyType

			const passportsChecks: boolean[] = this.insurer.passports.map(
				(passport: StatePassport) => {
					const isForeignPersonPassportDateTo: boolean =
						!passport.isForeign || !!passport.foreignPersonPassportDateTo

					if (companyType === Info.CompanyType.IP) {
						return !!(isForeignPersonPassportDateTo && passport.fullName)
					} else {
						return !!passport.fullName
					}
				}
			)

			const canClosePassports: boolean = !passportsChecks.includes(false)

			return !!(
				(this.insurer.signatory.signatory as string) &&
				this.getCanCloseRegistration &&
				this.getCanClosePayment &&
				canClosePassports
			)
		},

		getCanCloseRegistration(): boolean {
			const { additional, placement, contract, bank, beneficiary } =
				this.registration

			const canContract: boolean = !!(
				contract.personnelNumber &&
				contract.clientTypeBank &&
				contract.clientType &&
				contract.fullName &&
				contract.terBank &&
				contract.gosb
			)

			const canPlacement: boolean = !!(placement.region && placement.city)

			const canBank: boolean = !!(
				bank.corWallet &&
				bank.bankName &&
				bank.wallet &&
				bank.email &&
				bank.bik &&
				bank.phone
			)

			const canAdditional: boolean = !!(
				additional.address &&
				additional.pledge &&
				additional.phone &&
				additional.city
			)

			const canBeneficiary = !!(
				(beneficiary.territoryBank as string) && this.getCanCloseBeneficiaryList
			)

			return (
				canBeneficiary &&
				canAdditional &&
				canPlacement &&
				canContract &&
				canBank
			)
		},

		getCanCloseBeneficiaryList(): boolean {
			const beneficiary = this.registration.beneficiary

			let canBeneficiaryList: boolean = false

			const beneficiaryList: string[] = [
				"beneficiaryDocumentListPledge",
				"beneficiaryDocumentListLoan"
			]

			for (const listName of beneficiaryList) {
				const documents: SpectechService.BeneficiaryDocument[] =
					beneficiary[listName]

				for (const document of documents) {
					const canCloseDocument: boolean = !!(document.isCustomType
						? document.customDocumentType
						: document.documentType &&
						  document.documentDate &&
						  document.documentNumber)

					if (canCloseDocument && !canBeneficiaryList) {
						canBeneficiaryList = true
					} else if (!canBeneficiaryList) {
						canBeneficiaryList = false
						break
					} else {
						break
					}
				}
			}

			return canBeneficiaryList
		},

		getCanClosePayment(): boolean {
			const canMain: boolean = !!(
				this.payment.main.insurancePeriod &&
				this.payment.main.coefficient &&
				this.payment.main.finishedAt &&
				this.payment.main.startedAt &&
				this.payment.main.cv
			)

			const canPrice: boolean = !!(
				this.payment.price.sumInsured &&
				this.payment.price.plegeSum &&
				this.payment.price.premium
			)

			const canTerritory: boolean = !!(
				this.payment.territory.isSecurityAssist && this.territories.length
			)

			return canMain && canPrice && canTerritory
		},

		// @override
		getIsValidCalculation(): boolean {
			return !!(
				this.payment.territory.isSecurityAssist &&
				this.payment.main.finishedAt &&
				this.getTerritories.length &&
				this.payment.main.startedAt
			)
		},

		getTerritories(): State["territories"] {
			return this.territories
		},

		getTerritoriesInsurance(): SpectechService.Territories {
			const infoStore = useInfoStore()

			return this.getTerritories.map((territory: SpectechService.Territory) => {
				territory = _cloneDeep(territory)

				territory.assetList.forEach(
					(asset: SpectechService.AssetItem, index: number) => {
						territory.assetList[index].name = asset.name
							? infoStore.getItemById({
									name: Info.InfoType.MACHINERY_GROUPS,
									type: "dynamic",
									id: asset.name
							  })?.name || ""
							: ""
					}
				)

				return territory
			})
		},

		getAssetItemValue(): (
			territoryIndex: number,
			index: number,
			field: keyof SpectechService.AssetItem
		) => any {
			return (territoryIndex, index, field) => {
				return this.territories[territoryIndex].assetList[index][field]
			}
		},

		getIsSecurityAssist(): boolean {
			return this.payment.territory.isSecurityAssist || false
		},

		getBeneficiaryList(): (
			getterName: string
		) => SpectechService.BeneficiaryDocument[] {
			const { $dayjs } = useNuxtApp()

			return (getterName) => {
				const configStore = useConfigStore()

				return this[getterName].map(
					(document: SpectechService.BeneficiaryDocument) => {
						const result = { ...document }

						result.documentDate = $dayjs(
							result.documentDate,
							configStore.getFormatDates
						).format(configStore.getFormatDatesInsurance)

						return result
					}
				)
			}
		},

		getBeneficiaryDocumentListPledge(): SpectechService.BeneficiaryDocument[] {
			return this.getBeneficiaryList("getPledgeList")
		},

		getBeneficiaryDocumentListLoan(): SpectechService.BeneficiaryDocument[] {
			return this.getBeneficiaryList("getCredits")
		},

		getCredits(): SpectechService.BeneficiaryDocument[] {
			return this.registration.beneficiary.beneficiaryDocumentListLoan || []
		},

		getPledgeList(): SpectechService.BeneficiaryDocument[] {
			return this.registration.beneficiary.beneficiaryDocumentListPledge || []
		},

		getBeneficiaryRequisites(): SpectechService.BeneficiaryRequisites {
			return {
				beneficiary: +this.registration.additional.pledge,
				tb: this.registration.beneficiary.territoryBank,
				brokerPhone: this.registration.additional.phone,
				address: this.registration.additional.address,
				city: this.registration.additional.city,
				beneficTextarea: ""
			}
		},

		getCompanyRequisites(): SpectechService.CompanyRequisites {
			return {
				correspondentAccount: this.registration.bank.corWallet,
				bankAccount: this.registration.bank.wallet,
				bankInfo: this.registration.bank.bankName,
				regDate: this.insurer.main.regDate,
				inn: this.insurer.main.companyInn,
				bik: this.registration.bank.bik,
				okved: this.insurer.main.okved,
				ifns: this.insurer.main.ifns,
				directorIsForeignPerson: false,
				ogrn: this.insurer.main.ogrn,
				kpp: this.insurer.main.kpp,
				directorCitizenshipId: "",
				legalAddress: null, // todo
				passportOffice: "",
				passportDate: "",
				personBirth: "",
				birthPlace: "",
				expiryDate: "",
				middleName: "",
				firstName: "",
				groupFL: "",
				director: "",
				lastName: "",
				passport: "",
				email: this.registration.bank.email,
				phone: this.registration.bank.phone
			}
		},

		getPersonInfo(): SpectechService.PersonInfo {
			return {
				positionGenitive: this.insurer?.signatory?.positionGenitive || "",
				signatoryGenitive: this.insurer.signatory.signatoryGenitive,
				document: this.insurer.signatory.reasonDocument!,
				signatory: this.insurer.signatory.signatory,
				position: this.insurer.signatory.position,
				date: this.insurer.signatory.reasonDate!,
				reason: this.insurer.signatory.based
			}
		},

		getIsPledge(): boolean {
			return this.registration.additional.pledge
		},

		// @override
		getCalculatePayload(): SpectechService.Deal {
			return this.getSaveData
		},

		getSaveData(): SpectechService.Deal {
			const configStore = useConfigStore()

			const { name: brokerName = "" } = useUser()

			return {
				crmParentId: this.registration.parent[Fields.Parent.CRM_PARENT_ID] || 0,
				beneficiaryDocumentListPledge: this.getBeneficiaryDocumentListPledge,
				crmLeadId: this.registration.parent[Fields.Parent.CRM_LEAD_ID] || 0,
				beneficiaryDocumentListLoan: this.getBeneficiaryDocumentListLoan,
				verificationGuid: configStore.getVerificationGuid("spectech"),
				beneficiaryRequisites: this.getBeneficiaryRequisites,
				multiplyingKoef: this.payment.main.coefficient + "",
				insurancePeriod: this.payment.main.insurancePeriod,
				region: +this.registration.placement.region || 0,
				companyNameFull: this.insurer.main.companyName,
				city: +this.registration.placement.city || 0,
				companyRequisites: this.getCompanyRequisites,
				companyName: this.insurer.main.companyName,
				companyType: this.insurer.main.companyType,
				isSecurityAssist: this.getIsSecurityAssist,
				franchise: +this.payment.price.franchise,
				brokerEmail: this.deal.responsibleEmail,
				...this.getRegistrationContractData,
				startDate: this.payment.main.startedAt,
				endDate: this.payment.main.finishedAt,
				sumZalog: this.payment.price.plegeSum,
				territories: this.getTerritoriesInsurance,
				owner: this.deal.responsibleEmail,
				personInfo: this.getPersonInfo,
				kv: this.payment.main.cv,
				price: this.getPrice,
				id: this.deal.id,
				currency: "Руб",
				brokerName,

				zalog: 0,
				dealBeneficiaryTerBank: "", // Todo: add value
				exchangeRate: 0, // Todo: add value
				installment: 0 // Todo: add value
			}
		}
	}
})
