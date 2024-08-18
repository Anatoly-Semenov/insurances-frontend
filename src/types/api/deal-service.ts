import { Response, Info, Nullable, InfoService } from "@common-repo/types/src"

export namespace DealService {
	export interface Deal extends DealOptional {
		passport?: DealService.Passport
		commission?: number | bigint
		companyFullName?: string
		cityId?: number | bigint
		city?: number | bigint
		personalName?: string
		companyName?: string
		birthPlace?: string

		///  Id Сделки
		dealId: number
		/// Ответственный по сделке
		owner: string
		///  Реквизиты компании
		companyRequisites: CompanyRequisites
		///  Дата начала договора
		startDate: string
		///  Дата окончания договора
		endDate: string
		/// Список  Гендиректоров
		personInfo?: PersonInfo[] | PersonInfo
		/// GUID проверки по 115-ФЗ
		verificationGuid: string
		///  Тип клиента.
		clientType: number
		///  Тип клиента банка/ Сегмент
		clientTypeBank: number
		/// Фио КМ/КИ
		fioKm?: string
		/// Табельный номер Км
		tnKm?: string
		///  Госб
		gosb: number
		/// ТерБанк
		terBank: number
		/// Регион
		region: number
		///  ВСП
		vsp: string
		// Тип компании
		insured?: number
	}

	export interface DealOptional {
		/// ФИО Техсейлс
		fioTechsales?: string
		///  Табельный номер techsales
		tnTechsales?: string
		/// Данные клиента.
		dealContact?: DealContact
		///  Подписанты страхователя
		signingPersonInfo?: SigningPersonInfo
		///  Статус сделки
		status?: Status
		/// Коммисия  брокера
		kv?: number
		///  Цена для клиента
		price?: number | string
		/// Город
		city?: number
		brokerEmail?: string
		brokerName?: string
		segment?: number
	}

	export interface DealContact {
		fio: string
		/// Документ -основание
		reason: string | number
		/// Дата договора
		reasonDate: string
		/// Описание документа
		document: string
		/// Email клиента
		email: string
		/// Телефон
		phone: string
	}

	export interface SigningPersonInfo {
		fio: string
		/// Инн подписанта
		inn: string
		/// Адрес регистрации
		legalAddress: LegalAddress
		/// Паспортные данные
		passport: SigningPassport
		/// Должность
		position: string
		/// Должность в родительном падеже
		positionGenitive: string
		/// Фио подписанта
		signatory: string
		/// Фио в родительном падеже
		signatoryGenitive: string
		/// Должность
		verifyPos?: string
	}

	export interface SigningPassport {
		passportDivisionCode: string
		passportSeriesNumber: string
		validityPeriodEnd?: string
		passportIssueDate: string
		passportOffice: string
		birthPlace: string
		birthDate: string
	}

	export interface Passport {
		birthday: string
		passportDate: string
		passportSeries: string
		passportDivisionCode: string
		passportOffice: string
		passportNumber?: string
		personSex?: number | bigint
	}

	export interface PersonInfo {
		legalAddress: DealService.LegalAddress
		passport: DealService.SigningPassport
		secondDocument: SecondDocument
		isForeignPerson: boolean
		isSignatory: boolean
		citizenship: string
		fio: string
		id: number
		inn: string
	}

	export interface SecondDocumentObj {
		activityType: string
		issueDate: string
		office: string
		seriesNumber: string
		type: string
		validityPeriodEnd: string
		validityPeriodStart: string
	}

	export type SecondDocument = string | null | Nullable<SecondDocumentObj>

	export enum Status {
		// Черновик
		IN_PROCESS = 10,
		// Закрыто, не отправлено в ЦРМ
		CLOSED = 20,
		// Закрыто и отправлено в ЦРМ
		SENDED = 30,
		// Ошибка
		ERROR = 40,
		// Резервный статус
		CUSTOM = 50
	}

	export interface CompanyRequisites {
		companyType?: Info.CompanyType
		companyAddressKladr?: string
		correspondentAccount: string
		legalAddress?: LegalAddress
		companyFullName?: string
		ogrnIssueDate?: string
		companyName?: string
		bankAccount: string
		bankInfo: string
		regDate: string
		email?: string
		phone?: string
		okonx?: string
		okved: string
		okpo?: string
		opf?: string
		ogrn: string
		ifns: string
		bik: string
		inn: string
		kpp: string
	}

	export interface LegalAddress {
		useAddressFull?: boolean
		federalDistrict?: string
		isInsured?: boolean
		addressFull: string
		postalCode?: string
		cityKladr?: string
		cityPlace: string
		country?: string
		building: string
		region?: string
		kladr?: string
		street: string
		office: string
		house: string
		fias?: string
		flat?: string
	}

	export interface ArchiveDeal {
		statusWrong: ArchiveStatusWrong
		statusCrm: string
		type: string
		date: string
		href: string
		name: string
		cid: string
		crm: string
	}

	export enum StatusWrong {
		IN_PROCESS = 10,
		CLOSED = 20,
		SENDED = 30,
		ERROR = 40,
		CUSTOM = 50
	}

	export const enum ArchiveStatusWrong {
		CLOSED = "Закрыто, не отправлено в ЦРМ",
		SENDED = "Закрыто и отправлено в ЦРМ",
		CUSTOM = "Резервный статус",
		IN_PROCESS = "Черновик",
		FINISHED = "Завершена",
		ERROR = "Ошибка"
	}

	export interface ProgramModel {
		insurancePremium: number | bigint
		insuranceAmount: number | bigint
		options: any
		tariff: any
		nid: number
	}

	export interface AvailableTariff {
		description: string
		selected: boolean
		tariff: number
	}

	export type OptionsByTariff = OptionsByTariff[]

	export interface OptionByTariffs {
		entity: {
			options: Array<{
				option: number
				description: string
			}>
			insuranceSummList: number[]
		}
		isSuccess: true
		message: string | null
	}

	export type AvailableTariffResponse = Response<DealService.AvailableTariff[]>
	export type OptionsByTariffResponse = Response<DealService.OptionsByTariff>

	export type ArchiveDealsResponse = Extract<
		Omit<Response<ArchiveDeal>, "entity">,
		{ entityActive: ArchiveDeal[]; entityAll: ArchiveDeal[] }
	>

	export interface Industries {
		isStop: boolean
		name: string
		id: number
	}

	export interface FacilitiesTypes {
		name: string
		id: number
	}

	export interface FacilitiesDescription {
		name: string
		id: number
	}

	export interface CalculatePayload {
		multiplier: string | number
		isProlongation: boolean
		insuranceSum: number
		commission: number
		tariff?: number
	}

	export interface RegistrationContractData {
		clientTypeBank: number
		clientType: number
		terBank: number
		fioKm: string
		tnKm: string
		gosb: number
		vsp: string
	}

	export interface BeneficiaryDocument {
		customDocumentType: string
		documentDate: string
		documentNumber: string
		documentType: string
		isCustomType: boolean
		number: number
	}

	export type IndustriesResponse = Response<DealService.Industries[]>

	export type FacilitiesTypesResponse = Response<DealService.FacilitiesTypes[]>

	export type FacilitiesDescriptionResponse = Response<
		DealService.FacilitiesDescription[]
	>

	export interface BaseApiService<D = any> {
		fetchFacilitiesDescriptions(): Promise<FacilitiesDescriptionResponse>
		generatePreCalculate(dealId: number, email: string): Promise<any>
		fetchOptionsByTariff(tariff: number): Promise<OptionsByTariff>
		fetchDeal(dealId: string | number): Promise<Response<any>>
		fetchAvailableTariffs(): Promise<AvailableTariffResponse>
		fetchFacilitiesTypes(): Promise<FacilitiesTypesResponse>
		fetchCountryCatalog(): Promise<InfoService.Info>
		fetchIndustries(): Promise<IndustriesResponse>
		deleteDeal(id: string | number): Promise<any>
		fetchDeals(): Promise<ArchiveDealsResponse>
		saveDeal(body: D): Promise<Response<any>>
		calculate(payload: any): Promise<any>
		closeDeal(body: D): Promise<any>
	}
}
