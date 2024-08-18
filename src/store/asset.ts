import _cloneDeep from "lodash/cloneDeep"

// Store
import { BaseCalculator } from "~/store/base-calculator"
import { useInfoStore, useConfigStore } from "~/store"

// Components
import { message } from "ant-design-vue"

// Types
import {
	Info,
	Calculator,
	DealService,
	CalculatorFields as Fields
} from "@common-repo/types/src"
import { AssetService } from "~/types"

// Data
const calculatorType = Calculator.TypeEnum.ASSET
const baseCalculator = new BaseCalculator(calculatorType)
const baseState: any = baseCalculator.getState()

import {
	assetBeneficiaryDocument as emptyBeneficiaryDocument,
	assetTerritory as emptyTerritory,
	asset as emptyAssetItem,
	risks as defaultRisks
} from "~/mocks"

function baseInsuranceFabric(cv: number = 30) {
	return {
		insurancePremium: "",
		calculationId: "",
		isSelected: false,
		policyId: "",
		cv
	}
}

// Set default state data
baseState.insurer.main = {
	...baseState.insurer.main
}

const state = {
	...baseState,

	territories: [] as AssetService.Territories,

	payment: {
		main: {
			franchise: 0 as string | number,
			coefficient: "1",
			finishedAt: "",
			startedAt: "",
			cv: 0
		},

		summary: {
			// Main
			movableProperty: 1,
			equipments: 1,
			buildings: 1,
			lands: 1,
			tmc: 1,

			// Additional
			pledgeSum: 0,

			beneficiary: "Банк",
			pledge: "1",

			risks: [...defaultRisks]
		},

		sogaz: baseInsuranceFabric(),
		Insurance: baseInsuranceFabric()
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
		},

		parent: {
			[Fields.Parent.CRM_PARENT_ID]: "",
			[Fields.Parent.CRM_LEAD_ID]: ""
		}
	}
}
type State = typeof state

export const useAssetStore = defineStore("asset", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),
		resetState(): void {
			this.resetStateByData(state)
		},

		addTerritory(): void {
			const infoStore = useInfoStore()

			const territory: AssetService.Territory = { ...emptyTerritory }

			territory.id = this.territories.length
			territory.factors = infoStore.getAssetFactors

			this.territories.push(territory)
		},

		deleteTerritory(index: number): void {
			this.territories.splice(index, 1)
		},

		addAssetItem(index: number): void {
			const assetItem = { ...emptyAssetItem }
			assetItem.keyNum = this.territories[index].assetList.length

			this.territories[index].assetList.push(assetItem)
		},

		deleteAssetItem(index: number): void {
			this.territories[index].assetList.splice(index, 1)
		},

		toggleSelectedRiskByIndex(index: number) {
			const value: boolean | undefined =
				this.payment.summary.risks[index].selected

			if (typeof value === "boolean") {
				this.payment.summary.risks[index]!.selected = !value
			}
		},

		setAssetItemValue(
			territoryIndex: number,
			index: number,
			field: keyof AssetService.AssetItem,
			value: any
		): void {
			this.territories[territoryIndex].assetList[index][field] = value
		},

		setTerritoryFieldValue(
			index: number,
			field: keyof AssetService.Territory,
			value: any
		): void {
			if (!this.territories?.[index]?.[field]) {
				console.error(
					`Failed to set field ${field} to territory with index ${index}`
				)

				return
			}

			this.territories[index][field] = value
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
			const factorIndex: number = this.territories[
				territoryIndex
			].factors.findIndex((factor: AssetService.Factor) => {
				return factor.id === value
			})

			if (type === "delete") {
				this.territories[territoryIndex].factors[factorIndex].selected = false
			} else if (type === "add") {
				this.territories[territoryIndex].factors[factorIndex].selected = true
			}
		},

		setDealAdditional(deal: AssetService.Deal): void {
			this.setDealAdditionalInsurer(deal)
			this.setDealAdditionalPayment(deal)
			this.setDealAdditionalRegistration(deal)

			this.setDealTerritories(deal.territories)
		},

		setDealTerritories(territories: AssetService.Territory[]): void {
			const infoStore = useInfoStore()

			const baseFactors: Info.AssetFactor[] = [...infoStore.getAssetFactors]

			for (const [territoryIndex, territory] of territories.entries()) {
				const incomingFactors: Info.AssetFactor[] = territory.factors

				territories[territoryIndex].factors = _cloneDeep(baseFactors)

				const factors: Info.AssetFactor[] = territories[territoryIndex].factors

				for (const [indexFactor, factor] of factors.entries()) {
					const incomingIndex: number = incomingFactors.findIndex(
						(incomingFactor) => {
							return incomingFactor.id === factor.id
						}
					)

					if (incomingIndex > -1) {
						territories[territoryIndex].factors[indexFactor].selected =
							incomingFactors[incomingIndex].selected
					}
				}
			}

			this.territories = territories
		},

		setDealAdditionalInsurer(deal: AssetService.Deal): void {
			this.insurer.companyAddress.cityPlace = deal.city
			this.insurer.main.kpp = deal.kpp

			this.setDealAdditionalSignatory(deal)
		},

		setDealAdditionalSignatory(deal: AssetService.Deal): void {
			type SigningInfo = AssetService.Deal["signingPersonInfo"]
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

		setDealAdditionalPayment(deal: AssetService.Deal): void {
			this.payment.main.cv = deal.kv

			this.setDealAdditionalContractInfo(deal.contractInfo)
			this.setDealAdditionalSummary(deal)
		},

		setDealAdditionalSummary(deal: AssetService.Deal): void {
			for (const risk of deal.insuranceRisks) {
				const index: number = this.payment.summary.risks.findIndex(
					(currentRisk: AssetService.Risk) => currentRisk.id === risk.id
				)

				if (index === -1) {
					continue
				}

				this.payment.summary.risks[index].selected = risk.selected
			}
		},

		setDealAdditionalContractInfo(
			contractInfo: AssetService.ContractInfo
		): void {
			this.payment.main.startedAt = contractInfo.startDate
			this.payment.main.finishedAt = contractInfo.endDate

			this.payment.summary.pledgeSum = contractInfo.pledgeSum
			this.payment.summary.pledge = contractInfo.pledge + ""
			this.payment.main.franchise = contractInfo.franchise
			this.payment.main.cv = contractInfo.kv
		},

		setDealAdditionalRegistration(deal: AssetService.Deal): void {
			this.registration.parent[Fields.Parent.CRM_PARENT_ID] =
				deal.crmParentId || 0
			this.registration.parent[Fields.Parent.CRM_LEAD_ID] = deal.crmLeadId || 0
		},

		async downloadExampleFile(): Promise<void> {
			const { $assetApi, $downloadBlob } = useNuxtApp()

			try {
				// @ts-ignore
				const file: Blob = await $assetApi.fetchExampleTerritoriesFile()

				$downloadBlob(file, "territories")
			} catch (e) {
				throw "Failed to download file with territories"
			}
		},

		async uploadFileWithTerritories(file: Blob): Promise<void> {
			const { $assetApi } = useNuxtApp()

			message.loading({
				content: "Загрузка файла с территориями",
				key: this.uploadFileWithTerritories.name,
				duration: 10000
			})

			try {
				const { IsSuccess, isSuccess } = await $assetApi.loadTerritoriesByFile(
					// @ts-ignore
					file
				)

				if (IsSuccess || isSuccess) {
					message.destroy()

					message.success({
						content: "Успешная загрузка файла",
						key: this.uploadFileWithTerritories.name,
						duration: 1000
					})
				}
			} catch (e) {
				message.destroy()

				message.error({
					content: "Ошибка загрузки файла",
					key: this.uploadFileWithTerritories.name,
					duration: 1000
				})

				throw "Failed to upload file with territories"
			}

			window.setTimeout(() => message.destroy(), 1000)
		}
	},

	getters: {
		...baseCalculator.getGetters(),

		getTerritories(): AssetService.Deal["territories"] {
			return this.territories
		},

		getInsuranceData() {
			return (payload: AssetService.InsuranceParams) => {
				const value: string | number | undefined =
					this.$state.payment?.[payload.company]?.[payload.key]

				if (typeof value !== "undefined") {
					return value
				} else {
					return ""
				}
			}
		},

		getAssetItemValue(): (
			territoryIndex: number,
			index: number,
			field: keyof AssetService.AssetItem
		) => any {
			return (territoryIndex, index, field) => {
				return this.territories[territoryIndex].assetList[index][field]
			}
		},

		getInsuranceSubObjectsOptions(): (
			territoryIndex: number,
			index: number
		) => AssetService.InsuranceSubObjectsOption[] {
			const infoStore = useInfoStore()

			return (territoryIndex, index) => {
				const insuranceObjectId: number =
					this.territories[territoryIndex].assetList[index].insuranceObjectName

				const insuranceObjectIndex: number =
					infoStore.getAssetInsuranceObjects.findIndex(
						({ id }) => id === insuranceObjectId
					)

				return infoStore.getAssetInsuranceObjects[
					insuranceObjectIndex
				].subObjects.map(
					({
						id,
						isChildRequired,
						isLock,
						name,
						selected,
						subObjects,
						sum,
						sumZalog
					}: AssetService.InsuranceObject) => {
						return {
							value: id,
							isChildRequired,
							isLock,
							label: name,
							selected,
							subObjects,
							sum,
							sumZalog
						}
					}
				)
			}
		},

		getContractInfo(): AssetService.Deal["contractInfo"] {
			return {
				multiplyingCoefficientTitul: 0,
				multiplyingCoefficient: 0,
				insurancePremiumSogaz: 0,
				insurancePremiumTitul: 0,
				insurancePremiumInsurance: 0,
				insuranceSumTitul: 0,
				isContainsTitul: false,
				insurancePremium: 0,
				insuranceCompany: 0,
				policyNumber: "",
				insuranceSum: 0,
				installment: 0,
				closeDate: "",
				kvTitul: 0,

				pledgeSum: this.payment.summary.pledgeSum,
				franchise: this.payment.main.franchise,
				startDate: this.payment.main.startedAt,
				endDate: this.payment.main.finishedAt,
				pledge: +this.payment.summary.pledge,
				kv: this.payment.main.cv
			}
		},

		getBrokerInfo(): AssetService.Deal["brokerInfo"] {
			return {
				owner: this.deal.responsibleEmail,
				phone: ""
			}
		},

		getBeneficiaryDocumentListPledge(): AssetService.Deal["beneficiaryDocumentListPledge"] {
			return [{ ...emptyBeneficiaryDocument }]
		},

		getBeneficiaryDocumentListLoan(): AssetService.Deal["beneficiaryDocumentListLoan"] {
			return [{ ...emptyBeneficiaryDocument }]
		},

		getInsuranceRisks(): AssetService.Deal["insuranceRisks"] {
			return this.payment.summary.risks
		},

		getSaveData(): AssetService.Deal {
			const configStore = useConfigStore()

			return {
				beneficiaryDocumentListPledge: this.getBeneficiaryDocumentListPledge,
				beneficiaryDocumentListLoan: this.getBeneficiaryDocumentListLoan,
				companyRequisites: this.getCompanyRequisites,
				signingPersonInfo: this.getSigningPersonInfo,
				personInfoList: this.getPersonInfoList,
				insuranceRisks: this.getInsuranceRisks,
				contractInfo: this.getContractInfo,
				territories: this.getTerritories,
				brokerInfo: this.getBrokerInfo,

				...this.getRegistrationContractData,

				verificationGuid: configStore.getVerificationGuid("asset"),
				region: +this.registration.placement.region,
				city: this.insurer.companyAddress.cityPlace,
				owner: this.deal.responsibleEmail,
				status: this.deal.status || 10,
				id: this.deal.id,

				kpp: this.insurer.main.kpp,
				kv: this.payment.main.cv,

				beneficiaryTextSogaz: "",
				beneficiaryTextInsurance: "",
				crmId: 0,

				crmParentId: this.registration.parent[Fields.Parent.CRM_PARENT_ID] || 0,
				crmLeadId: this.registration.parent[Fields.Parent.CRM_LEAD_ID] || 0,

				// Static
				oldTermsProlongation: false,
				fioTechsales: "",
				tnTechsales: "",
				beneficiary: 1,
				dealId: null,
				segment: 0
			}
		}
	}
})
