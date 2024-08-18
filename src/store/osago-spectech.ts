import _cloneDeep from "lodash/cloneDeep"

import { BaseCalculator, StatePassport } from "~/store/base-calculator"

// Components
import { message, notification } from "ant-design-vue"

// Hooks
import { useCalculatorApi } from "~/hooks"

// Types
import { CalculatorBaseStore } from "~/types"
import {
	CalculatorFields as Fields,
	OsagoSpectechService,
	VerificationService,
	AvtocodService,
	KascoService,
	DealService,
	Calculator,
	Info
} from "@common-repo/types/src"

// Store
import { useConfigStore, useInfoStore } from "~/store"

interface InsuranceParams {
	company: KascoService.InsuranceCompany
	type: KascoService.InsuranceType
	key: KascoService.InsuranceKey
}

interface PaymentDocument {
	number: string
	date: string
}

interface InsurancePayload extends InsuranceParams {
	value: string | number | boolean
}

// Data
const insurerDocumentOption: string =
	"Выписка из единого государственного реестра юридических лиц (ЕГРЮЛ)"

const baseCalculator = new BaseCalculator(Calculator.TypeEnum.KASCO)

const baseState: any = baseCalculator.getState()

const baseInsurance = {
	isSelected: false,
	insurancePremium: "",
	calculationId: "",
	policyId: "",
	cv: 10
}

// Set default state data
baseState.insurer.main = {
	...baseState.insurer.main
}

const state = {
	...baseState,

	payment: {
		crm: {
			id: 0
		},

		data: {
			paymentOrderNumber: "",
			paymentOrderDate: ""
		},

		main: {
			registrationNumber: "",
			documentIssueDate: "",
			ptsSeriesNumber: "",
			documentSeries: "",
			documentNumber: "",
			ptsIssueDate: "",
			documentType: "",
			originalName: "",
			isCustom: false,
			polisNumber: "",
			customModel: "",
			enginePower: "",
			subCategory: 0,
			customMark: "",
			bodyNumber: "",
			isPolis: false,
			passCount: 5,
			issueYear: "",
			category: "",
			modelId: "",
			chassis: "",
			maxMass: "0",
			markId: "",
			vin: "",
			cv: 10
		},

		owner: {
			isDifferent: false,
			companyType: 0,
			documentType: "",
			inn: "",
			documentNumber: "",
			companyName: "",
			documentIssueDate: "",

			// Additional
			shortCompanyName: "",
			opf: "",
			opfid: 0,
			opfCode: 0,
			opfName: "",
			InsuranceCode: 0,
			InsuranceName: "",
			address: {
				localityCodeKladr: "",
				useAddressFull: true,
				federalDistrict: "",
				addressFull: "",
				cityKladr: "",
				cityPlace: "",
				locality: "",
				building: "",
				district: "",
				address: "",
				country: "",
				fiasId: "",
				office: "",
				region: "",
				street: "",
				house: "",
				kladr: "",
				flat: "",
				area: ""
			} as OsagoSpectechService.Address
		},

		osago: {
			startedAt: "",
			finishedAt: "",
			insurerDocument: "",
			insurerDocumentNumber: "",
			insurerDocumentDate: "",
			usage: 0,
			isTrailer: false,

			Insurance: { ...baseInsurance }
		}
	},

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

		signatory: {
			signatory: "",
			signatoryGenitive: "",
			position: "",
			positionGenitive: "",
			based: ""
		},

		bank: {
			postAddress: "",
			corWallet: "",
			bankName: "",
			wallet: "",
			email: "",
			phone: "",
			bik: "",
			kpp: ""
		},

		parent: {
			[Fields.Parent.OSAGO_CRM_PARENT_ID]: "",
			[Fields.Parent.OSAGO_CRM_LEAD_ID]: ""
		}
	},

	preApprovement: {
		crmLeadGrade: "",
		crmLeadId: "",
		isPreapproved: false
	},

	paymentDocument: {
		number: "",
		date: ""
	} as PaymentDocument,

	canCloseOsago: false
}

type State = typeof state

export const useOsagoSpectechStore = defineStore("osago-spectech", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),

		baseActions(): CalculatorBaseStore.Actions {
			const baseCalculator = new BaseCalculator()

			return baseCalculator.getActions<CalculatorBaseStore.Actions>()
		},

		// @override
		setData<T = any>(
			tab: Calculator.Tab,
			component: string,
			fieldName: string,
			value: T
		): void {
			if (
				tab === Calculator.Tab.PAYMENT &&
				this.$state[tab][component][fieldName] !== value
			) {
				this.resetInsurancesIfExist({})
			}

			this.baseActions().setData.call(this, tab, component, fieldName, value)
		},

		// @override
		async fetchDeal(id: string | number): Promise<void> {
			await this.baseActions().fetchDeal.call(this, id)
			this.fetchDataByInn()
		},

		resetState(): void {
			this.resetStateByData(state)
		},

		setInsuranceData(payload: InsurancePayload): void {
			const key: string | number | undefined =
				this.$state.payment?.[payload.type]?.[payload.company]?.[payload.key]

			if (typeof key !== "undefined") {
				this.$state.payment[payload.type][payload.company][payload.key]! =
					payload.value
			}
		},

		async fetchDataByVin(): Promise<void> {
			const $api = useCalculatorApi(this.calculatorType)
			const vin: string = this.payment.main.vin

			this.isLoading = true

			try {
				const InsuranceData: KascoService.DataByVinResponse =
					await $api.fetchDataByVin(vin)
				if (!InsuranceData.isSuccess) {
					await this.fetchAvtocodeData(vin)
				} else {
					this.setAvtoCodeData(InsuranceData, "Insurance")
				}
			} catch (e) {
				await this.fetchAvtocodeData(vin)
			} finally {
				this.isLoading = false
			}
		},

		async fetchOwnerByInn(inn: string): Promise<void> {
			const { $verificationApi } = useNuxtApp()
			const configStore = useConfigStore()

			const VerificationGuid: string = configStore.getVerificationGuid(
				this.verificationGuid
			)

			try {
				const { entity: company, isSuccess } =
					await $verificationApi.fetchDataByInn(inn, VerificationGuid)

				if (isSuccess) {
					this.setOwnerOpfByCompany(company)
					await this.fetchInsuranceOwnerOpfs()
				}
			} catch (error) {
				throw error
			}
		},

		async fetchInsuranceOpf(): Promise<void> {
			const { $osagoSpectechApi } = useNuxtApp()

			try {
				const { entity: opf, isSuccess } = await $osagoSpectechApi.fetchInsuranceOpfs(
					this.insurer.main.opfCode
				)

				if (isSuccess && opf?.opfName) {
					this.insurer.main.opf = opf.opfName
				}
			} catch (error) {
				throw error
			}
		},

		async fetchFias(address: string = ""): Promise<string | void> {
			const { $kascoApi } = useNuxtApp()
			try {
				if (address) {
					return await $kascoApi.fetchFiasByAddress(address)
				}

				const fiasId: string =
					(await $kascoApi.fetchFiasByAddress(
						this.insurer.companyAddress.address
					)) || ""

				if (fiasId) {
					this.insurer.companyAddress.fias_id = fiasId
				}
			} catch (error) {
				throw error
			}
		},

		async fetchInsuranceOwnerOpfs(): Promise<void> {
			const { $osagoSpectechApi } = useNuxtApp()

			try {
				const { entity: opf, isSuccess } = await $osagoSpectechApi.fetchInsuranceOpfs(
					this.payment.owner.opfCode
				)

				if (isSuccess) {
					this.setInsuranceOwnerOpf(opf)
				}
			} catch (error) {
				throw error
			}
		},

		async fetchPreApprove(): Promise<void> {
			if (this.insurer.main.companyInn) {
				const { $osagoSpectechApi } = useNuxtApp()

				try {
					const { entity, isSuccess } = await $osagoSpectechApi.fetchPreApprove(
						this.insurer.main.companyInn
					)

					if (isSuccess) {
						this.preApprovement.isPreapproved = entity?.isPreapproved || false
						this.preApprovement.crmLeadGrade = entity?.crmLeadGrade || ""
						this.preApprovement.crmLeadId = entity?.crmLeadId || ""
					}
				} catch (error) {
					throw error
				}
			}
		},

		async fetchAvtocodeData(
			value: string,
			identifier: AvtocodService.Identifier = AvtocodService.Identifier.VIN
		): Promise<void> {
			try {
				const { $avtocodeApi } = useNuxtApp()

				const avtocodeData = await $avtocodeApi.fetchCarData({
					identifier,
					value
				})

				this.setAvtoCodeData(avtocodeData, "avtocode")
			} catch (e) {
				message.error(
					`Не получилось получить данные авто по ${identifier}: ${value}`
				)
			}
		},

		async setAvtoCodeData(
			response: KascoService.DataByVinResponse | AvtocodService.CarResponse,
			type: "avtocode" | "Insurance" = "Insurance"
		): Promise<void> {
			if (type === "Insurance") {
				const data: KascoService.DataByVin = (
					response as KascoService.DataByVinResponse
				).businessData.vehicle

				this.payment.main.category = data.vehicleCategory
				this.payment.main.enginePower = data.powerHorses
				this.payment.main.modelId = data.model
				this.payment.main.markId = data.mark
			} else {
				const configStore = useConfigStore()
				const { $dayjs } = useNuxtApp()

				const data: AvtocodService.CarInfo = (
					response as AvtocodService.CarResponse
				).carInfo!

				const infoStore = useInfoStore()

				const categoryId = infoStore.getInfoIdByName(
					Info.InfoTypeKasco.CAR_TYPES,
					"dynamic",
					data.category
				)

				const markId = infoStore.getInfoIdByName(
					Info.InfoType.MARKS,
					"dynamic",
					data.mark
				)

				const region: string =
					data?.region?.[0] === "г" ? data.region.slice(2) : data.region || ""

				const regionId = infoStore.getInfoIdByName(
					Info.InfoType.REGIONS,
					"dynamic",
					region!
				)

				await infoStore
					.fetchModels(markId, Calculator.TypeEnum.OSAGO_SPECTECH)
					.catch(() => {})

				const modelId = infoStore.getInfoIdByName(
					Info.InfoType.MODELS,
					"dynamic",
					data.model
				)

				this.payment.main.ptsIssueDate = $dayjs(data.pts.date).format(
					configStore.getFormatDates
				)

				this.payment.main.ptsSeriesNumber = data.pts.number
				this.payment.main.originalName = data.originalName
				this.payment.main.registrationNumber = data.grz
				this.payment.main.issueYear = data.year + ""
				this.payment.main.enginePower = data.power
				this.payment.main.maxMass = data.maxMass
				this.payment.main.chassis = data.chassis
				this.payment.main.category = categoryId
				this.payment.main.modelId = modelId
				this.payment.main.markId = markId
			}
		},

		async issueOsago(): Promise<void> {
			const errorText: string = "Не удалось выпустить проект полиса ОСАГО"

			if (this.getPolicyId) {
				try {
					const { $osagoSpectechApi } = useNuxtApp()

					const response = await $osagoSpectechApi.issuePolicy(this.getPolicyId)

					const number: string = response?.number || response?.Number || ""

					if (response?.isSuccess || response?.IsSuccess) {
						message.success(`Успешный выпуск ОСАГО ${number}`)
					} else {
						message.error(errorText)

						this.displayCalculateErrors({
							errors: response?.errors || response?.Errors,
							isOsago: false,
							isIssue: true
						})

						throw errorText
					}
				} catch (error) {
					message.error(errorText)

					throw error
				}
			} else {
				message.error(
					"Для выпуска проекта полиса ОСАГО необходимо сделать расчет"
				)
			}
		},

		async fetchOsagoPaymentStatus(
			isFirstIteration: boolean = true,
			isFinal: boolean = false
		): Promise<void> {
			if (this.getPolicyId) {
				try {
					const { $osagoSpectechApi } = useNuxtApp()

					const response = await $osagoSpectechApi.fetchPaymentStatus(
						this.getPolicyId
					)

					const state: string = response?.state || response?.State || ""

					const isPaymentPreparation: boolean =
						state === KascoService.InsuranceOsagoPaymentStatus.PAYMENT_PREPARATION

					const isIssueSuccessful: boolean =
						state === KascoService.InsuranceOsagoPaymentStatus.ISSUE_SUCCESSFUL

					const messageKey: string = "osago-payment-status"

					if (isFirstIteration) {
						message.loading({
							content: "ОСАГО Страхование: Ожидание создания платежного шлюза",
							key: messageKey,
							duration: 10000
						})
					}

					if (response?.isSuccess || response?.IsSuccess) {
						if (isFinal && isIssueSuccessful) {
							message.success({
								content: "ОСАГО Страхование: Оплата прошла",
								key: messageKey
							})
						} else if (isPaymentPreparation) {
							message.success({
								content: "ОСАГО Страхование: Платежный шлюз успешно создан",
								key: messageKey
							})
						} else {
							// Sleep 2 sec
							await new Promise((resolve) => {
								setTimeout(resolve, 2 * 1000)
							})

							// Re-fetch status
							await this.fetchOsagoPaymentStatus(false, isFinal)
						}
					} else {
						this.displayCalculateErrors({
							errors: response?.errors || response?.Errors,
							isOsago: false,
							isIssue: true
						})

						throw "ОСАГО Страхование: Ошибка создания платежного шлюза"
					}
				} catch (error) {
					throw error
				}
			} else {
				message.error(
					"Для получения данных оплаты ОСАГО необходимо сделать расчет"
				)
			}
		},

		async sendPolicyDraftOsago(): Promise<void> {
			const calculationId: string = this.payment.osago.Insurance.calculationId

			const errorText: string = "Ошибка отправки черновика полиса ОСАГО"

			if (this.getDealId && calculationId) {
				try {
					const { $osagoSpectechApi } = useNuxtApp()

					const response = await $osagoSpectechApi.sendPolicyDraftOsago(
						this.getDealId
					)

					const data: OsagoSpectechService.Draft | undefined = response?.entity

					if (data) {
						this.paymentDocument.number = data.paymentOrderNumber
						this.paymentDocument.date = data.paymentOrderDate
					}

					if (!(response?.isSuccess || response?.IsSuccess)) {
						message.error(errorText)

						this.displayCalculateErrors({
							errors: response?.errors || response?.Errors,
							isOsago: false,
							isIssue: true
						})

						throw errorText
					}
				} catch (error) {
					message.error(errorText)
					throw error
				}
			} else {
				message.error(
					"Для отправки черновика полиса ОСАГО необходимо сделать расчет"
				)
			}
		},

		async printPolicy(isDraft: boolean = true): Promise<void> {
			const calculationId: string = this.payment.osago.Insurance.calculationId

			const errorText: string = "Ошибка выпуска полиса ОСАГО"

			if (this.getDealId && calculationId) {
				try {
					const { $osagoSpectechApi } = useNuxtApp()

					await $osagoSpectechApi.printPolicy(
						this.getDealId,
						calculationId,
						isDraft
					)
				} catch (error) {
					message.error(errorText)

					this.displayCalculateErrors({
						errors: response?.errors || response?.Errors,
						isOsago: false,
						isIssue: true
					})

					throw error
				}
			} else {
				message.error(
					"Для отправки черновика полиса ОСАГО необходимо сделать расчет"
				)
			}
		},

		async saveDraftFromCrm(): Promise<void> {
			const errorText: string = "Не отправить черновик ОСАГО"

			try {
				const { $osagoSpectechApi } = useNuxtApp()

				const response = await $osagoSpectechApi.saveDraftFromCrm(
					this.getSaveDraftCrmPayload
				)

				if (!(response?.isSuccess || response?.IsSuccess)) {
					message.error(errorText)

					this.displayCalculateErrors({
						errors: response?.errors || response?.Errors,
						isOsago: false,
						isIssue: true
					})
				}
			} catch (error) {
				message.error(errorText)

				throw error
			}
		},

		async printOsagoPolicy(): Promise<void> {
			const calculationId: string = this.payment.osago.Insurance.calculationId

			if (this.getDealId && calculationId) {
				const errorText: string =
					"Ошибка отправки запроса печати проекта полиса ОСАГО"

				try {
					const { $osagoSpectechApi } = useNuxtApp()

					const response = await $osagoSpectechApi.printOsagoPolicy(
						this.getDealId,
						calculationId
					)

					if (!(response?.isSuccess || response?.IsSuccess)) {
						message.error(errorText)

						this.displayCalculateErrors({
							errors: response?.errors || response?.Errors,
							isOsago: false,
							isIssue: true
						})
					}
				} catch (e) {
					message.error(errorText)
				}
			} else {
				message.error("Для печати проекта ОСАГО необходимо сделать расчет")
			}
		},

		async loadPayment(): Promise<void> {
			const calculationId: string = this.payment.osago.Insurance.calculationId

			if (this.getDealId && calculationId) {
				const errorText: string =
					"Ошибка отправки запроса печати проекта полиса ОСАГО"

				try {
					const { $osagoSpectechApi } = useNuxtApp()

					const response = await $osagoSpectechApi.loadPayment(
						this.getLoadPayment
					)

					if (!(response?.isSuccess || response?.IsSuccess)) {
						message.error(errorText)

						this.displayCalculateErrors({
							errors: response?.errors || response?.Errors,
							isOsago: false,
							isIssue: true
						})
					}
				} catch (e) {
					message.error(errorText)
				}
			} else {
				message.error("Для печати проекта ОСАГО необходимо сделать расчет")
			}
		},

		async prepareCloseOsagoDeal(): Promise<void> {
			try {
				await this.issueOsago()
				await this.fetchOsagoPaymentStatus()

				await this.printPolicy()
				await this.sendPolicyDraftOsago()

				this.canCloseOsago = true
			} catch (error) {
				throw error
			}
		},

		async closeOsagoDeal(): Promise<void> {
			try {
				await this.loadPayment()

				await this.fetchOsagoPaymentStatus(false, true)

				await this.printPolicy(false)

				await this.closeDealOsago()
			} catch (error: any) {
				throw error
			}
		},

		async closeInsurances(): Promise<void> {
			this.isLoading = true

			if (this.getIsSelectedOsago) {
				try {
					await this.prepareCloseOsagoDeal()
				} catch (error) {}
			} else {
				message.error("Сделайте расчет и выбирете вариант страхования")
			}

			this.isLoading = false
		},

		async closeDealOsago(): Promise<void> {
			if (this.getIsVerify || this.canCloseOsago) {
				this.isLoadingClose = true

				try {
					const { $osagoSpectechApi } = useNuxtApp()

					const response = await $osagoSpectechApi.closeOsago(this.getDealId)

					if (response?.IsSuccess || response?.isSuccess) {
						message.success("Сделка ОСАГО успешно оформлена")

						this.deal.status = DealService.Status.SENDED
					}
				} catch (error) {
					message.error("Не удалось оформить сделку ОСАГО")
				} finally {
					this.isLoadingClose = false
				}
			} else {
				message.info("Сделайте проверку по 115ФЗ")
			}
		},

		setDealAdditional(deal: OsagoSpectechService.Deal): void {
			this.setDealAdditionalSignatory(deal)
			this.setDealAdditionalPayment(deal)
			this.setDealAdditionalRegistration(deal)

			this.canCloseOsago = deal.draftSended
		},

		setDealAdditionalSignatory(deal: OsagoSpectechService.Deal): void {
			type SigningInfo = KascoService.Deal["signingPersonInfo"]
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

		setDealAdditionalPayment(deal: OsagoSpectechService.Deal): void {
			this.setDealAdditionalCar(deal.car)
			this.setDealPaymentDocument(deal)
			this.payment.crm.id = deal.crmId
			this.setDealOwner(deal)

			this.setDealOsago(deal)
		},

		setDealAdditionalCar(car: OsagoSpectechService.Car): void {
			const infoStore = useInfoStore()

			if (car.document.issueDate) {
				this.payment.main.documentIssueDate = car.document.issueDate
			}

			this.payment.main.documentType = car.document.type || 0
			this.payment.main.documentSeries = car.document.series
			this.payment.main.documentNumber = car.document.number
			this.payment.main.enginePower = car.enginePower + ""
			this.payment.main.registrationNumber = car.regSign
			this.payment.main.customModel = car.customModel
			this.payment.main.subCategory = car.subcategory
			this.payment.main.customMark = car.customMark
			this.payment.main.chassis = car.chassisNumber
			this.payment.main.issueYear = car.year + ""
			this.payment.main.isCustom = car.customCar
			this.payment.main.modelId = car.carModelId
			this.payment.main.category = car.category
			this.payment.main.markId = car.carMarkId
			this.payment.main.maxMass = car.maxMass
			this.payment.main.vin = car.vin

			infoStore
				.fetchModels(car.carMarkId, Calculator.TypeEnum.OSAGO_SPECTECH)
				.catch(() => {})
		},

		setDealOwner(deal: OsagoSpectechService.Deal): void {
			this.payment.owner.opfid = deal.InsurancePolicyInfo.opfId || 0

			this.payment.owner.isDifferent = !deal?.ownerIsInsurant || false

			const juridicalSubject: OsagoSpectechService.JuridicalSubject | any =
				deal?.vehicleOwner?.juridicalSubject

			if (juridicalSubject) {
				if (juridicalSubject.factAddress) {
					this.payment.owner.address = juridicalSubject.factAddress
				}

				this.payment.owner.documentNumber = juridicalSubject.document.number
				this.payment.owner.documentType = juridicalSubject.document.type
				this.payment.owner.shortCompanyName = juridicalSubject.shortName
				this.payment.owner.companyName = juridicalSubject.fullName
				this.payment.owner.companyType = Info.CompanyType.COMPANY
				this.payment.owner.opfId = juridicalSubject.opfId
				this.payment.owner.inn = juridicalSubject.inn
				this.payment.owner.opf = juridicalSubject.opf

				if (juridicalSubject.document.issueDate) {
					const configStore = useConfigStore()
					const { $dayjs } = useNuxtApp()

					const issueDate: string = $dayjs(
						juridicalSubject.document.issueDate,
						configStore.getFormatDatesInsurance
					).format(configStore.getFormatDates)

					this.payment.owner.documentIssueDate = issueDate
				}
			}
		},

		setDealPaymentDocument(deal: OsagoSpectechService.Deal): void {
			this.paymentDocument.number = deal.paymentOrderNumber
			this.paymentDocument.date = deal.draftSendDate
		},

		setDealOsago(deal: OsagoSpectechService.Deal): void {
			const configStore = useConfigStore()

			const osagoDocument: OsagoSpectechService.SubjectDocument =
				deal.vehicleOwner.juridicalSubject.document

			if (osagoDocument) {
				if (osagoDocument.issueDate) {
					const { $dayjs } = useNuxtApp()

					this.payment.osago.insurerDocumentDate = $dayjs(
						osagoDocument.issueDate,
						configStore.getFormatDatesInsurance
					).format(configStore.getFormatDates)
				}

				this.payment.osago.insurerDocumentNumber = osagoDocument.number
				this.payment.osago.insurerDocument = osagoDocument.type
			}

			this.payment.osago.startedAt = deal.InsurancePolicyInfo.startDate
			this.payment.osago.finishedAt = deal.InsurancePolicyInfo.endDate
			this.payment.owner.opfId = deal.InsurancePolicyInfo.opfId || 0
			this.insurer.main.opfId = deal.InsurancePolicyInfo.opfId || 0
			this.insurer.main.opf = deal.InsurancePolicyInfo.opfName
			this.insurer.main.opf = deal.InsurancePolicyInfo.opfName
			this.payment.osago.isTrailer = deal.car.trailer
			this.payment.osago.usage = deal.car.usage

			// SBS
			this.payment.osago.Insurance.cv = this.payment.main.cv = deal.InsurancePolicyInfo.kv
			this.payment.osago.Insurance.calculationId = deal.InsurancePolicyInfo.calculationId
			this.payment.osago.Insurance.policyId = deal.InsurancePolicyInfo.policyId
			this.payment.osago.startedAt = deal.InsurancePolicyInfo.startDate
			this.payment.osago.Insurance.insurancePremium = this.price =
				deal.car.insurancePremium
		},

		setDealAdditionalRegistration(deal: OsagoSpectechService.Deal): void {
			this.registration.contract.personnelNumber =
				deal.companyRequisites.tnKm || "нет КМ"
			this.registration.bank.postAddress =
				deal.companyRequisites.postAddress || ""
			this.registration.contract.fullName = deal.companyRequisites.fioKm || ""
			this.registration.contract.clientTypeBank = deal.clientTypeBank
			this.registration.contract.clientType = deal.clientType
			this.registration.contract.terBank = deal.terBank
			this.registration.contract.numberVsp = deal.vsp
			this.registration.contract.gosb = deal.gosb

			this.registration.placement.region = deal.region
			this.registration.placement.city = deal.city

			this.registration.bank.wallet = deal.companyRequisites?.bankAccount || ""
			this.registration.bank.bankName = deal.companyRequisites?.bankInfo || ""
			this.registration.bank.bik = deal.companyRequisites?.bik || ""
			this.registration.bank.kpp = deal.companyRequisites?.kpp || ""
			this.registration.bank.email = deal.dealContact!.email
			this.registration.bank.phone = deal.dealContact!.phone
			this.registration.bank.corWallet =
				deal.companyRequisites?.correspondentAccount || ""

			this.setDealParentFields(deal)
		},

		setDealParentFields(deal: KascoService.Deal): void {
			this.registration.parent[Fields.Parent.CRM_PARENT_ID] = deal.crmParentId
			this.registration.parent[Fields.Parent.CRM_LEAD_ID] = deal.crmLeadId
		},

		async setOwnerOpfByCompany(
			company: VerificationService.Company
		): Promise<void> {
			const data: VerificationService.SuggestionData =
				company.companyInfo?.suggestions?.[0]?.data

			const addressData: VerificationService.SuggestionDataAddresses["data"] =
				data?.address?.data

			const opf: VerificationService.SuggestionData["opf"] = data?.opf

			this.payment.owner.opfCode = opf?.code || ""
			this.payment.owner.opf = opf?.full || ""

			this.payment.owner.shortCompanyName = data?.name?.short_with_opf || ""
			this.payment.owner.companyName = data?.name?.full_with_opf || ""

			this.payment.owner.address.localityCodeKladr = addressData?.kladr_id || ""
			this.payment.owner.address.district = addressData?.city_district || ""
			this.payment.owner.address.locality = addressData?.settlement || ""
			this.payment.owner.address.country = addressData?.country || ""
			this.payment.owner.address.region = addressData?.region || ""
			this.payment.owner.address.street = addressData?.street || ""
			this.payment.owner.address.building = addressData?.area || ""
			this.payment.owner.address.house = addressData?.house || ""

			if (data.address.value) {
				this.payment.owner.address.address = data.address.value

				this.payment.owner.address.fiasId =
					(await this.fetchFias(data.address.value).catch(() => {})) || ""
			} else {
				this.payment.owner.address.fiasId = addressData?.fias_id || ""
			}
		},

		setInsuranceOwnerOpf(opf: KascoService.Opf): void {
			this.payment.owner.opfid = opf.id
			this.payment.owner.opfName = opf.opfName
			this.payment.owner.InsuranceCode = opf.InsuranceCode
			this.payment.owner.InsuranceName = opf.InsuranceName
		},

		displayCalculateErrors({
			errors,
			isIssue = false,
			company = KascoService.InsuranceCompanyName.SBS
		}: {
			errors: KascoService.InsuranceError[] | undefined | null
			isOsago: boolean
			isIssue: boolean
			company: KascoService.InsuranceCompanyName
		}) {
			if (errors?.length) {
				errors.forEach((error) => {
					if (error.message)
						message.error(
							`Ошибка ${isIssue ? "выпуска" : "расчета"} ${company}: ${
								error.message
							}`,
							10
						)
				})
			}
		},

		async calculateOsago(): Promise<void> {
			const { $osagoSpectechApi } = useNuxtApp()

			await this.fetchFias()
			await this.fetchInsuranceOpf()

			this.isLoading = true

			try {
				const response = await $osagoSpectechApi.calculateDeal(
					this.getCalculateOsagoPayload
				)

				const data: OsagoSpectechService.InsuranceResponse = response?.data
					? response.data
					: response

				if ((data?.isSuccess || data?.IsSuccess) && data?.insPremTotal) {
					this.payment.osago.Insurance.insurancePremium = this.price =
						data?.insPremTotal || ""

					this.payment.osago.Insurance.calculationId = data?.calcId || ""
					this.payment.osago.Insurance.policyId = data?.policyId || ""

					await this.saveDeal({ isSaveCalculation: true })

					message.success(`Успешный расчет ОСАГО: ${data?.insPremTotal}`)
				} else if (data?.errors?.length || data?.Errors?.length) {
					this.displayCalculateErrors({
						errors: data?.errors || data?.Errors
					})
				}
			} catch (response: OsagoSpectechService.InsuranceResponse | any) {
				if (response?.errors?.length) {
					this.displayCalculateErrors({
						errors: response.errors || response.Errors
					})
				}
			} finally {
				this.isLoading = false
			}
		},

		resetSelectInsurances(value: boolean = false): void {
			this.payment.osago.Insurance.isSelected = value
		},

		resetInsurancePremium(
			insuranceCompany: KascoService.InsuranceCompanyName,
			insuranceType: KascoService.InsuranceType
		): void {
			this.payment[insuranceType][insuranceCompany].insurancePremium = ""
			this.payment[insuranceType][insuranceCompany].isSelected = false
			this.payment[insuranceType][insuranceCompany].calculationId = ""
			this.payment[insuranceType][insuranceCompany].policyId = ""
		},

		resetInsurancesIfExist({ isKasco = true, isOsago = true }): void {
			let isExistOsago: boolean = false

			const resetFabric = (
				type: KascoService.InsuranceType,
				company: KascoService.InsuranceCompany
			) => {
				if (
					this.payment[type][company].insurancePremium &&
					type === KascoService.InsuranceType.OSAGO
				) {
					switch (type) {
						case KascoService.InsuranceType.OSAGO:
							break
					}

					this.payment[type][company] = { ...baseInsurance }
				}
			}

			if (isOsago) {
				resetFabric(
					KascoService.InsuranceType.OSAGO,
					KascoService.InsuranceCompany.SBS
				)
			}

			const message: string = "Сброс расчета"

			if (isExistOsago && isOsago) {
				notification.warning({
					message,
					description:
						"Вы изменили данные полей ОСАГО. Расчет по продуктам ОСАГО был сброшен"
				})
			} else if (isExistOsago && isKasco && isOsago) {
				notification.warning({
					message,
					description:
						"Вы изменили данные полей страхования. Все расчеты были сброшены"
				})
			}
		},

		copyDealAdditional(): void {
			this.payment.osago.Insurance = { ...baseInsurance }
			this.paymentDocument.number = ""
			this.paymentDocument.date = ""
			this.canCloseOsago = false
			this.payment.crm.id = 0
		}
	},

	getters: {
		...baseCalculator.getGetters(),

		// @override
		getCalculatePayload(): boolean {
			return this.getCalculateOsagoPayload
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
						series,
						dob
					}: StatePassport) => {
						return !!(
							(isForeign || passportOffice) &&
							dateOfIssue &&
							fullName &&
							series &&
							dob
						)
					}
				)
			} else {
				passportsChecks = this.insurer.passports.map(
					({ fullName, dob }: StatePassport) => {
						return !!(fullName && dob)
					}
				)
			}

			return !!(
				!passportsChecks.includes(false) &&
				(this.insurer.main.companyInn as string)
			)
		},

		// @override
		getCanCloseSignatory(): boolean {
			return !!(
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
							isPassportOffice &&
							passport.dob
						)
					} else {
						return !!(passport.fullName && passport.dob)
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

		getCrmId(): number {
			return this.payment?.crm?.id || 0
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
				this.registration.bank.corWallet &&
				this.registration.bank.bankName &&
				this.registration.contract.gosb &&
				this.registration.bank.wallet &&
				this.registration.bank.email &&
				this.registration.bank.bik &&
				this.registration.bank.phone
			)
		},

		getCanClosePayment(): boolean {
			const isCustom: boolean = !!(
				!this.payment.main.isCustom ||
				(this.payment.main.customMark as string) ||
				(this.payment.main.customModel as string)
			)

			const isOwner: boolean = !!(
				!this.payment.main.isDifferent ||
				(this.payment.main.companyType as number) ||
				(this.payment.main.documentIssueDate as string) ||
				(this.payment.main.documentNumber as string) ||
				(this.payment.main.documentType as string) ||
				(this.payment.main.companyName as string) ||
				(this.payment.main.inn as string)
			)

			return !!(
				this.payment.main.documentIssueDate &&
				this.payment.main.documentNumber &&
				this.payment.main.documentType &&
				this.payment.main.subCategory &&
				this.payment.main.issueYear &&
				this.payment.main.modelId &&
				this.payment.main.maxMass &&
				this.payment.main.markId &&
				isCustom &&
				isOwner
			)
		},

		getIsPreApprovement(): boolean {
			return this.preApprovement.isPreapproved
		},

		getPreApprovementGrade(): string {
			return this.preApprovement.crmLeadGrade
		},

		getInsuranceData() {
			return (payload: InsuranceParams) => {
				const value: string | number | undefined =
					this.$state.payment?.[payload.type]?.[payload.company]?.[payload.key]

				if (typeof value !== "undefined") {
					return value
				} else {
					return ""
				}
			}
		},

		getCommonUnAvailableList(): string[] {
			const list: string[] = []

			!this.registration.bank.email && list.push("Email страхователя")
			!this.registration.bank.phone && list.push("Телефон страхователя")

			!this.payment.main.documentIssueDate &&
				list.push("Дата регистрации документа спецтехники")
			!this.payment.main.documentNumber &&
				list.push("Номер документа спецтехники")
			!this.payment.main.documentType && list.push("Тип документа спецтехники")
			!this.payment.main.issueYear && list.push("Год выпуска ТС")
			!this.payment.main.category && list.push("Категория ТС")
			!this.payment.main.subCategory && list.push("Подкатегория ТС")
			!this.insurer.passports[0].dob &&
				list.push("Заполните дату рождения Ген. директора")

			return list
		},

		getOsagoUnAvailableList(): string[] {
			const list: string[] = [...this.getCommonUnAvailableList]

			if (this.insurer.main.companyType === Info.CompanyType.COMPANY) {
				!this.payment.osago.insurerDocumentNumber &&
					list.push("Номер документа страхователя")

				!this.payment.osago.insurerDocumentDate &&
					list.push("Дата выдачи документа Страхователя")

				!this.payment.osago.insurerDocument &&
					list.push("Документ Страхователя")
			} else {
				!this.payment.osago.usage && list.push("Цель использования ТС")
			}

			return list
		},

		getSubjectType(): KascoService.SubjectType {
			switch (this.insurer.main.companyType) {
				case Info.CompanyType.COMPANY:
					return KascoService.SubjectType.COMPANY
				case Info.CompanyType.IP:
					return KascoService.SubjectType.IP
				default:
					return KascoService.SubjectType.DEFAULT
			}
		},

		getPassCount(): number {
			return this.payment.main.category === 4 ? this.payment.main.passCount : 5
		},

		getCarDocument(): OsagoSpectechService.CarDocument {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			const issueDate: string = this.payment.main.documentIssueDate
				? $dayjs(
						this.payment.main.documentIssueDate,
						configStore.getFormatDates
				  ).format(configStore.getFormatDatesInsurance)
				: ""

			return {
				type: this.payment.main.documentType || 0,
				number: this.payment.main.documentNumber,
				series: this.payment.main.documentSeries,
				issueDate
			}
		},

		getCar(): OsagoSpectechService.Car {
			return {
				regSign: this.payment.main.registrationNumber.replace(/\s/g, ""),
				insurancePremium: +this.payment.osago.Insurance.insurancePremium,
				maxMass: this.payment.main.maxMass + "" || "0",
				enginePower: +this.payment.main.enginePower,
				customModel: this.payment.main.customModel,
				subcategory: this.payment.main.subCategory,
				customMark: this.payment.main.customMark,
				chassisNumber: this.payment.main.chassis,
				bodyNumber: this.payment.main.bodyNumber,
				carModelId: +this.payment.main.modelId,
				customCar: this.payment.main.isCustom,
				trailer: this.payment.osago.isTrailer,
				carMarkId: +this.payment.main.markId,
				year: +this.payment.main.issueYear,
				usage: this.payment.osago.usage,
				document: this.getCarDocument,
				vin: this.payment.main.vin,
				isRightHand: false,
				category: 1
			}
		},

		getCarInfo(): OsagoSpectechService.CarInfo {
			const infoStore = useInfoStore()

			const car: OsagoSpectechService.Car = this.getCar

			const usage: string =
				infoStore.getItemById({
					type: "static",
					name: Info.InfoTypeStatic.USAGE_VEHICLE,
					id: car.usage
				}).name || ""

			const model: string =
				infoStore.getItemById({
					type: "dynamic",
					name: Info.InfoType.MODELS,
					id: car.carModelId
				}).name || ""

			const mark: string =
				infoStore.getItemById({
					type: "dynamic",
					name: Info.InfoType.MARKS,
					id: car.carMarkId
				}).name || ""

			return {
				documentInfo: this.getCarDocument,
				chassisNumber: car.chassisNumber,
				customModel: car.customModel,
				subcategory: car.subcategory,
				bodyNumber: car.bodyNumber,
				customMark: car.customMark,
				manufactureYear: car.year,
				category: car.category,
				power: car.enginePower,
				regNumber: car.regSign,
				trailer: car.trailer,
				vin: car.vin,
				usage,
				model,
				mark
			}
		},

		getIsSelectedKasco(): boolean {
			return false
		},

		getIsSelectedOsago(): boolean {
			return this.payment.osago.Insurance.isSelected
		},

		getCalculatePayloadVsk(): null {
			return null
		},

		getCalculateFactAddress(): OsagoSpectechService.FactAddress {
			const insurerAddress = {
				fiasId: "",
				district: "",
				building: "",
				localityCodeKladr: "",
				...this.insurer.companyAddress
			}

			const {
				house = "",
				region = "",
				street = "",
				country = "",
				fiasId = "",
				fias_id = "",
				district = "",
				building = "",
				localityCodeKladr = ""
			} = this.payment.owner.isDifferent
				? this.payment.owner.address
				: insurerAddress

			return {
				localityCodeKladr,
				locality: street,
				fiasId: fias_id || fiasId,
				district,
				building,
				country,
				region,
				street,
				house
			}
		},

		getCalculateFactAddressInsurant(): OsagoSpectechService.FactAddress {
			const insurerAddress = {
				fiasId: "",
				district: "",
				building: "",
				localityCodeKladr: "",
				...this.insurer.companyAddress
			}

			const {
				house = "",
				region = "",
				street = "",
				country = "",
				fiasId = "",
				fias_id = "",
				district = "",
				building = "",
				localityCodeKladr = ""
			} = insurerAddress

			return {
				localityCodeKladr,
				locality: street,
				fiasId: fias_id || fiasId,
				district,
				building,
				country,
				region,
				street,
				house
			}
		},

		generateDateInsurance(): (date: string) => string {
			const { getFormatDates, getFormatDatesInsurance } = useConfigStore()

			return (date) => {
				const { $dayjs } = useNuxtApp()

				return date
					? $dayjs(date, getFormatDates).format(getFormatDatesInsurance)
					: ""
			}
		},

		getCalculationCar(): KascoService.OsagoPayloadCar {
			const infoStore = useInfoStore()

			const category = infoStore.getNameById({
				name: Info.InfoTypeKasco.CAR_TYPES,
				type: "dynamic",
				id: this.payment.main.category
			})

			const mark = infoStore.getNameById({
				name: Info.InfoType.MARKS,
				type: "dynamic",
				id: this.payment.main.markId
			})

			const model = infoStore.getNameById({
				name: Info.InfoType.MODELS,
				type: "dynamic",
				id: this.payment.main.modelId
			})

			const region = ""

			const usage = infoStore.getNameById({
				name: Info.InfoTypeStatic.USAGE_VEHICLE,
				type: "static",
				id: this.payment.osago.usage
			})

			const issueDate: string = this.generateDateInsurance(
				this.payment.main.ptsIssueDate
			)

			return {
				actualPrice: 0,
				bankBik: this.registration.bank.bik,
				category,
				document: {
					issueDate,
					number: this.payment.main.ptsSeriesNumber.replace(/\s/g, "")
				},
				pledgeDocument: {
					creditDocumentNumber: "",
					pledgeDocumentNumber: "",
					creditDocumentDate: "",
					pledgeDocumentDate: ""
				},
				customMark: this.payment.main.customMark,
				customModel: this.payment.main.customModel,
				manufactureYear: +this.payment.main.issueYear,
				mark,
				markModelId: this.payment.main.modelId,
				maxMass: +this.payment.main.maxMass,
				mileage: 0,
				model,
				new: false,
				numberOfSeats: 5,
				plege: false,
				power: this.payment.main.enginePower,
				regNumber: this.payment.main.registrationNumber.replace(/\s/g, ""),
				region,
				securitySystem: this.payment.owner.opfName,
				trailer: this.payment.osago.isTrailer,
				usage,
				vin: this.payment.main.vin
			}
		},

		getJuridicalSubjectEmpty(): OsagoSpectechService.JuridicalSubject {
			return {
				fullName: "",
				shortName: "",
				inn: "",
				opf: "Общества с ограниченной ответственностью",
				citizenship: "Россия",
				phone: "",
				email: "",
				kpp: "",
				ogrn: "",
				document: {
					type: "",
					number: "",
					issueCountry: "Россия",
					issuePlace: "",
					series: "",
					issueDate: ""
				},
				address: {
					useAddressFull: false,
					federalDistrict: "",
					addressFull: "",
					cityKladr: "",
					cityPlace: "",
					building: "",
					country: "",
					region: "",
					street: "",
					office: "",
					house: "",
					kladr: "",
					flat: "",
					area: ""
				}
			}
		},

		getJuridicalSubject(): OsagoSpectechService.JuridicalSubject {
			const insurerDocumentDate = this.generateDateInsurance(
				this.payment.osago.insurerDocumentDate
			)

			if (this.payment.owner.isDifferent) {
				const issueDate: string = this.generateDateInsurance(
					this.payment.owner.documentIssueDate
				)

				return {
					fullName: this.payment.owner.companyName,
					// Todo: temporary hide
					// shortName: this.payment.owner.shortCompanyName,
					// citizenship: citizenship || "Россия",
					// phone: this.registration.bank.phone,
					// email: this.registration.bank.email,
					email: this.registration.bank.email,
					kpp: this.registration.bank.kpp,
					ogrn: this.insurer.main.ogrn,
					inn: this.payment.owner.inn,
					opf: this.payment.owner.opf,
					document: {
						type: this.payment.owner.documentType + "",
						number: this.payment?.owner?.documentNumber || "",
						issueCountry: "Россия",
						issuePlace: "",
						series: "",
						issueDate
					},
					address: this.payment.owner.address
				}
			}

			return {
				fullName: this.insurer.main.companyName,
				inn: this.insurer.main.companyInn,
				kpp: this.registration.bank.kpp,
				ogrn: this.insurer.main.ogrn,
				opf: this.insurer.main.opf,
				// Todo: temporary hide
				// shortName: this.insurer.main.companyShortName,
				// citizenship: citizenship || "Россия",
				// phone: this.registration.bank.phone,
				// email: this.registration.bank.email,
				document: {
					number: this.payment?.osago?.insurerDocumentNumber || "",
					type: this.payment.osago.insurerDocument + "",
					issueDate: insurerDocumentDate,
					issueCountry: "Россия",
					issuePlace: "",
					series: ""
				},
				address: this.getCalculateFactAddress
			}
		},

		getPhysicalSubject(): OsagoSpectechService.PhysicalPerson {
			const {
				passportOffice = "",
				placeOfBirth = "",
				citizenship = "",
				dateOfIssue = "",
				personInn = "",
				fullName = "",
				series = "",
				dob = ""
			} = this.insurer.passports?.[0]

			const passportIssueDate = this.generateDateInsurance(dateOfIssue)
			const birthDate = this.generateDateInsurance(dob)

			const nameArray: string[] = fullName ? fullName.split(" ") : []

			const [lastName, firstName, middleName] =
				nameArray.length >= 3 ? nameArray : ["", "", ""]

			return {
				address: this.getCalculateFactAddress,
				citizenship: citizenship || "Россия",
				email: this.registration.bank.email,
				ogrn: this.insurer.main.ogrn,
				inn: personInn || "",
				middleName,
				firstName,
				birthDate,
				lastName,
				document: {
					type: "",
					series: series,
					number: "",
					issueDate: passportIssueDate,
					issuePlace: passportOffice,
					issueCountry: "Россия"
				}
			}
		},

		getInsurant(): OsagoSpectechService.CalculatePayload["insurant"] {
			const { citizenship = "" } = this.insurer.passports?.[0]

			const juridicalSubject: OsagoSpectechService.JuridicalSubjectCalculate = {
				kpp: this.registration.bank.kpp,
				citizenship: citizenship || "Россия",
				phone: this.registration.bank.phone,
				email: this.registration.bank.email,
				factAddress: this.getCalculateFactAddressInsurant,

				opf: this.insurer.main.opf,
				ogrn: this.insurer.main.ogrn,
				inn: this.insurer.main.companyInn,
				fullName: this.insurer.main.companyName,
				shortName: this.insurer.main.companyShortName,

				document: {
					series: "",
					issuePlace: "",
					issueCountry: "Россия",
					issueDate: this.generateDateInsurance(
						this.payment.osago.insurerDocumentDate
					),
					number: this.payment.osago.insurerDocumentNumber,
					type:
						(this.payment.osago.insurerDocument && insurerDocumentOption) + ""
				}
			}

			return {
				physicalPerson: this.getCalculatePhysicalSubject,
				subjectType: this.getSubjectType,
				juridicalSubject
			}
		},

		getCalculatePhysicalSubject(): OsagoSpectechService.Subject {
			const physicalSubject: any = _cloneDeep(this.getPhysicalSubject)

			const factAddress: OsagoSpectechService.Address = {
				...physicalSubject.address
			}

			delete physicalSubject.address
			delete physicalSubject.ogrn

			return {
				email: this.registration.bank.email,
				phone: this.registration.bank.phone,
				...physicalSubject,
				factAddress
			}
		},

		getCalculatePayloadInsurance(): (
			type: KascoService.InsuranceType
		) => KascoService.OsagoPayload {
			return (type = KascoService.InsuranceType.OSAGO) => {
				const { $dayjs } = useNuxtApp()

				const startDate = this.generateDateInsurance(this.payment[type].startedAt)
				const endDate = this.generateDateInsurance(this.payment[type].finishedAt)

				return {
					ownerIsInsurant: !this.payment.owner.isDifferent,
					calcId: this.payment.osago.Insurance.calculationId,
					policyId: this.payment.osago.Insurance.policyId,
					policyDate: $dayjs().toISOString(),
					car: this.getCalculationCar,
					startDate,
					endDate,
					insurant: {
						juridicalSubject: this.getJuridicalSubject,
						physicalSubject: this.getPhysicalSubject,
						preapproved: this.getIsPreApprovement,
						subjectType: this.getSubjectType
					},
					owner: {
						juridicalSubject: this.getJuridicalSubject,
						physicalSubject: this.getPhysicalSubject,
						preapproved: this.getIsPreApprovement,
						subjectType: KascoService.SubjectType.FL
					}
				}
			}
		},

		getInsurancePolicyInfo(): OsagoSpectechService.InsurancePolicyInfo {
			return {
				policyId: this.payment.osago.Insurance.policyId,
				opfName: this.insurer.main.opf,
				calculationId: this.payment.osago.Insurance.calculationId,
				policyNumber: "",
				documentTypeId: 0,
				documentTypeValue: "",
				documentTypeDate: "",
				opfId: this.payment.owner.isDifferent
					? +this.payment.owner.opfId || 0
					: +this.insurer.main.opfId || 0,
				kv: 10,
				startDate: this.payment.osago.startedAt,
				endDate: this.payment.osago.finishedAt
			}
		},

		getCalculateOsagoPayload(): OsagoSpectechService.CalculatePayload {
			const { $dayjs } = useNuxtApp()

			const { citizenship = "" } = this.insurer.passports?.[0]

			const issueDate =
				this.payment.owner.isDifferent && this.payment.owner.documentIssueDate
					? this.generateDateInsurance(this.payment.owner.documentIssueDate)
					: this.generateDateInsurance(this.payment.osago.insurerDocumentDate)

			const startDate = this.generateDateInsurance(this.payment.osago.startedAt)
			const endDate = this.generateDateInsurance(this.payment.osago.finishedAt)

			const juridicalSubjectData = this.payment.owner.isDifferent
				? {
						fullName: this.payment.owner.companyName,
						shortName: this.payment.owner.shortCompanyName,
						inn: this.payment.owner.inn,
						opf: this.payment.owner.opfName
				  }
				: {
						fullName: this.insurer.main.companyName,
						shortName: this.insurer.main.companyShortName,
						inn: this.insurer.main.companyInn,
						opf: this.insurer.main.opf
				  }

			const juridicalSubject: OsagoSpectechService.JuridicalSubjectCalculate = {
				factAddress: this.getCalculateFactAddress,
				citizenship: citizenship || "Россия",
				phone: this.registration.bank.phone,
				email: this.registration.bank.email,
				kpp: this.registration.bank.kpp,
				ogrn: this.insurer.main.ogrn,
				...juridicalSubjectData,
				document: {
					type:
						((this.payment.owner.isDifferent
							? this.payment.owner.documentType
							: this.payment.osago.insurerDocument) && insurerDocumentOption) +
						"",
					number: this.payment.owner.isDifferent
						? this.payment.owner.documentNumber
						: this.payment.osago.insurerDocumentNumber,
					issueCountry: "Россия",
					issuePlace: "",
					series: "",
					issueDate
				}
			}

			return {
				endDate,
				startDate,
				policyDate: $dayjs().toISOString(),
				carInfo: this.getCarInfo,
				ownerIsInsurant: !this.payment.owner.isDifferent,
				insurant: this.getInsurant,
				owner: {
					juridicalSubject: this.payment.owner.isDifferent
						? juridicalSubject
						: this.getJuridicalSubjectEmpty,
					physicalPerson: this.getCalculatePhysicalSubject,
					subjectType: KascoService.SubjectType.COMPANY
				}
			}
		},

		getCalculateOsagoInsurance(): KascoService.OsagoPayload {
			const { $dayjs } = useNuxtApp()

			const { citizenship = "" } = this.insurer.passports?.[0]

			const issueDate =
				this.payment.owner.isDifferent && this.payment.owner.documentIssueDate
					? this.generateDateInsurance(this.payment.owner.documentIssueDate)
					: this.generateDateInsurance(this.payment.osago.insurerDocumentDate)

			const startDate = this.generateDateInsurance(this.payment.osago.startedAt)
			const endDate = this.generateDateInsurance(this.payment.osago.finishedAt)

			const juridicalSubjectData = this.payment.owner.isDifferent
				? {
						fullName: this.payment.owner.companyName,
						shortName: this.payment.owner.shortCompanyName,
						inn: this.payment.owner.inn,
						opf: this.payment.owner.opf
				  }
				: {
						fullName: this.insurer.main.companyName,
						shortName: this.insurer.main.companyShortName,
						inn: this.insurer.main.companyInn,
						opf: this.insurer.main.opf
				  }

			const juridicalSubject = {
				...juridicalSubjectData,
				citizenship: citizenship || "Россия",
				phone: this.registration.bank.phone,
				email: this.registration.bank.email,
				kpp: this.registration.bank.kpp,
				ogrn: this.insurer.main.ogrn,
				document: {
					type:
						(this.payment.owner.isDifferent
							? this.payment.owner.documentType
							: this.payment.osago.insurerDocument && insurerDocumentOption) +
						"",
					number: this.payment.owner.isDifferent
						? this.payment.owner.documentNumber
						: this.payment.osago.insurerDocumentNumber,
					issueCountry: "Россия",
					issuePlace: "",
					series: "",
					issueDate
				},
				factAddress: this.getCalculateFactAddress
			}

			return {
				ownerIsInsurant: !this.payment.owner.isDifferent,
				calcId: this.payment.osago.Insurance.calculationId,
				policyId: this.payment.osago.Insurance.policyId,
				policyDate: $dayjs().toISOString(),
				car: this.getCalculationCar,
				startDate,
				endDate,
				// @ts-ignore
				insurant: {
					juridicalSubject,
					physicalSubject: this.getPhysicalSubject,
					subjectType: this.getSubjectType
				},
				// @ts-ignore
				owner: {
					juridicalSubject: this.payment.owner.isDifferent
						? juridicalSubject
						: this.getJuridicalSubjectEmpty,
					subjectType: KascoService.SubjectType.FL
				}
			}
		},

		getInsurancePaymentPlan(): KascoService.InsurancePaymentPlan[] {
			return []
		},

		getInsuranceCompany(): KascoService.InsuranceCompanyValue {
			const isSelectedSvs: boolean = this.payment.osago.Insurance.isSelected

			if (isSelectedSvs) {
				return KascoService.InsuranceCompanyValue.SBS
			} else {
				return KascoService.InsuranceCompanyValue.NOT_SELECTED
			}
		},

		getOriginalName(): string {
			return this.payment.main.originalName
		},

		getDealCompanyRequisites(): OsagoSpectechService.CompanyRequisites {
			const data:
				| OsagoSpectechService.CompanyRequisites
				| DealService.CompanyRequisites
				| any = this.getCompanyRequisites

			data.tnKm = this.registration.contract.personnelNumber || "нет КМ"
			data.postAddress = this.registration.bank.postAddress || ""
			data.fioKm = this.registration.contract.fullName || ""

			delete (data as DealService.CompanyRequisites).okonx
			delete (data as DealService.CompanyRequisites).opf

			data.legalAddress.area = ""

			return data as OsagoSpectechService.CompanyRequisites
		},

		getDealSigningPersonInfo(): DealService.SigningPersonInfo {
			const data: DealService.SigningPersonInfo | any =
				this.getSigningPersonInfo

			data.passport.validityPeriodEnd =
				this.insurer?.passports?.[0]?.validTo || ""

			data.legalAddress.area = ""

			return data
		},

		getDealPersonInfoList(): OsagoSpectechService.PersonInfo[] {
			return this.getPersonInfoList.map(
				(person: OsagoSpectechService.PersonInfo | any) => {
					const address = person.legalAddress

					delete person.legalAddress
					delete person.id

					person.address = address

					person.address.area = ""

					if (!person.passport?.validityPeriodEnd) {
						person.passport.validityPeriodEnd = ""
					}

					return person
				}
			)
		},

		getSaveDraftCrmPayload(): OsagoSpectechService.SaveDraftCrmPayload {
			return {
				insuranceTypeCode: "",
				crmParentId: this.registration.parent[Fields.Parent.CRM_PARENT_ID] || 0,
				clientType: this.registration.contract.clientType,
				crmLeadId: this.registration.parent[Fields.Parent.CRM_LEAD_ID] || 0,
				token: "",
				owner: this.deal!.responsibleEmail,
				inn: this.payment.owner.isDifferent
					? this.payment.owner.inn
					: this.insurer.main.companyInn,
				crmId: this.getCrmId
			}
		},

		getPolicyId(): number {
			return this.payment.osago.Insurance.policyId
		},

		getLoadPayment(): OsagoSpectechService.LoadPaymentPayload {
			return {
				paymentDocument: this.getPaymentDocument,
				policyId: this.getPolicyId
			}
		},

		// @override
		getIsBlocked(): boolean {
			return this.canCloseOsago
		},

		getPaymentDocument(): PaymentDocument {
			return {
				number: this.paymentDocument.number,
				date: this.paymentDocument.date
			}
		},

		getSaveData(): OsagoSpectechService.Deal {
			const configStore = useConfigStore()

			const registrationContractData = { ...this.getRegistrationContractData }

			delete registrationContractData.postAddress
			delete registrationContractData.fioKm
			delete registrationContractData.tnKm

			const vehicleOwner = {
				companyType: this.payment.owner.isDifferent
					? Info.CompanyType.COMPANY
					: this.insurer.main.companyType,
				juridicalSubject: this.getJuridicalSubject,
				physicalSubject: this.getPhysicalSubject
			}

			return {
				crmParentId: this.registration.parent[Fields.Parent.CRM_PARENT_ID] || 0,
				crmLeadId: this.registration.parent[Fields.Parent.CRM_LEAD_ID] || 0,
				verificationGuid: configStore.getVerificationGuid("kasco"),
				companyRequisites: this.getDealCompanyRequisites,
				signingPersonInfo: this.getDealSigningPersonInfo,
				ownerIsInsurant: !this.payment.owner.isDifferent,
				paymentOrderNumber: this.paymentDocument.number,
				region: +this.registration.placement.region,
				insuranceCompany: this.getInsuranceCompany,
				personInfoList: this.getDealPersonInfoList,
				draftSendDate: this.paymentDocument.date,
				city: +this.registration.placement.city,
				InsurancePolicyInfo: this.getInsurancePolicyInfo,
				owner: this.deal!.responsibleEmail,
				dealContact: this.getDealContact,
				draftSended: this.canCloseOsago,
				...registrationContractData,
				currentPolicyNumber: "",
				dealId: this.deal.id,
				isCurrentDeal: true,
				price: this.price,
				car: this.getCar,
				vehicleOwner,
				status: 10,
				crmId: this.getCrmId
			}
		}
	}
})
