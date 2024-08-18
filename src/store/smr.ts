import _cloneDeep from "lodash/cloneDeep"

import { BaseCalculator, StatePassport } from "~/store/base-calculator"

// Components
import { message } from "ant-design-vue"

// Mocks
import { beneficiaryDocument as emptyCredit } from "~/mocks"

// Stores
import { useConfigStore, useInfoStore } from "~/store"

// Types
import {
	KascoService,
	DealService,
	Calculator,
	SmrService,
	Info
} from "@common-repo/types/src"

interface IndustryInterface {
	id: number
	isStop: boolean
	name: string
}

interface Files {
	// @ts-ignore
	[key: SmrService.FileName]: SmrService.File
}

type IndustryObject = IndustryInterface | object

// Data
const calculatorType = Calculator.TypeEnum.SMR
const baseCalculator = new BaseCalculator(calculatorType)
const baseState: any = baseCalculator.getState()

// Set default state data
baseState.insurer.main = {
	...baseState.insurer.main
}

const state = {
	...baseState,

	priceGo: 0,

	pricePpgo: 0,

	priceTerrorRisk: 0,

	payment: {
		main: {
			startedAt: "",
			finishedAt: "",
			worksStartedAt: "",
			worksFinishedAt: "",
			coefficient: "1",
			cv: 80
		},
		object: {
			objectName: "",
			objectClientName: "",
			contractorExperience: 0,
			workTypes: [] as number[],
			builderName: "",
			builderDocument: "",
			objectRegion: 0,
			objectAddress: "",
			isBuildingAlmostDone: false,
			isExpLessOneYear: false,
			isInstallment: false,
			isWaterNear: false,
			installmentType: 0
		},
		price: {
			buildingCost: "",
			sumInsured: "",
			bankFinance: 0,
			franchise: 0
		},
		responsibility: {
			insuranceSumPpgo: 0,
			ppgoFinishedAt: "",
			insuranceSumGo: 0,
			ppgoStartedAt: "",
			isPpgo: false,
			isGo: false,
			isTerrorRisk: false
		},
		files: {
			[SmrService.FileName.BUILDING_PERMIT]: {
				idDoc: 0,
				name: ""
			},
			[SmrService.FileName.CONTRACT]: {
				idDoc: 0,
				name: ""
			},
			[SmrService.FileName.DOP_CONTRACT]: {
				idDoc: 0,
				name: ""
			},
			[SmrService.FileName.ESTIMATE]: {
				idDoc: 0,
				name: ""
			},
			[SmrService.FileName.EXPERTISE]: {
				idDoc: 0,
				name: ""
			},
			[SmrService.FileName.WORK_SCHEDULE]: {
				idDoc: 0,
				name: ""
			},
			[SmrService.FileName.EXTRACT_FROM_EGRP]: {
				idDoc: 0,
				name: ""
			}
		} as Files
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
		beneficiary: {
			beneficiaryDocumentListLoan: [
				{ ...emptyCredit }
			] as SmrService.BeneficiaryDocumentLoan[]
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

type BeneficiaryDocumentName = keyof typeof state.registration.beneficiary

export const useSmrStore = defineStore("smr", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),

		baseActions(): CalculatorBaseStore.Actions {
			const baseCalculator = new BaseCalculator()

			return baseCalculator.getActions<CalculatorBaseStore.Actions>()
		},

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
		},

		// @override
		setData<T = any>(
			tab: Calculator.Tab,
			component: string,
			fieldName: string,
			value: T
		): void {
			if (tab === Calculator.Tab.PAYMENT) {
				this.resetPrice()
			}

			this.baseActions().setData.call(this, tab, component, fieldName, value)
		},

		setBankFinance(value: 1 | 0): void {
			this.payment.price.bankFinance = value
		},

		setDealAdditional(deal: KascoService.PrefetchedDeal): void {
			this.setDealAdditionalSignatory(deal)
			this.setDealAdditionalPayment(deal)
			this.setDealAdditionalRegistration(deal)

			if (
				this.deal.status !== DealService.Status.CLOSED &&
				this.deal.status !== DealService.Status.ERROR &&
				this.deal.status !== DealService.Status.SENDED
			) {
				this.setDates()
				this.setPpgoDates(this.payment.main.finishedAt)
			}
		},

		setDealAdditionalSignatory(deal: SmrService.Deal): void {
			type SigningInfo = SmrService.Deal["signingPersonInfo"]
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

		setDealAdditionalPayment(deal: SmrService.Deal): void {
			this.payment.object.contractorExperience = deal?.contractorExperience || 0
			this.payment.object.isBuildingAlmostDone = deal?.completionStage || false
			this.payment.responsibility.insuranceSumPpgo = deal?.ppGoInsSum || ""
			this.payment.responsibility.ppgoStartedAt = deal?.ppGoStartDate || ""
			this.payment.responsibility.ppgoFinishedAt = deal?.ppGoEndDate || ""
			this.payment.responsibility.insuranceSumGo = deal?.goInsurSum || ""
			this.payment.object.installmentType = deal?.installmentType || 0
			this.payment.main.worksStartedAt = deal?.workingStartDate || ""
			this.payment.object.isWaterNear = deal?.waterDistance || false
			this.payment.main.worksFinishedAt = deal?.workingEndDate || ""
			this.payment.object.objectClientName = deal?.objectOwner || ""
			this.payment.object.objectAddress = deal?.objectPosition || ""
			this.payment.object.isInstallment = !!deal?.installmentType
			this.payment.main.coefficient = deal?.multiplyingKoef || ""
			this.payment.object.builderDocument = deal?.objectDoc || ""
			this.payment.object.objectRegion = deal?.objectRegion || 0
			this.payment.object.builderName = deal?.objectWorker || ""
			this.payment.responsibility.isPpgo = deal?.ppGo || false
			this.payment.price.buildingCost = deal?.workingSum || ""
			this.payment.object.objectName = deal?.objectName || ""
			this.payment.price.bankFinance = deal?.bankFinance || 0
			this.payment.object.workTypes = deal?.workTypes || []
			this.payment.responsibility.isGo = deal?.go || false
			this.payment.price.franchise = deal?.franchise || ""
			this.payment.main.startedAt = deal?.startDate || ""
			this.payment.main.finishedAt = deal?.endDate || ""
			this.payment.price.sumInsured = deal?.insSum || ""
			this.payment.responsibility.isTerrorRisk = deal?.isRiskTerrorism || false
			this.priceTerrorRisk = deal?.terrorRiskPrice || 0
			this.pricePpgo = deal?.ppGoPrice || 0
			this.priceGo = deal?.goPrice || 0

			this.price = deal?.basePrice || 0

			this.setDealAdditionalFiles(deal.files)
		},

		setDealAdditionalFiles(files: SmrService.Deal["files"]): void {
			const filesNames: SmrService.FileName[] = [
				SmrService.FileName.EXTRACT_FROM_EGRP,
				SmrService.FileName.BUILDING_PERMIT,
				SmrService.FileName.WORK_SCHEDULE,
				SmrService.FileName.DOP_CONTRACT,
				SmrService.FileName.EXPERTISE,
				SmrService.FileName.CONTRACT,
				SmrService.FileName.ESTIMATE
			]

			for (const name: SmrService.FileName of filesNames) {
				if (files[name]) {
					this.payment.files[name] = files[name]
				}
			}
		},

		setDealAdditionalRegistration(deal: SmrService.Deal): void {
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
			this.registration.bank.email = deal.dealContact?.email
			this.registration.bank.phone = deal.dealContact?.phone

			this.setDealCreditsData(deal?.beneficiaryDocumentListLoan)
		},

		setDealCreditsData(
			credits: SmrService.BeneficiaryDocumentLoan[] | undefined
		): void {
			if (!credits) {
				this.registration.beneficiary.beneficiaryDocumentListLoan = [
					{ ...emptyCredit }
				]

				return
			}

			const { $dayjs } = useNuxtApp()
			const configStore = useConfigStore()

			const result: SmrService.BeneficiaryDocumentLoan[] = []

			credits.forEach(
				(credit: SmrService.BeneficiaryDocumentLoan, index: number) => {
					const documentDate: string = credit.documentDate
						? $dayjs(credit.documentDate, configStore.getFormatDatesInsurance).format(
								configStore.getFormatDates
						  )
						: ""

					result.push({
						customDocumentType: credit.customDocumentType,
						documentNumber: credit.documentNumber,
						documentType: credit.documentType,
						isCustomType: credit.isCustomType,
						number: credit.number,
						documentDate
					})
				}
			)

			this.registration.beneficiary.beneficiaryDocumentListLoan = result
		},

		setResponsibilityData(
			key: SmrService.CalculationType,
			value: boolean
		): void {
			if (!value) {
				this[`price${key}`] = 0
			}
			this.payment.responsibility[`is${key}`] = value
		},

		async calculateFabric<D = SmrService.Deal | SmrService.TerrorRisk>(
			type: SmrService.CalculationType,
			data?: D
		): Promise<void> {
			const { $analytics, $smrApi } = useNuxtApp()

			if (!data) {
				data = this.getSaveData
			}
			if (this.getIsValidCalculation(type)) {
				try {
					const { entity: price, isSuccess } = await $smrApi[
						// @ts-ignore
						`calculate${type}`
					](data)

					$analytics.calculation({
						calcName: this.calculatorName,
						isSuccess: true,
						value: this[`price${type}`]
					})

					if (isSuccess) {
						// Set price
						this[`price${type}`] = price

						message.success(this.getSuccessCalculateMessage(type, price))
					} else {
						// Reset price
						this[`price${type}`] = 0

						message.error(this.getErrorCalculateMessage(type))
					}
				} catch (error) {
					// Reset price
					this[`price${type}`] = 0

					$analytics.calculation({
						calcName: this.calculatorName,
						isSuccess: false,
						value: this[`price${type}`]
					})

					message.error(this.getErrorCalculateMessage(type))

					throw error
				}
			}
		},

		async calculate(): Promise<void> {
			await this.calculateFabric(SmrService.CalculationType.DEFAULT)
		},

		async calculatePpgo(): Promise<void> {
			await this.calculateFabric(SmrService.CalculationType.PGO)
		},

		async calculateGo(): Promise<void> {
			await this.calculateFabric(SmrService.CalculationType.GO)
		},

		async calculateEmergencyRisk(): Promise<void> {
			await this.calculateFabric(
				SmrService.CalculationType.TERRORRISK,
				this.getTerrorRiskCalculationData
			)
		},

		async saveFile(file: any, name: SmrService.FileName): Promise<void> {
			const { $smrApi } = useNuxtApp()

			const errorMessage: string = "Ошибка сохранения файла"

			try {
				const { entity: id, isSuccess } = await $smrApi.saveFile(file)

				if (isSuccess) {
					this.setFileId(name, id)
				} else {
					message.error(errorMessage)
				}
			} catch (e) {
				message.error(errorMessage)
			}
		},

		setFileId(name: SmrService.FileName, value: number): void {
			this.payment.files[name].idDoc = value
		},

		setFileName(name: SmrService.FileName, value: string): void {
			this.payment.files[name].name = value
		},

		resetFile(name: SmrService.FileName): void {
			this.setFileId(name, 0)
			this.setFileName(name, "")
		},

		setBeneficiaryData(
			documentName: BeneficiaryDocumentName,
			index: number,
			key: keyof SmrService.BeneficiaryDocumentLoan,
			value: any
		): void {
			this.registration.beneficiary[documentName][index][key] = value
		},

		createBeneficiaryDoc(documentName: BeneficiaryDocumentName): void {
			this.registration.beneficiary[documentName].push({
				...emptyCredit
			})
		},

		deleteBeneficiaryDoc(
			documentName: BeneficiaryDocumentName,
			index: number
		): void {
			this.registration.beneficiary[documentName].splice(index, 1)
		},

		setInsuranceSumPpgo(value: string): void {
			this.payment.responsibility.insuranceSumPpgo = value
		},

		setDates(): void {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			if (this.payment.main.startedAt) {
				const startedAtWithIso = $dayjs(
					this.payment.main.startedAt,
					configStore.getFormatDates
				).format(configStore.getFormatDatesInsurance)

				if ($dayjs().isAfter(startedAtWithIso)) {
					this.payment.main.startedAt = $dayjs().format(
						configStore.getFormatDates
					)
					this.payment.main.finishedAt = $dayjs(
						this.payment.main.startedAt,
						configStore.getFormatDates
					)
						.add(1, "year")
						.add(-1, "day")
						.format(configStore.getFormatDates)
				}
			}
		},

		setPpgoDates(value: string): void {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			if (!this.getIsPpgoDisabled) {
				this.payment.responsibility.ppgoStartedAt = value

				this.payment.responsibility.ppgoFinishedAt = $dayjs(
					value,
					configStore.getFormatDates
				)
					.add(1, "year")
					.add(-1, "day")
					.format(configStore.getFormatDates)
			} else {
				this.pricePpgo = 0
				this.payment.responsibility.isPpgo = false
			}
		},

		async sendDraft(): Promise<void> {
			const { $smrApi } = useNuxtApp()

			const errorMessage: string = "Ошибка выпуска проекта договора СМР"

			try {
				const { isSuccess } = await $smrApi.sendDraft(this.getSaveData)

				if (isSuccess) {
					message.success("Проект договора СМР успешно выпущен")
				} else {
					message.error(errorMessage)
				}
			} catch (e) {
				message.error(errorMessage)
			}
		},

		copyDealAdditional(): void {
			this.price = 0
			this.priceGo = 0
			this.pricePpgo = 0
			this.priceTerrorRisk = 0

			this.setDates()
			this.setPpgoDates(this.payment.main.finishedAt)
		},

		resetPrice(): void {
			this.price = 0
			this.priceGo = 0
			this.pricePpgo = 0
			this.priceTerrorRisk = 0
		}
	},

	getters: {
		...baseCalculator.getGetters(),

		// @override
		getCanCloseSignatory(): boolean {
			return true
		},

		// @override
		getCanCloseInsurer(): boolean {
			return !!(this.insurer.main.companyType && this.insurer.main.companyInn)
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
							passport.fullName &&
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

		getCanClosePayment(): boolean {
			return (
				this.getCanCloseResponsibility &&
				this.getCanCloseObject &&
				this.getCanCloseFiles &&
				this.getCanClosePrice
			)
		},

		getCanCloseObject(): boolean {
			type Object = State["payment"]["object"]

			const object: Object = this.payment.object

			return !!(
				object.contractorExperience &&
				object.objectClientName &&
				object.workTypes.length &&
				object.builderDocument &&
				object.objectAddress &&
				object.objectRegion &&
				object.builderName &&
				object.objectName
			)
		},

		getCanClosePrice(): boolean {
			return !!(
				this.payment.price.buildingCost &&
				this.payment.price.sumInsured &&
				this.payment.price.sumInsured <= this.payment.price.buildingCost
			)
		},

		getCanCloseFiles(): boolean {
			const files: Files = this.payment.files

			const mainFiles: SmrService.FileName[] = [
				SmrService.FileName.BUILDING_PERMIT,
				SmrService.FileName.EXPERTISE,
				SmrService.FileName.CONTRACT
			]

			const additionalFiles: SmrService.FileName[] = [
				SmrService.FileName.WORK_SCHEDULE,
				SmrService.FileName.ESTIMATE
			]

			if (this.getIsExpLessOneYear) {
				mainFiles.push(SmrService.FileName.EXTRACT_FROM_EGRP)
				additionalFiles.push(SmrService.FileName.EXTRACT_FROM_EGRP)
			}

			const hasFile = (name: SmrService.FileName): boolean => {
				return !!files[name].idDoc
			}

			const canClose = (list: SmrService.FileName[]): boolean => {
				return list.findIndex((name) => !hasFile(name)) === -1
			}

			return this.getBankFinance
				? canClose(mainFiles)
				: canClose([...mainFiles, ...additionalFiles])
		},

		getCanCloseResponsibility(): boolean {
			type Data = State["payment"]["responsibility"]

			const data: Data = this.payment.responsibility

			const isGo: boolean = !data.isGo || !!data.insuranceSumGo

			const isPpgo: boolean =
				!data.isPpgo ||
				!!(data.insuranceSumPpgo && data.ppgoFinishedAt && data.ppgoStartedAt)

			return isGo && isPpgo
		},

		getBankFinance(): 1 | 0 {
			return this.payment.price.bankFinance || 0
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

		getCalculatePayload(): SmrService.Deal {
			return this.getSaveData
		},

		getIsGo(): boolean {
			return this.payment.responsibility.isGo
		},

		getIsPpgo(): boolean {
			return this.payment.responsibility.isPpgo
		},

		getIsTerrorRisk(): boolean {
			return this.payment.responsibility.isTerrorRisk
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
				this.registration.bank.phone &&
				this.getCanCloseBeneficiary
			)
		},

		getCanCloseBeneficiary(): boolean {
			return (
				this.registration.beneficiary.beneficiaryDocumentListLoan.findIndex(
					({
						customDocumentType,
						documentNumber,
						documentDate,
						documentType,
						isCustomType
					}) => {
						return !(
							documentNumber &&
							documentDate &&
							(isCustomType ? customDocumentType : documentType)
						)
					}
				) === -1
			)
		},

		getIsValidCalculation(): (type: SmrService.CalculationType) => boolean {
			return (type) => {
				const isBaseChecks: boolean = !!(
					this.payment.price.franchise !== undefined &&
					this.payment.price.buildingCost &&
					this.payment.price.sumInsured &&
					!this.payment.object.isWaterNear &&
					!this.payment.object.isBuildingAlmostDone &&
					this.payment.price.sumInsured <= this.payment.price.buildingCost
				)

				switch (type) {
					case SmrService.CalculationType.GO:
						return !!(
							isBaseChecks && this.payment.responsibility.insuranceSumGo
						)
					case SmrService.CalculationType.PGO:
						return !!(
							isBaseChecks &&
							this.payment.responsibility.insuranceSumPpgo &&
							this.payment.responsibility.ppgoStartedAt &&
							this.payment.responsibility.ppgoFinishedAt
						)
					default:
						return isBaseChecks
				}
			}
		},

		getSuccessCalculateMessage(): (
			type: SmrService.CalculationType,
			price: number
		) => string {
			return (type, price) => {
				const messageFabric = (string: string): string => {
					return `Успешный расчет ${string}: ${price} руб.`
				}

				switch (type) {
					case SmrService.CalculationType.PGO:
						return messageFabric("ППГО")
					case SmrService.CalculationType.GO:
						return messageFabric("ГО")
					case SmrService.CalculationType.TERRORRISK:
						return messageFabric("риска Терроризм и диверсия")
					default:
						return messageFabric("сделки")
				}
			}
		},

		getErrorCalculateMessage(): (type: SmrService.CalculationType) => string {
			return (type) => {
				const message: string = "Ошибка расчета"

				switch (type) {
					case SmrService.CalculationType.PGO:
						return message + " ППГО"
					case SmrService.CalculationType.GO:
						return message + " ГО"
					case SmrService.CalculationType.TERRORRISK:
						return message + " риска Терроризм и диверсия"
					default:
						return message + " сделки"
				}
			}
		},

		getIsExpLessOneYear(): boolean {
			return this.payment.object.isExpLessOneYear
		},

		getFile(): (name: SmrService.FileName) => SmrService.File {
			return (name) => {
				return this.payment.files[name]
			}
		},

		getFiles(): SmrService.Files {
			const files: SmrService.Files = _cloneDeep(this.payment.files)

			if (!this.getIsExpLessOneYear) {
				delete files[SmrService.FileName.EXTRACT_FROM_EGRP]
			}

			return files
		},

		getCredits(): SmrService.BeneficiaryDocumentLoan[] {
			return this.registration.beneficiary.beneficiaryDocumentListLoan
		},

		getCreditsWithIsoDates(): SmrService.BeneficiaryDocumentLoan[] {
			const { $dayjs } = useNuxtApp()
			const configStore = useConfigStore()

			const clone = _cloneDeep(
				this.registration.beneficiary.beneficiaryDocumentListLoan
			)

			return clone.map((credit: SmrService.BeneficiaryDocumentLoan) => {
				credit.documentDate = credit.documentDate
					? $dayjs(credit.documentDate, configStore.getFormatDates).format(
							configStore.getFormatDatesInsurance
					  )
					: ""

				return credit
			})
		},

		getCreditData(): (
			index: number,
			key: keyof SmrService.BeneficiaryDocumentLoan
		) => any {
			return (index, key) => {
				return this.getCredits[index][key]
			}
		},

		getInstallmentType(): number {
			return this.payment.object.isInstallment
				? this.payment.object.installmentType
				: 0
		},

		// override
		getCanDraft(): boolean {
			return (
				this.price &&
				(!this.payment.responsibility.isGo || this.priceGo) &&
				(!this.payment.responsibility.isPpgo || this.pricePpgo) &&
				(!this.payment.responsibility.isTerrorRisk || this.priceTerrorRisk)
			)
		},

		getTerrorRiskCalculationData(): SmrService.TerrorRisk {
			return {
				objectRegion: this.payment.object.objectRegion,
				insSum: this.payment.price.sumInsured || 0,
				kv: this.payment.main.cv
			}
		},

		getIsPpgoDisabled(): boolean {
			const { $dayjs } = useNuxtApp()

			const startedAtPlusTwoYears: any = $dayjs(
				this.payment.main.startedAt
			).add(2, "year")

			return $dayjs(startedAtPlusTwoYears).isBefore(
				$dayjs(this.payment.main.finishedAt)
			)
		},

		getCvInRub(): number {
			const totalPrice: number =
				this.price + this.priceGo + this.pricePpgo + this.priceTerrorRisk
			const value: number = totalPrice * (this.payment.main.cv / 100)

			if (value) {
				return Math.round(Number(value.toFixed(2)) * 100) / 100
			}

			return 0
		},

		getSaveData(): SmrService.Deal {
			const configStore = useConfigStore()

			return {
				dealId: this.deal.id,
				price: this.getPrice,
				verificationGuid: configStore.getVerificationGuid("smr"),
				companyRequisites: this.getCompanyRequisites,
				dealContact: this.getDealContact,
				startDate: this.payment.main.startedAt,
				endDate: this.payment.main.finishedAt,
				kv: this.payment.main.cv,
				insSum: this.payment.price.sumInsured || 0,
				...this.getRegistrationContractData,
				fioTechsales: "",
				tnTechsales: "",
				region: +this.registration.placement.region,
				city: +this.registration.placement.city,
				segment: 0,
				status: this.deal.status || 10,
				personInfoList: this.getPersonInfoList,
				signingPersonInfo: this.getSigningPersonInfoWithSignatory,
				isExpLessOneYear: this.getIsExpLessOneYear,
				installment: this.payment.object.isInstallment,
				installmentType: this.getInstallmentType,
				waterDistance: this.payment.object.isWaterNear,
				files: this.getFiles,
				workTypes: this.payment.object.workTypes,
				workingEndDate: this.payment.main.worksFinishedAt,
				workingStartDate: this.payment.main.worksStartedAt,
				workingSum: this.payment.price.buildingCost || 0,
				go: this.getIsGo,
				goInsurSum: +this.payment.responsibility.insuranceSumGo,
				goPrice: this.priceGo,
				ppGo: this.getIsPpgo,
				ppGoEndDate: this.payment.responsibility.ppgoFinishedAt,
				ppGoInsSum: +this.payment.responsibility.insuranceSumPpgo || 0,
				ppGoPrice: this.pricePpgo,
				ppGoStartDate: this.payment.responsibility.ppgoStartedAt,
				owner: this.deal.responsibleEmail,
				beneficiaryDocumentListLoan: this.getCreditsWithIsoDates,
				objectDoc: this.payment.object.builderDocument,
				objectName: this.payment.object.objectName,
				objectOwner: this.payment.object.objectClientName,
				objectPosition: this.payment.object.objectAddress,
				objectRegion: this.payment.object.objectRegion,
				objectWorker: this.payment.object.builderName || "",
				completionStage: this.payment.object.isBuildingAlmostDone,
				contractorExperience: this.payment.object.contractorExperience,
				franchise: this.payment.price.franchise || 0,
				creditDoc: "",
				bankFinance: this.getBankFinance,
				basePrice: this.price,
				beneficiary: 1,
				kpp: this.registration.bank.kpp,
				multiplyingKoef: +this.payment.main.coefficient,
				employees: [],
				reasonDate: this.insurer.signatory?.reasonDate || "",
				isRiskTerrorism: this.getIsTerrorRisk,
				terrorRiskPrice: this.priceTerrorRisk
			}
		}
	}
})
