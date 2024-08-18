import _cloneDeep from "lodash/cloneDeep"

import { BaseCalculator, StatePassport } from "~/store/base-calculator"

// Components
import { message, notification } from "ant-design-vue"

// Hooks
import { useCalculatorApi } from "~/hooks"

// Types
import {
	CalculatorFields as Fields,
	VerificationService,
	AvtocodService,
	KascoService,
	DealService,
	Calculator,
	Response,
	Info
} from "@common-repo/types/src"

type UgoriaPayload = KascoService.UgoriaPayload & KascoService.Deal

interface InsuranceParams {
	company: KascoService.InsuranceCompany
	type: KascoService.InsuranceType
	key: KascoService.InsuranceKey
}

interface InsurancePayload extends InsuranceParams {
	value: string | number | boolean
}

// Methods
function formatNumber(value: number | undefined): string {
	const defaultValue: string = "0 ₽"

	if (value) {
		return Number(value.toFixed(2))?.toLocaleString() + " ₽" || defaultValue
	}

	return defaultValue
}

// Store
import { useConfigStore, useInfoStore } from "~/store"

// Data
const insurerDocumentOption: string =
	"Выписка из единого государственного реестра юридических лиц (ЕГРЮЛ)"
const baseCalculator = new BaseCalculator(Calculator.TypeEnum.KASCO)
const baseState: any = baseCalculator.getState()

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

	payment: {
		main: {
			pledgeDocumentNumber: "",
			creditDocumentNumber: "",
			creditDocumentDate: "",
			registrationNumber: "",
			ptsSeriesNumber: "",
			steering: "Левый",
			ptsIssueDate: "",
			originalName: "",
			pledge: "Залог",
			polisNumber: "",
			customModel: "",
			enginePower: "",
			customMark: "",
			pledgeDate: "",
			issueYear: "",
			bodyColor: "",
			category: "",
			modelId: "",
			chassis: "",
			markId: "",
			vin: "",

			actualCostMax: 0,
			actualCostMin: 0,
			passCount: 5,
			maxMass: 0,

			isCustom: false,
			isPolis: false
		},

		// @ts-ignore
		previousContract: {
			insuranceCompanyName: "",
			contractFranchize: "0",
			contractNumber: "",
			contractEnd: ""
		} as KascoService.PreviousContract,

		owner: {
			isDifferent: false,
			companyType: 0,

			documentIssueDate: "",
			documentNumber: "",
			documentType: "",
			companyName: "",
			inn: "",

			// Additional
			shortCompanyName: "",
			InsuranceName: "",
			opfName: "",
			opf: "",

			opfCode: 0,
			InsuranceCode: 0,
			opfid: 0,

			address: {
				localityCodeKladr: "",
				locality: "",
				district: "",
				building: "",
				country: "",
				address: "",
				region: "",
				street: "",
				fiasId: "",
				house: ""
			}
		},
		kasco: {
			registrationRegion: 0,
			insuranceCost: 0,
			franchise: 1,
			totalCost: 0,
			mileage: 0,
			opsId: 0,
			dago: 0,
			ns: 0,

			finishedAt: "",
			startedAt: "",

			isInstallment: false,
			isTaxiMode: false,
			isNew: false,
			isOps: false,

			Insurance: { ...baseInsuranceFabric() },

			vsk: { ...baseInsuranceFabric() },

			ugoria: { ...baseInsuranceFabric(40) }
		},
		osago: {
			insurerDocumentNumber: "",
			insurerDocumentDate: "",
			insurerDocument: "",
			finishedAt: "",
			startedAt: "",

			isTrailer: false,

			usage: 0,

			Insurance: { ...baseInsuranceFabric(10) },

			ugoria: { ...baseInsuranceFabric(40) }
		}
	},

	registration: {
		contract: {
			personnelNumber: "",
			fullName: "нет КМ",
			numberVsp: "",
			clientType: ""
		},
		placement: {
			region: "",
			city: ""
		},
		signatory: {
			signatoryGenitive: "",
			positionGenitive: "",
			signatory: "",
			position: "",
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
			[Fields.Parent.OSAGO_CRM_LEAD_ID]: "",
			[Fields.Parent.CRM_PARENT_ID]: "",
			[Fields.Parent.CRM_LEAD_ID]: ""
		}
	},

	paymentOrder: {
		number: "",
		date: ""
	},

	preApprovement: {
		isPreapproved: false,
		crmLeadGrade: "",
		crmLeadId: ""
	},

	canCloseOsagoInsurance: false,

	isVskScoringSuccess: false
}

type State = typeof state

export const useKascoStore = defineStore("kasco", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),

		// @override
		copyDealAdditional(): void {
			this.payment.kasco.startedAt = ""
			this.payment.kasco.finishedAt = ""

			this.payment.osago.startedAt = ""
			this.payment.osago.finishedAt = ""

			this.resetInsurancesIfExist({})
		},

		resetState(): void {
			this.resetStateByData(state)
		},

		restSelectedInsurances(insuranceType: KascoService.InsuranceType) {
			this.payment[insuranceType].Insurance.isSelected = false
			this.payment[insuranceType].ugoria.isSelected = false

			if (insuranceType === KascoService.InsuranceType.KASCO) {
				this.payment[insuranceType].vsk.isSelected = false
			}
		},

		setInsuranceData(payload: InsurancePayload): void {
			if (payload.key === "isSelected") {
				this.restSelectedInsurances(payload.type)
			}

			const key: string | number | undefined =
				this.$state.payment?.[payload.type]?.[payload.company]?.[payload.key]

			if (typeof key !== "undefined") {
				this.$state.payment[payload.type][payload.company][payload.key]! =
					payload.value
			}
		},

		setVehicleInsuranceData(response: KascoService.VehicleDataResponse): void {
			const data: KascoService.VehicleData | undefined =
				response?.entity?.businessData?.vehicle

			if (data) {
				this.payment.main.actualCostMax = data.actualCostMax
				this.payment.main.actualCostMin = data.actualCostMin
			}
		},

		async fetchDataByVin(): Promise<void> {
			const $api = useCalculatorApi(this.calculatorType)
			const vin: string = this.payment.main.vin

			this.isLoading = true

			try {
				await this.fetchAvtocodeData(vin)

				const InsuranceData: KascoService.DataByVinResponse =
					await $api.fetchDataByVin(vin, "vin")

				this.setVehicleInsuranceData(InsuranceData)
			} catch (e) {
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
			const { $kascoApi } = useNuxtApp()

			try {
				const { entity: opf, isSuccess } = await $kascoApi.fetchInsuranceOpfsByCode(
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
			const { $kascoApi } = useNuxtApp()

			try {
				const { entity: opf, isSuccess } = await $kascoApi.fetchInsuranceOpfsByCode(
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
				const { $kascoApi } = useNuxtApp()

				try {
					const { entity, isSuccess } = await $kascoApi.fetchPreApprove(
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

				await infoStore.fetchModels(markId, this.calculatorType).catch(() => {})

				const modelId = infoStore.getInfoIdByName(
					Info.InfoType.MODELS,
					"dynamic",
					data.model
				)

				const { $dayjs } = useNuxtApp()

				this.payment.main.ptsIssueDate = $dayjs(data.pts.date).format(
					configStore.getFormatDates
				)

				this.payment.main.ptsSeriesNumber = data.pts.number
				this.payment.main.originalName = data.originalName
				this.payment.kasco.registrationRegion = regionId
				this.payment.main.registrationNumber = data.grz
				this.payment.main.issueYear = data.year + ""
				this.payment.main.enginePower = data.power
				this.payment.main.maxMass = data.maxMass
				this.payment.main.chassis = data.chassis
				this.payment.main.bodyColor = data.color
				this.payment.main.category = categoryId
				this.payment.main.modelId = modelId
				this.payment.main.markId = markId
			}
		},

		async issueKasco(type: string = ""): Promise<void> {
			const calculationId: string = this.payment.kasco.Insurance.calculationId

			if (this.getDealId && calculationId) {
				const errorText: string = "Не удалось выпустить проект полиса КАСКО"

				try {
					const { $kascoApi } = useNuxtApp()

					const response = await $kascoApi.issueKascoInsurance(
						this.getDealId,
						calculationId,
						type
					)

					const number: string = response?.number || response?.Number || ""

					if (response?.isSuccess || response?.IsSuccess) {
						message.success(
							`Успешный выпуск КАСКО${number ? " " + number : ""}`
						)
					} else {
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
					"Для выпуска проекта полиса КАСКО необходимо сделать расчет"
				)
			}
		},

		async issueOsago(): Promise<void> {
			const policyId: string = this.payment.osago.Insurance.policyId

			const errorText: string = "Не удалось выпустить проект полиса ОСАГО"

			if (policyId) {
				try {
					const { $kascoApi } = useNuxtApp()

					const response = await $kascoApi.issueOsago(policyId)

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
			isFirstIteration: boolean = true
		): Promise<void> {
			const policyId: string = this.payment.osago.Insurance.policyId

			if (policyId) {
				try {
					const { $kascoApi } = useNuxtApp()

					const response = await $kascoApi.fetchOsagoPaymentStatus(policyId)

					const state: string = response?.state || response?.State || ""

					const isPaymentCreated: boolean =
						state === KascoService.InsuranceOsagoPaymentStatus.PAYMENT_PREPARATION

					const isIssuePaid: boolean =
						state === KascoService.InsuranceOsagoPaymentStatus.ISSUE_SUCCESSFUL

					const isError: boolean =
						state === KascoService.InsuranceOsagoPaymentStatus.ISSUE_ERROR

					const messageKey: string = "osago-payment-status"

					if (isFirstIteration) {
						message.loading({
							content: "ОСАГО Страхование: Ожидание создания платежного шлюза",
							key: messageKey,
							duration: 10000
						})
					}

					if (
						response?.isSuccess ||
						(response?.IsSuccess && state) ||
						isError
					) {
						if (isPaymentCreated) {
							message.success({
								content: "ОСАГО Страхование: Платежный шлюз успешно создан",
								key: messageKey
							})
						} else if (isIssuePaid) {
							message.success({
								content: "ОСАГО Страхование: Успешно оплачено",
								key: messageKey
							})
						} else {
							// Sleep 2 sec
							await new Promise((resolve) => {
								setTimeout(resolve, 2 * 1000)
							})

							// Re-fetch status
							await this.fetchOsagoPaymentStatus(false)
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
					const { $kascoApi } = useNuxtApp()

					const response = await $kascoApi.sendPolicyDraftOsago(
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

		async sendDraftOsago(): Promise<void> {
			const errorText: string = "Не отправить черновик ОСАГО"

			try {
				const { $kascoApi } = useNuxtApp()

				const response = await $kascoApi.sendDraftOsago(this.getDealId)

				const orderDate: string = response?.entity?.paymentOrderDate || ""
				const orderNumber: string = response?.entity?.paymentOrderNumber || ""

				if (!(response?.isSuccess || response?.IsSuccess)) {
					this.displayCalculateErrors({
						errors: response?.errors || response?.Errors,
						isOsago: false,
						isIssue: true
					})

					throw errorText
				} else {
					if (orderDate && orderNumber) {
						this.paymentOrder.number = orderNumber
						this.paymentOrder.date = orderDate
					}
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
					const { $kascoApi } = useNuxtApp()

					const response = await $kascoApi.printOsagoPolicy(
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

		async fetchOsagoInsurancePayment(): Promise<void> {
			const calculationId: string = this.payment.osago.Insurance.calculationId

			if (this.getDealId && calculationId) {
				const errorText: string =
					"Ошибка отправки запроса печати проекта полиса ОСАГО"

				try {
					const { $kascoApi, $dayjs } = useNuxtApp()
					const configStore = useConfigStore()

					const paymentDate: string = this.getPaymentOrder.date
						? $dayjs(
								this.getPaymentOrder.date,
								configStore.getFormatDates
						  ).format(configStore.getFormatDatesInsurance)
						: ""

					const response = await $kascoApi.fetchOsagoInsurancePayment({
						paymentNumber: this.getPaymentOrder.number,
						policyId: this.payment.osago.Insurance.policyId,
						paymentDate
					})

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

		async importKascoInsurance(): Promise<void> {
			const errorText: string = "Не удалось импортировать полис ОСАГО"

			try {
				const { $kascoApi } = useNuxtApp()

				const response = await $kascoApi.importKascoInsurance(this.getInsuranceImportData)

				if (!(response?.isSuccess || response?.IsSuccess)) {
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
		},

		async prepareCloseKascoInsurance(): Promise<void> {
			try {
				await this.importKascoInsurance()
				await this.issueKasco("Print")
			} catch (error) {
				throw error
			}
		},

		async prepareCloseOsagoInsurance(): Promise<void> {
			try {
				await this.issueOsago()
				await this.fetchOsagoPaymentStatus()

				await this.sendPolicyDraftOsago()
				await this.sendDraftOsago()

				this.canCloseOsagoInsurance = true
			} catch (error) {
				throw error
			}
		},

		async closeOsagoDeal(): Promise<void> {
			await this.fetchOsagoInsurancePayment()
			await this.fetchOsagoPaymentStatus()
			await this.printOsagoPolicy()
			await this.closeDealOsago()
		},

		async closeKascoDeal(
			companyId: KascoService.InsuranceCompanyValue
		): Promise<void> {
			let companyName: KascoService.InsuranceCompanyName | string

			switch (companyId) {
				case KascoService.InsuranceCompanyValue.SBS:
					companyName = KascoService.InsuranceCompanyName.SBS
					break
				case KascoService.InsuranceCompanyValue.VSK:
					companyName = KascoService.InsuranceCompanyName.VSK
					break
				case KascoService.InsuranceCompanyValue.UGORIA:
					companyName = KascoService.InsuranceCompanyName.UGORIA
					break
				default:
					companyName = "unknown"
					break
			}

			const messages = {
				error: `Не удалось закрыть сделку КАСКО, страховой компании ${companyName}`,
				success: `Закрыта сделка КАСКО, страховой компании ${companyName}`
			}

			try {
				const { $kascoApi } = useNuxtApp()

				const response = await $kascoApi.closeKasco(this.getDealId, companyId)

				const isSuccess: boolean =
					response?.isSuccess ||
					response?.IsSuccess ||
					response?.message?.toLowerCase()?.includes("закрыта")

				if (!isSuccess) {
					this.displayCalculateErrors({
						errors: response?.errors || response?.Errors,
						isOsago: false,
						isIssue: true
					})

					throw messages.error
				}

				message.success(messages.success)

				this.deal.status = DealService.Status.SENDED
			} catch (error) {
				message.error(messages.error)
				throw error
			}
		},

		async sendVskScoring(): Promise<Response<number> | void> {
			const messageKey: string = "vsk-scoring"
			const { $kascoApi } = useNuxtApp()

			this.isLoading = true

			function errorScoring(): void {
				message.destroy()
				message.error({ content: "Вы не прошли скоринг", key: messageKey })
			}

			try {
				message.loading({
					content: "Проводим скоринг у ск ВСК",
					key: messageKey,
					duration: 10000
				})

				const response = await $kascoApi.sendVskScoring(this.getSaveData)

				if (response?.isSuccess && response?.entity) {
					this.isVskScoringSuccess = true

					// Destroy all messages in app
					message.destroy()

					message.success({
						content: `Вы прошли скоринг ВСК! Страховая приемия: ${Number(
							response.entity.toFixed(2)
						)?.toLocaleString()} ₽`,
						key: messageKey,
						duration: 5
					})
				} else {
					errorScoring()
				}

				return response
			} catch (e) {
				errorScoring()
			} finally {
				this.isLoading = false
			}
		},

		async closeInsurances(): Promise<void> {
			if (!this.getIsSelectedKasco && !this.getIsSelectedOsago) {
				message.error("Сделайте расчет и выбирете вариант страхования")

				return
			}

			this.isLoading = true

			const promises = []

			if (this.getIsSelectedKascoInsurance) {
				promises.push(this.prepareCloseKascoInsurance)
			}

			if (this.getIsSelectedOsagoInsurance) {
				promises.push(this.prepareCloseOsagoInsurance)
			}

			if (promises.length) {
				try {
					await Promise.all(promises.map((method) => method()))
				} catch (error) {
					throw "Failed close deal"
				}
			}

			if (this.getIsSelectedKasco) {
				try {
					await this.closeKascoDeal(
						this.getSelectedInsuranceCompanyId(KascoService.InsuranceType.KASCO)
					)
				} catch (e) {}
			}

			this.isLoading = false
		},

		async closeDealOsago(): Promise<void> {
			if (this.getIsVerify) {
				this.isLoadingClose = true

				try {
					const { $kascoApi } = useNuxtApp()

					const response = await $kascoApi.closeOsago(this.getDealId)

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

		setDealAdditionalStatus(osagoStatus: DealService.Status): void {
			if (osagoStatus === DealService.Status.SENDED) {
				this.deal.status = DealService.Status.SENDED
			}
		},

		setDealAdditional(deal: KascoService.PrefetchedDeal): void {
			// Deal status
			this.setDealAdditionalStatus(deal.osagoStatus)

			// Tabs data
			this.setDealAdditionalSignatory(deal)
			this.setDealAdditionalPayment(deal)
			this.setDealAdditionalRegistration(deal)

			// Payment load data
			this.setDealPaymentLoadData(deal)
		},

		setDealPaymentLoadData(deal: KascoService.PrefetchedDeal): void {
			this.paymentOrder.number = deal.paymentOrderNumber
			this.paymentOrder.date = deal.paymentOrderDate
		},

		setDealAdditionalSignatory(deal: KascoService.Deal): void {
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

		setDealAdditionalPayment(deal: KascoService.Deal): void {
			// @ts-ignore
			this.setDealPreviousContract(deal?.previousContract)
			this.setDealAdditionalCar(deal.car)
			this.setDealPledge(deal)
			this.setDealOwner(deal)

			this.setDealKasco(deal)
			this.setDealOsago(deal)

			this.payment.main.cv = deal.kv
		},

		setDealAdditionalCar(car: KascoService.Car): void {
			const infoStore = useInfoStore()

			this.payment.main.steering = car.isRightHand ? "Правый" : "Левый"
			this.payment.main.enginePower = car.enginePower + ""
			this.payment.main.registrationNumber = car.regSign
			this.payment.main.customModel = car.customModel
			this.payment.main.customMark = car.customMark
			this.payment.main.chassis = car.chassisNumber
			this.payment.main.ptsIssueDate = car.ptsDate
			this.payment.main.ptsSeriesNumber = car.pts
			this.payment.main.category = car.ptsCarType
			this.payment.main.issueYear = car.year + ""
			this.payment.main.isCustom = car.customCar
			this.payment.main.modelId = car.carModelId
			this.payment.main.markId = car.carMarkId
			this.payment.main.maxMass = car.maxMass
			this.payment.main.bodyColor = car.color
			this.payment.main.vin = car.vin

			infoStore.fetchModels(car.carMarkId, this.calculatorType).catch(() => {})
		},

		setDealPreviousContract(
			data: State["payment"]["previousContract"] | undefined
		): void {
			if (data) {
				this.payment.main.isPolis = true

				this.payment.previousContract.contractNumber = data.contractNumber || ""
				this.payment.previousContract.insuranceCompanyName =
					data.insuranceCompanyName || ""
				this.payment.previousContract.contractFranchize =
					data.contractFranchize || "0"

				if (data.contractEnd) {
					const { $dayjs } = useNuxtApp()
					const configStore = useConfigStore()

					this.payment.previousContract.contractEnd = $dayjs(
						data.contractEnd,
						configStore.getFormatDatesInsurance
					).format(configStore.getFormatDates)
				}
			}
		},

		setDealPledge(deal: KascoService.Deal): void {
			this.payment.main.pledge =
				deal.plege === KascoService.Pledge.YES ? "Залог" : "Не залог"

			{
				const configStore = useConfigStore()
				const { $dayjs } = useNuxtApp()

				this.payment.main.pledgeDate =
					deal.plegeDate || $dayjs().format(configStore.getFormatDates)

				this.payment.main.creditDocumentDate =
					(deal?.creditTime &&
						$dayjs(deal.creditTime).format(configStore.getFormatDates)) ||
					""
			}

			this.payment.main.pledgeDocumentNumber = deal?.plegeDoc || ""

			if (!this.payment.main.isPolis) {
				this.payment.main.isPolis = !!deal.polisNumber
				this.payment.main.polisNumber = deal.polisNumber
			}

			this.payment.main.creditDocumentNumber = deal?.creditDoc || ""
		},

		setDealKasco(deal: KascoService.Deal): void {
			this.payment.kasco.Insurance.calculationId = deal.InsuranceCalculationId
			this.payment.kasco.registrationRegion = deal.carRegion
			this.payment.kasco.insuranceCost = deal.car.insurSum
			this.payment.kasco.isInstallment = deal.installment
			this.payment.kasco.Insurance.policyId = deal.InsurancePolicyId
			this.payment.kasco.totalCost = deal.car.fullSum
			this.payment.kasco.isTaxiMode = deal.car.taxi
			this.payment.kasco.franchise = deal.franchise
			this.payment.kasco.mileage = deal.car.mileage
			this.payment.kasco.startedAt = deal.startDate
			this.payment.kasco.finishedAt = deal.endDate
			this.payment.kasco.isOps = !!deal.car.opsId
			this.payment.kasco.opsId = deal.car.opsId
			this.payment.kasco.isNew = deal.car.new

			this.payment.kasco.dago = deal.dagoSum | 0
			this.payment.kasco.ns = deal.nsSum | 0

			if (deal.kascoInsuranceCompany) {
				const insuranceName: KascoService.InsuranceCompany =
					this.getInsuranceNameByCode(deal.kascoInsuranceCompany)

				if (insuranceName) {
					this.payment.kasco[insuranceName].insurancePremium = deal.price
					this.payment.kasco[insuranceName].isSelected = true
				}
			}

			// SBS
			this.payment.kasco.Insurance.cv = deal.kvInsurance || 30

			// Vsk
			this.payment.kasco.vsk.cv = deal.kvVsk || 30

			// Ugoria
			this.payment.kasco.ugoria.cv = deal.kvUgoria || 40
			this.payment.kasco.ugoria.calculationId = deal.ugoriaKascoCalcId

			// deal.ugoriaKascoPolicyId  todo
			// deal.ugoriaOsagoPolicyId  todo
			// deal.ugoriaOsagoCalcId  todo
		},

		setDealOwner(deal: KascoService.Deal): void {
			const configStore = useConfigStore()

			this.payment.owner.opfid = deal.opfId || 0

			const juridicalSubject: KascoService.OsagoPayloadJuridical | any =
				deal?.vehicleOwner?.juridicalSubject

			if (juridicalSubject) {
				const { $dayjs } = useNuxtApp()

				this.payment.owner.documentNumber = juridicalSubject.document.number
				this.payment.owner.shortCompanyName = juridicalSubject.shortName
				this.payment.owner.documentType = juridicalSubject.document.type
				this.payment.owner.companyName = juridicalSubject.fullName
				this.payment.owner.companyType = Info.CompanyType.COMPANY
				this.payment.owner.address = juridicalSubject.factAddress
				this.payment.owner.opfId = juridicalSubject.opfId
				this.payment.owner.inn = juridicalSubject.inn
				this.payment.owner.opf = juridicalSubject.opf

				this.payment.owner.documentIssueDate = $dayjs(
					juridicalSubject.document.issueDate,
					configStore.getFormatDatesInsurance
				).format(configStore.getFormatDates)
			}
		},

		setDealOsago(deal: KascoService.Deal): void {
			this.payment.osago.insurerDocumentNumber = deal.osagoDocumentTypeValue
			this.payment.osago.insurerDocumentDate = deal.osagoDocumentTypeDate
			this.payment.osago.insurerDocument = deal.osagoDocumentTypeId
			this.payment.osago.startedAt = deal.osagoStartDate
			this.payment.osago.finishedAt = deal.osagoEndDate
			this.payment.osago.isTrailer = deal.car.trailer
			this.payment.osago.usage = deal.car.usage

			if (deal.osagoInsuranceCompany) {
				const insuranceName: KascoService.InsuranceCompany =
					this.getInsuranceNameByCode(deal.osagoInsuranceCompany)

				if (insuranceName) {
					this.payment.osago[insuranceName].insurancePremium = deal.price
					this.payment.osago[insuranceName].isSelected = true

					this.payment.osago[insuranceName].insurancePremium =
						deal.osagoInsurancePremium
					this.payment.osago[insuranceName].calculationId =
						deal.osagoInsuranceCalculationId
					this.payment.osago[insuranceName].policyId = deal.osagoInsurancePolicyId
					this.payment.osago[insuranceName].isSelected = deal.insuranceOsago
					this.payment.osago[insuranceName].cv = deal.osagoKv
				}
			}
		},

		setDealAdditionalRegistration(deal: KascoService.Deal): void {
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
			this.registration.bank.email = deal.dealContact!.email
			this.registration.bank.phone = deal.dealContact!.phone
			this.registration.bank.corWallet =
				deal.companyRequisites?.correspondentAccount || ""

			this.registration.bank.postAddress = deal.postAddress

			this.setDealParentFields(deal)
		},

		setDealParentFields(deal: KascoService.Deal): void {
			this.registration.parent[Fields.Parent.CRM_PARENT_ID] = deal.crmParentId
			this.registration.parent[Fields.Parent.CRM_LEAD_ID] = deal.crmLeadId
			this.registration.parent[Fields.Parent.OSAGO_CRM_PARENT_ID] =
				deal.osagoCrmParentId
			this.registration.parent[Fields.Parent.OSAGO_CRM_LEAD_ID] =
				deal.osagoCrmLeadId
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
			this.payment.owner.address.locality =
				addressData?.city || addressData?.settlement || ""
			this.payment.owner.address.country = addressData?.country || ""
			this.payment.owner.address.region = addressData?.region || ""
			this.payment.owner.address.street =
				addressData?.street || addressData?.settlement || ""
			this.payment.owner.address.building = addressData?.block || ""
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
			isOsago = true,
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
							`Ошибка ${isIssue ? "выпуска" : "расчета"} ${
								isOsago ? "ОСАГО" : "КАСКО"
							} ${company}: ${error.message}`,
							10
						)
				})
			}
		},

		async calculateKascoInsurance(): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			await this.fetchFias()

			await $kascoApi
				.calculateKascoInsurance(this.getCalculatePayloadKascoInsurance)
				.then((response) => {
					const data: KascoService.InsuranceResponse = response?.data
						? response.data
						: response

					if ((data?.isSuccess || data?.IsSuccess) && data?.insPremTotal) {
						this.payment.kasco.Insurance.insurancePremium = data?.insPremTotal || ""
						this.payment.kasco.Insurance.calculationId = data?.calcId || ""
						this.payment.kasco.Insurance.policyId = data?.policyId || ""

						message.success(
							`Успешный расчет КАСКО Страхование: ${formatNumber(data?.insPremTotal)} ₽`
						)
					} else if (data?.errors?.length || data?.Errors?.length) {
						this.displayCalculateErrors({
							errors: data?.errors || data?.Errors,
							isOsago: false
						})
					}
				})
				.catch((response: KascoService.InsuranceResponse) => {
					if (response.errors?.length) {
						this.displayCalculateErrors({
							errors: response.errors || response.Errors,
							isOsago: false
						})
					}
				})
		},

		async calculateKascoVsk(): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			await $kascoApi
				.calculateKascoVsk(this.getCalculatePayloadVsk)
				.then((response) => {
					const data: KascoService.IBrokerResponse = response?.data
						? response.data
						: response

					const vsk: Response<number> | undefined =
						data?.entity?.Vsk || data?.entity?.vsk

					if ((data?.isSuccess || data?.IsSuccess) && vsk) {
						this.payment.kasco.vsk.insurancePremium = vsk.entity || ""
						this.payment.kasco.vsk.calculationId = ""
						this.payment.kasco.vsk.policyId = ""

						message.success(
							`Успешный расчет КАСКО ВСК: ${formatNumber(vsk?.entity)}`
						)
					} else if (data?.errors?.length || data?.Errors?.length) {
						this.displayCalculateErrors({
							company: KascoService.InsuranceCompanyName.VSK,
							errors: data?.errors || data?.Errors,
							isOsago: false
						})
					}

					if (!data?.entity?.Vsk?.isSuccess && data?.entity?.Vsk?.message) {
						const messageText: string = data?.entity?.Vsk?.message

						if (messageText) message.error(`ВСК: ${messageText}`)
					}
				})
				.catch()
		},

		async calculateKascoUgoria(): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			await $kascoApi
				.calculateUgoria(
					this.getCalculateUgoriaPayload(KascoService.InsuranceTypeInt.KASCO)
				)
				.then((response) => {
					const insurancePremium: number = response?.insurancePremium || 0
					const calcId: number = response?.calcId || 0

					if (calcId && insurancePremium) {
						this.payment.kasco.ugoria.insurancePremium = insurancePremium || ""
						this.payment.kasco.ugoria.calculationId = calcId || ""
						this.payment.kasco.ugoria.policyId = ""

						message.success(
							`Успешный расчет КАСКО Югория: ${formatNumber(insurancePremium)}`
						)
					} else {
						message.error("Ошибка расчета КАСКО Югория")
					}
				})
				.catch((response: KascoService.InsuranceResponse) => {
					if (response.errors?.length) {
						this.displayCalculateErrors({
							errors: response.errors || response.Errors,
							isOsago: false
						})
					}
				})
		},

		async calculateKasco(): Promise<void> {
			this.isLoading = true

			this.resetInsurancesIfExist({ isOsago: false })

			try {
				await Promise.all([
					this.calculateKascoInsurance(),
					this.calculateKascoVsk(),
					this.calculateKascoUgoria()
				])
				await this.saveDeal({ isSaveCalculation: true })
			} catch (e) {
			} finally {
				this.isLoading = false
			}
		},

		async calculateOsago(): Promise<void> {
			const { $kascoApi } = useNuxtApp()

			this.resetInsurancesIfExist({ isKasco: false })

			await this.fetchFias()
			await this.fetchInsuranceOpf()

			this.isLoading = true

			await $kascoApi
				.calculateOsagoInsurance(this.getCalculateOsagoInsurance)
				.then(async (response) => {
					const data: KascoService.InsuranceResponse = response?.data
						? response.data
						: response

					if ((data?.isSuccess || data?.IsSuccess) && data?.insPremTotal) {
						this.payment.osago.Insurance.insurancePremium = data?.insPremTotal || ""
						this.payment.osago.Insurance.calculationId = data?.calcId || ""
						this.payment.osago.Insurance.policyId = data?.policyId || ""

						await this.saveDeal({ isSaveCalculation: true })

						message.success(
							`Успешный расчет ОСАГО: ${formatNumber(data?.insPremTotal)}`
						)
					} else if (data?.errors?.length || data?.Errors?.length) {
						this.displayCalculateErrors({
							errors: data?.errors || data?.Errors
						})
					}
				})
				.catch((response: KascoService.InsuranceResponse) => {
					if (response.errors?.length) {
						this.displayCalculateErrors({
							errors: response.errors || response.Errors
						})
					}
				})
				.finally(() => {
					this.isLoading = false
				})
		},

		resetSelectInsurances(): void {
			this.payment.kasco.Insurance.isSelected = false
			this.payment.kasco.vsk.isSelected = false
			this.payment.osago.Insurance.isSelected = false
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
			let isExistKasco: boolean = false
			let isExistOsago: boolean = false

			const resetFabric = (
				type: KascoService.InsuranceType,
				company: KascoService.InsuranceCompany
			) => {
				let cv: number = 30

				if (this.payment?.[type]?.[company]?.insurancePremium) {
					switch (type) {
						case KascoService.InsuranceType.KASCO:
							isExistKasco = true
							break
						case KascoService.InsuranceType.OSAGO:
							isExistOsago = true
							cv = 10
							break
					}

					this.payment[type][company] = { ...baseInsuranceFabric(cv) }
				}
			}

			if (isKasco) {
				resetFabric(
					KascoService.InsuranceType.KASCO,
					KascoService.InsuranceCompany.SBS
				)
				resetFabric(
					KascoService.InsuranceType.KASCO,
					KascoService.InsuranceCompany.VSK
				)
				resetFabric(
					KascoService.InsuranceType.KASCO,
					KascoService.InsuranceCompany.UGORIA
				)
			}

			if (isOsago) {
				resetFabric(
					KascoService.InsuranceType.OSAGO,
					KascoService.InsuranceCompany.SBS
				)
				resetFabric(
					KascoService.InsuranceType.OSAGO,
					KascoService.InsuranceCompany.UGORIA
				)
			}

			const message: string = "Сброс расчета"

			if (isExistKasco && isKasco) {
				notification.warning({
					message,
					description:
						"Вы изменили данные полей КАСКО. Расчет по продуктам КАСКО был сброшен"
				})
			} else if (isExistOsago && isOsago) {
				notification.warning({
					message,
					description:
						"Вы изменили данные полей ОСАГО. Расчет по продуктам ОСАГО был сброшен"
				})
			} else if ((isExistOsago || isExistKasco) && isKasco && isOsago) {
				notification.warning({
					message,
					description:
						"Вы изменили данные полей страхования. Все расчеты были сброшены"
				})
			}
		}
	},

	getters: {
		...baseCalculator.getGetters(),

		// @override
		getCalculatePayload(): boolean {
			return false
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
				this.payment.main.registrationNumber &&
				this.payment.main.ptsSeriesNumber &&
				this.payment.main.ptsIssueDate &&
				this.payment.main.issueYear &&
				this.payment.main.category &&
				this.payment.main.modelId &&
				this.payment.main.maxMass &&
				this.payment.main.markId &&
				this.payment.main.vin &&
				isCustom &&
				isOwner
			)
		},

		getIsPreApprovement(): boolean {
			return this.preApprovement.isPreapproved
		},

		getIsVskScoringSuccess(): boolean {
			return this.isVskScoringSuccess
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

			!this.payment.main.ptsSeriesNumber && list.push("Серия и номер ПТС/ЭПТС")
			!this.payment.main.enginePower && list.push("Мощность двигателя (л/с)")
			!this.payment.main.ptsIssueDate && list.push("Дата регистрации ПТС")
			!this.payment.main.vin && list.push("Идентификационный номер (VIN)")
			!this.payment.main.issueYear && list.push("Год выпуска ТС")
			!this.payment.main.category && list.push("Категория ТС")
			!this.payment.main.markId &&
				list.push("Марка ТС (согласно справочнику Страхование)")
			!this.payment.main.modelId &&
				list.push("Модель ТС (согласно справочнику Страхование)")

			!this.insurer.passports[0].dob &&
				list.push("Заполните дату рождения Ген. директора")

			return list
		},

		getKascoUnAvailableList(): string[] {
			const list: string[] = [...this.getCommonUnAvailableList]

			!this.payment.kasco.insuranceCost && list.push("Страховая стоимость ТС")
			!this.payment.kasco.totalCost && list.push("Полная стоимость ТС")
			!this.payment.kasco.mileage && list.push("Пробег")

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

		getActualCost(): (value: "min" | "max") => number {
			return (value) => {
				if (!value) {
					return 0
				}

				let key: string

				switch (value) {
					case "min":
						key = "actualCostMin"
						break
					case "max":
						key = "actualCostMax"
						break
				}

				return this.payment.main[key]
			}
		},

		getCar(): (hasPreviousContract: boolean) => KascoService.Car {
			return (hasPreviousContract: boolean = false) => {
				const data: KascoService.Car = {
					regSign: this.payment.main.registrationNumber.replace(/\s/g, ""),
					pts: this.payment.main.ptsSeriesNumber.replace(/\s/g, ""),
					isRightHand: this.payment.main.steering !== "Левый",
					maxMass: this.payment.main.maxMass + "" || "0",
					enginePower: +this.payment.main.enginePower,
					customModel: this.payment.main.customModel,
					insurSum: this.payment.kasco.insuranceCost,
					chassisNumber: this.payment.main.chassis,
					customMark: this.payment.main.customMark,
					ptsCarType: +this.payment.main.category,
					ptsDate: this.payment.main.ptsIssueDate,
					carModelId: +this.payment.main.modelId,
					customCar: this.payment.main.isCustom,
					fullSum: this.payment.kasco.totalCost,
					trailer: this.payment.osago.isTrailer,
					carMarkId: +this.payment.main.markId,
					mileage: this.payment.kasco.mileage,
					taxi: this.payment.kasco.isTaxiMode,
					color: this.payment.main.bodyColor,
					year: +this.payment.main.issueYear,
					opsId: this.payment.kasco.opsId,
					usage: this.payment.osago.usage,
					new: this.payment.kasco.isNew,
					passCount: this.getPassCount,
					diagnosticCardIssueDate: "",
					vin: this.payment.main.vin,
					diagnosticCardNumber: "",
					isBuyRecently: false,
					vskBadPetrol: false,
					inspected: false,
					multiDrive: true,
					vskHydro: false
				}

				if (hasPreviousContract && this.getHasPreviousContract) {
					// @ts-ignore
					data.previousContract = this.getPreviousContract
				}

				return data
			}
		},

		getIsSelectedKascoInsurance(): boolean {
			return this.payment.kasco.Insurance.isSelected
		},

		getIsSelectedKasco(): boolean {
			return (
				this.getIsSelectedKascoInsurance ||
				this.payment.kasco.vsk.isSelected ||
				this.payment.kasco.ugoria.isSelected
			)
		},

		getIsSelectedOsagoInsurance(): boolean {
			return this.payment.osago.Insurance.isSelected
		},

		getCanCloseOsagoInsurance(): boolean {
			return !this.getIsSelectedOsagoInsurance || this.canCloseOsagoInsurance
		},

		getIsSelectedOsago(): boolean {
			return this.getIsSelectedOsagoInsurance || this.payment.osago.ugoria.isSelected
		},

		getCalculatePayloadVsk(): KascoService.Deal {
			return this.getSaveData
		},

		getOwnerIsInsurant(): boolean {
			return !this.payment.owner.isDifferent
		},

		getCalculateFactAddress(): KascoService.JuridicalFactAddress {
			return {
				localityCodeKladr: this.insurer?.companyAddress?.kladr_id || "",
				locality: this.insurer.companyAddress.cityPlace || "",
				address: this.insurer.companyAddress.address || "",
				country: this.insurer.companyAddress.country || "",
				building: this.insurer.companyAddress.build || "",
				fiasId: this.insurer.companyAddress.fias_id || "",
				region: this.insurer.companyAddress.region || "",
				street: this.insurer.companyAddress.street || "",
				house: this.insurer.companyAddress.house || "",
				district: ""
			}
		},

		generateDateInsurance(): (date: string) => string {
			const { getFormatDates, getFormatDatesInsurance } = useConfigStore()
			const { $dayjs } = useNuxtApp()

			return (date) => {
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

			const region = infoStore.getNameById({
				name: Info.InfoType.REGIONS,
				type: "dynamic",
				id: this.payment.kasco.registrationRegion
			})

			const creditDocumentDate: string = this.generateDateInsurance(
				this.payment.main.creditDocumentDate
			)

			const pledgeDocumentDate: string = this.generateDateInsurance(
				this.payment.main.pledgeDate
			)

			const issueDate: string = this.generateDateInsurance(
				this.payment.main.ptsIssueDate
			)

			return {
				document: {
					issueDate,
					number: this.payment.main.ptsSeriesNumber.replace(/\s/g, "")
				},

				pledgeDocument: {
					creditDocumentNumber: this.payment.main.creditDocumentNumber,
					pledgeDocumentNumber: this.payment.main.pledgeDocumentNumber,
					creditDocumentDate,
					pledgeDocumentDate
				},

				regNumber: this.payment.main.registrationNumber.replace(/\s/g, ""),
				manufactureYear: +this.payment.main.issueYear,
				plege: this.payment.main.pledge === "Залог",
				customModel: this.payment.main.customModel,
				securitySystem: this.payment.owner.opfName,
				customMark: this.payment.main.customMark,
				actualPrice: this.payment.kasco.totalCost,
				markModelId: this.payment.main.modelId,
				model: model?.split(" - ")?.[1] || "",
				power: +this.payment.main.enginePower,
				trailer: this.payment.osago.isTrailer,
				bankBik: this.registration.bank.bik,
				maxMass: +this.payment.main.maxMass,
				mileage: this.payment.kasco.mileage,
				usage: this.payment.osago.usage,
				new: this.payment.kasco.isNew,
				vin: this.payment.main.vin,
				numberOfSeats: 5,
				category,
				region,
				mark
			}
		},

		getCalculateUgoriaPayload(): (
			insuranceType: KascoService.InsuranceTypeInt
		) => UgoriaPayload {
			return (insuranceType = KascoService.InsuranceTypeInt.KASCO) => {
				const baseCalculateFields = { ...this.getCalculatePayloadKascoInsurance }

				if (this.getHasPreviousContract) {
					baseCalculateFields.car.previousContract = this.getPreviousContract
				}

				return {
					...baseCalculateFields,

					insuranceType,

					kv: this.payment.kasco.ugoria.cv,
					dagoSum: this.payment.kasco.dago,
					nsSum: this.payment.kasco.ns
				}
			}
		},

		getCalculatePayloadKascoInsurance(): KascoService.KascoPayload {
			const osagoPayload = {
				...this.getCalculatePayloadInsurance(KascoService.InsuranceType.KASCO)
			}

			delete osagoPayload.ownerIsInsurant

			osagoPayload.owner = { ...osagoPayload.insurant }

			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			function generateDate(date: string): string {
				return date
					? $dayjs(date, configStore.getFormatDates).format(
							configStore.getFormatDatesInsurance
					  )
					: ""
			}

			const startDate: string = generateDate(this.payment.kasco.startedAt)
			const endDate: string = generateDate(this.payment.kasco.finishedAt)

			return {
				...osagoPayload,
				insurancePrice: this.payment.kasco.insuranceCost,
				installment: this.payment.kasco.isInstallment,
				franchiseId: this.payment.kasco.franchise,
				dealOwner: this.registration.bank.email,
				kvDiscount: +this.payment.kasco.Insurance.cv,
				prolongation: false,
				startDate,
				endDate
			}
		},

		getInsuranceImportData(): KascoService.KascoImportPayload {
			return {
				calculationResponse: {
					policyId: this.payment.kasco.Insurance.policyId,
					calcId: this.payment.kasco.Insurance.calculationId,
					insPremTotal: this.payment.kasco.Insurance.insurancePremium,
					paymentsPlan: {
						payments: this.getInsurancePaymentPlan
					}
				},
				...this.getCalculatePayloadKascoInsurance
			}
		},

		getJuridicalSubjectEmpty(): KascoService.OsagoPayloadJuridical {
			return {
				opf: "Общества с ограниченной ответственностью",
				citizenship: "Россия",
				shortName: "",
				fullName: "",
				phone: "",
				email: "",
				ogrn: "",
				inn: "",
				kpp: "",
				document: {
					issueCountry: "Россия",
					issuePlace: "",
					issueDate: "",
					number: "",
					series: "",
					type: ""
				},
				factAddress: {
					localityCodeKladr: 0,
					building: "",
					district: "",
					locality: "",
					country: "",
					address: "",
					fiasId: "",
					street: "",
					region: "",
					house: ""
				}
			}
		},

		getJuridicalSubject(): KascoService.OsagoPayloadJuridical {
			const { citizenship = "", isForeign } = this.insurer.passports?.[0]

			const insurerDocumentDate = this.generateDateInsurance(
				this.payment.osago.insurerDocumentDate
			)

			if (this.payment.owner.isDifferent) {
				const issueDate: string = this.generateDateInsurance(
					this.payment.owner.documentIssueDate
				)

				return {
					shortName: this.payment.owner.shortCompanyName,
					fullName: this.payment.owner.companyName,
					citizenship: citizenship || "Россия",
					phone: this.registration.bank.phone,
					kpp: this.registration.bank.kpp,
					ogrn: this.insurer.main.ogrn,
					inn: this.payment.owner.inn,
					opf: this.payment.owner.opf,
					isResident: true,
					document: {
						type: this.payment.owner.documentType,
						number: this.payment.owner.documentNumber,
						issueCountry: "Россия",
						issuePlace: "",
						series: "",
						issueDate
					},
					// @ts-ignore
					address: this.payment.owner.address
				}
			}

			return {
				shortName: this.insurer.main.companyShortName,
				factAddress: this.getCalculateFactAddress,
				fullName: this.insurer.main.companyName,
				citizenship: citizenship || "Россия",
				phone: this.registration.bank.phone,
				email: this.registration.bank.email,
				inn: this.insurer.main.companyInn,
				kpp: this.registration.bank.kpp,
				opfId: this.insurer.main.opfId,
				ogrn: this.insurer.main.ogrn,
				opf: this.insurer.main.opf,
				isResident: !isForeign,
				document: {
					number: this.payment.osago.insurerDocumentNumber,
					type: this.payment.osago.insurerDocument,
					issueDate: insurerDocumentDate,
					issueCountry: "Россия",
					issuePlace: "",
					series: ""
				}
			}
		},

		getPhysicalSubject(): KascoService.OsagoPayloadPhysical {
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
				factAddress: this.getCalculateFactAddress,
				inn: this.insurer.main.companyInn || "",
				citizenship: citizenship || "Россия",
				email: this.registration.bank.email,
				phone: this.registration.bank.phone,
				ogrn: this.insurer.main.ogrn,
				birthPlace: placeOfBirth,
				middleName,
				firstName,
				birthDate,
				lastName,
				document: {
					issueDate: passportIssueDate,
					issuePlace: passportOffice,
					issueCountry: "Россия",
					series: series,
					type: ""
				}
			}
		},

		getCalculatePayloadInsurance() {
			return (
				type: KascoService.InsuranceType = KascoService.InsuranceType.OSAGO
			): KascoService.OsagoPayload => {
				const startDate = this.generateDateInsurance(this.payment[type].startedAt)
				const endDate = this.generateDateInsurance(this.payment[type].finishedAt)

				const { $dayjs } = useNuxtApp()

				return {
					ownerIsInsurant: this.getOwnerIsInsurant,
					calcId: this.payment.kasco.Insurance.calculationId,
					policyId: this.payment.kasco.Insurance.policyId,
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
					},
					terBank: this.registration.contract.terBank
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
					type: this.payment.owner.isDifferent
						? this.payment.owner.documentType
						: this.payment.osago.insurerDocument && insurerDocumentOption,
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

			const payload: any = {
				ownerIsInsurant: this.getOwnerIsInsurant,
				calcId: this.payment.kasco.Insurance.calculationId,
				policyId: this.payment.kasco.Insurance.policyId,
				policyDate: $dayjs().toISOString(),
				car: this.getCalculationCar,
				startDate,
				endDate,
				// @ts-ignore
				insurant: {
					juridicalSubject,
					physicalSubject: this.getPhysicalSubject,
					subjectType: this.getSubjectType
				}
			}

			if (!this.getOwnerIsInsurant) {
				payload.owner = {
					juridicalSubject: this.payment.owner.isDifferent
						? juridicalSubject
						: this.getJuridicalSubjectEmpty,
					subjectType: KascoService.SubjectType.FL
				}
			}

			return payload
		},

		getInsurancePaymentPlan(): KascoService.InsurancePaymentPlan[] {
			const { $dayjs } = useNuxtApp()

			if (this.payment.kasco.Insurance.insurancePremium) {
				return [
					{
						date: $dayjs().toISOString(),
						number: 1,
						sum: this.payment.kasco.Insurance.insurancePremium
					}
				]
			}

			return []
		},

		getSelectedInsuranceCompanyId(): (
			insuranceType: KascoService.InsuranceType
		) => KascoService.InsuranceCompanyValue {
			const osagoCompanies: KascoService.InsuranceCompany[] = [
				KascoService.InsuranceCompany.UGORIA,
				KascoService.InsuranceCompany.SBS
			]

			const kascoCompanies: KascoService.InsuranceCompany[] = [
				...osagoCompanies,
				KascoService.InsuranceCompany.VSK
			]

			return (insuranceType: KascoService.InsuranceType) => {
				let companies: KascoService.InsuranceCompany[] = []

				switch (insuranceType) {
					case KascoService.InsuranceType.KASCO:
						companies = kascoCompanies
						break
					case KascoService.InsuranceType.OSAGO:
						companies = osagoCompanies
						break
					default:
						return KascoService.InsuranceCompanyValue.NOT_SELECTED
				}

				for (const companyName of companies) {
					if (this.payment[insuranceType][companyName].isSelected) {
						switch (companyName) {
							case KascoService.InsuranceCompany.SBS:
								return KascoService.InsuranceCompanyValue.SBS
							case KascoService.InsuranceCompany.VSK:
								return KascoService.InsuranceCompanyValue.VSK
							case KascoService.InsuranceCompany.UGORIA:
								return KascoService.InsuranceCompanyValue.UGORIA
							default:
								return KascoService.InsuranceCompanyValue.NOT_SELECTED
						}
					}
				}

				return KascoService.InsuranceCompanyValue.NOT_SELECTED
			}
		},

		getInsuranceNameByCode(): (
			code: KascoService.InsuranceCompanyValue
		) => KascoService.InsuranceCompany | "" {
			return (code) => {
				switch (code) {
					case KascoService.InsuranceCompanyValue.SBS:
						return KascoService.InsuranceCompany.SBS
					case KascoService.InsuranceCompanyValue.VSK:
						return KascoService.InsuranceCompany.VSK
					case KascoService.InsuranceCompanyValue.UGORIA:
						return KascoService.InsuranceCompany.UGORIA
					default:
						return ""
				}
			}
		},

		getPremium(): (insuranceType: KascoService.InsuranceType) => number {
			return (insuranceType) => {
				const selectedCompanyId: KascoService.InsuranceCompanyValue =
					this.getSelectedInsuranceCompanyId(insuranceType)

				const companyName: KascoService.InsuranceCompany | "" =
					this.getInsuranceNameByCode(selectedCompanyId)

				if (!companyName) {
					return 0
				}

				return this.payment[insuranceType][companyName].insurancePremium || 0
			}
		},

		getKascoPremium(): number {
			return this.getPremium(KascoService.InsuranceType.KASCO)
		},

		getOsagooPremium(): number {
			return this.getPremium(KascoService.InsuranceType.OSAGO)
		},

		getOriginalName(): string {
			return this.payment.main.originalName
		},

		getPreviousContract(): State["payment"]["previousContract"] {
			const contract: State["payment"]["previousContract"] =
				this.payment.previousContract

			const { $dayjs } = useNuxtApp()
			const configStore = useConfigStore()

			const contractEnd: string = contract.contractEnd
				? $dayjs(contract.contractEnd, configStore.getFormatDates).format(
						configStore.getFormatDatesInsurance
				  )
				: ""

			return {
				insuranceCompanyName: contract.insuranceCompanyName || "",
				contractFranchize: +contract.contractFranchize || 0,
				contractNumber: contract.contractNumber || "",
				contractEnd
			}
		},

		getHasPreviousContract(): boolean {
			const contract: State["payment"]["previousContract"] =
				this.getPreviousContract

			type Key = keyof typeof contract

			for (const key of Object.keys(contract)) {
				if (contract[key as Key]) {
					return true
				}
			}

			return false
		},

		getPaymentOrder(): State["paymentOrder"] {
			return this.paymentOrder
		},

		getSaveData(): KascoService.Deal {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			const companyRequisites = _cloneDeep(this.getCompanyRequisites)
			const personInfoList = _cloneDeep(this.getPersonInfoList)
			const juridicalSubject = this.getJuridicalSubject

			delete companyRequisites.opf
			delete juridicalSubject.phone

			personInfoList.verifyPos = ""

			personInfoList.forEach((_: any, index: number) => {
				personInfoList[index].passport.validityPeriodEnd = ""
			})

			const opfId = this.payment.owner.opfid || this.insurer.main.opfId || 0

			return {
				crmParentId: this.registration.parent[Fields.Parent.CRM_PARENT_ID] || 0,
				crmLeadId: this.registration.parent[Fields.Parent.CRM_LEAD_ID] || 0,
				osagoDocumentTypeValue: this.payment.osago.insurerDocumentNumber,
				osagoDocumentTypeDate: this.payment.osago.insurerDocumentDate,
				osagoInsuranceCalculationId: this.payment.osago.Insurance.calculationId,
				ugoriaKascoCalcId: +this.payment.kasco.ugoria.calculationId,
				verificationGuid: configStore.getVerificationGuid("kasco"),
				status: this.deal.status || DealService.Status.IN_PROCESS,
				companyAddressKladr: this.insurer.companyAddress.kladr_id,
				osagoDocumentTypeId: +this.payment.osago.insurerDocument,
				InsuranceCalculationId: this.payment.kasco.Insurance.calculationId,
				carRegion: this.payment.kasco.registrationRegion || 0,
				reasonDate: this.insurer.signatory?.reasonDate || "",
				creditDoc: this.payment.main.creditDocumentNumber,
				currentPolisNumber: this.payment.main.polisNumber,
				osagoInsurancePolicyId: this.payment.osago.Insurance.policyId,
				creditTime: this.payment.main.creditDocumentDate,
				plegeDoc: this.payment.main.pledgeDocumentNumber,
				paymentOrderNumber: this.getPaymentOrder.number,
				postAddress: this.registration.bank.postAddress,
				installment: this.payment.kasco.isInstallment,
				signingPersonInfo: this.getSigningPersonInfo,
				franchise: this.payment.kasco.franchise || 1,
				osagoInsurancePremium: this.getOsagooPremium,
				osagoStartDate: this.payment.osago.startedAt,
				InsurancePolicyId: this.payment.kasco.Insurance.policyId,
				region: +this.registration.placement.region,
				osagoEndDate: this.payment.osago.finishedAt,
				paymentOrderDate: this.getPaymentOrder.date,
				osagoStatus: DealService.Status.IN_PROCESS,
				polisNumber: this.payment.main.polisNumber,
				previousContract: this.getPreviousContract,
				startDate: this.payment.kasco.startedAt,
				city: +this.registration.placement.city,
				insuranceKasco: this.getIsSelectedKasco,
				insuranceOsago: this.getIsSelectedOsago,
				kvUgoria: +this.payment.kasco.ugoria.cv,
				endDate: this.payment.kasco.finishedAt,
				osagoInsuranceOpfName: this.insurer.main.opf,
				InsurancePaymentPlan: this.getInsurancePaymentPlan,
				personInfoList: this.getPersonInfoList,
				...this.getRegistrationContractData,
				osagoKv: +this.payment.osago.Insurance.cv,
				owner: this.deal.responsibleEmail,
				kvInsurance: +this.payment.kasco.Insurance.cv,
				kvVsk: +this.payment.kasco.vsk.cv,
				dealContact: this.getDealContact,
				dagoSum: this.payment.kasco.dago,
				vskMovingFromOtherCompany: true,
				okpo: this.insurer.main.okpo,
				nsSum: this.payment.kasco.ns,
				price: this.getKascoPremium,
				kpp: this.insurer.main.kpp,
				osagoPrecalcSended: false,
				vskOtherCompanyText: "",
				vskPayWithoutDocs: true,
				citizenship: "Россия",
				osagoPolicyNumber: "",
				dealId: this.deal.id,
				isCurrentDeal: false,
				InsurancePolicyNumber: "",
				car: this.getCar(),
				companyRequisites,
				fioTechsales: "",
				tnTechsales: "",
				employees: [],
				osagoCrmId: 0,
				kvSogaz: 30,
				segment: 0,
				kv: 30,
				opfId,

				vehicleOwner: {
					companyType: this.payment.owner.isDifferent
						? Info.CompanyType.COMPANY
						: this.insurer.main.companyType,
					juridicalSubject
				},

				plege:
					this.payment.main.pledge === "Залог"
						? KascoService.Pledge.YES
						: KascoService.Pledge.NO,
				plegeDate:
					this.payment.main.pledgeDate ||
					$dayjs().format(configStore.getFormatDates),

				osagoCrmLeadId:
					this.registration.parent[Fields.Parent.OSAGO_CRM_LEAD_ID] || 0,
				osagoCrmParentId:
					this.registration.parent[Fields.Parent.OSAGO_CRM_PARENT_ID] || 0,

				kascoInsuranceCompany: this.getSelectedInsuranceCompanyId(
					KascoService.InsuranceType.KASCO
				),
				osagoInsuranceCompany: this.getSelectedInsuranceCompanyId(
					KascoService.InsuranceType.OSAGO
				),

				// Todo
				ugoriaKascoPolicyId: 0,
				ugoriaOsagoPolicyId: 0,
				ugoriaOsagoCalcId: 0
			}
		}
	}
})
