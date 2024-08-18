import { DealService, Response } from "@common-repo/types/src"

export namespace KascoService {
	export type InsuranceKey = "insurancePremium" | "cv" | "isSelected"

	export enum InsuranceType {
		KASCO = "kasco",
		OSAGO = "osago"
	}

	export enum InsuranceCompany {
		SBS = "Insurance",
		VSK = "vsk"
	}

	export enum InsuranceCompanyName {
		SBS = "Страхование",
		VSK = "ВСК"
	}

	export const enum Pledge {
		YES = 83,
		NO = 553
	}

	export interface Deal extends DealService.Deal {
		car: Car
		carRegion: number
		employees: any[]
		kpp: string
		citizenship: string
		companyAddressKladr: string
		creditDoc: string
		creditTime: string
		crmLeadId: number
		crmParentId: number
		currentPolisNumber: string
		installment: boolean
		insuranceCompany: number
		insuranceKasco: boolean
		insuranceOsago: boolean
		isCurrentDeal: boolean
		franchise: number
		kvInsurance: number
		kvSogaz: number
		kvVsk: number
		okpo: string
		opfId: number
		osagoCrmId: number
		osagoCrmLeadId: number
		osagoCrmParentId: number
		osagoDocumentTypeDate: string
		osagoDocumentTypeId: number
		osagoDocumentTypeValue: string
		osagoEndDate: string
		osagoInsurancePremium: number
		osagoKv: number
		osagoPolicyNumber: string
		osagoPrecalcSended: boolean
		osagoInsuranceCalculationId: string
		osagoInsuranceOpfName: string
		osagoInsurancePolicyId: string
		osagoStartDate: string
		osagoStatus: number
		paymentOrderDate: string
		paymentOrderNumber: string
		plege: Pledge
		plegeDate: string
		plegeDoc: string
		polisNumber: string
		postAddress: string
		reasonDate: string
		InsuranceCalculationId: string
		InsurancePaymentPlan: InsurancePaymentPlan[]
		InsurancePolicyId: string
		InsurancePolicyNumber: string
		vskMovingFromOtherCompany: boolean
		vskOtherCompanyText: string
		vskPayWithoutDocs: boolean
		personInfoList: DealService.PersonInfo[]
		vehicleOwner: {
			companyType: number
			juridicalSubject: JuridicalSubject
		}
	}

	export interface InsurancePaymentPlan {
		date: string
		number: number
		sum: number
	}

	export interface Car {
		carMarkId: number
		carModelId: number
		chassisNumber: string
		color: string
		customCar: boolean
		customMark: string
		customModel: string
		diagnosticCardIssueDate: string
		diagnosticCardNumber: string
		enginePower: number
		fullSum: number
		inspected: boolean
		insurSum: number
		isBuyRecently: boolean
		isRightHand: boolean
		maxMass: string
		mileage: number
		multiDrive: boolean
		new: boolean
		opsId: number
		passCount: number
		pts: string
		ptsCarType: number
		ptsDate: string
		regSign: string
		taxi: boolean
		trailer: boolean
		usage: number
		vin: string
		vskBadPetrol: boolean
		vskHydro: boolean
		year: number
	}

	export interface JuridicalSubject {
		fullName: string
		inn: string
		isResident: boolean
		kpp: string
		ogrn: string
		opf: string
		shortName: string
		citizenship: string
		document: {
			issueCountry: string
			issueDate: string
			issuePlace: string
			number: string
			series: string
			type: number
		}
		address: {
			address: string
			building: string
			country: string
			district: string
			fiasId: string
			house: string
			locality: string
			localityCodeKladr: number
			region: string
			street: string
		}
	}

	export interface DataByVin {
		actualCostMax: number
		actualCostMin: number
		allowWeight: number
		bodyNumber: string | null
		licencePlate: string | null
		makerKey: string | null
		manufactureYear: number
		mark: string | null
		markInsuranceCode: string | null
		model: string | null
		modelKey: string | null
		motorWertId: string | null
		powerHorses: number
		powerKwt: number
		seatCount: number
		vehicleCategory: string | null
		vehicleCode: string | null
		vehicleDocuments: string | null
		vin: string
	}

	export interface DataByVinResponse {
		businessData: {
			vehicle: DataByVin
		}
		isSuccess: boolean
	}

	export enum SubjectType {
		COMPANY = "Ul",
		FL = "Fl",
		IP = FL,
		DEFAULT = ""
	}

	export interface KascoPayload extends OsagoPayload {
		dealOwner: string
		franchiseId: number
		installment: boolean
		insurancePrice: number
		kvDiscount: number
		prolongation: boolean
		terBank: string
	}

	export interface KascoImportPayload extends KascoPayload {
		calculationResponse: {
			policyId: string
			calcId: string
			insPremTotal: number
			paymentsPlan: {
				payments: InsurancePaymentPlan[]
			}
		}
	}

	export interface OsagoPayload {
		calcId: string
		car: OsagoPayloadCar
		endDate: string
		insurant: {
			juridicalSubject: OsagoPayloadJuridical
			physicalSubject: OsagoPayloadPhysical
			preapproved: boolean
			subjectType: SubjectType
		}
		owner: {
			juridicalSubject: OsagoPayloadJuridical
			physicalSubject?: OsagoPayloadPhysical
			preapproved: boolean
			subjectType: SubjectType
		}
		ownerIsInsurant: boolean
		policyDate: string
		policyId: string
		startDate: string
	}

	export interface OsagoPayloadCar {
		actualPrice: number
		bankBik: string
		category: string
		document: {
			issueDate: string
			number: string
		}
		pledgeDocument: {
			creditDocumentDate: string
			creditDocumentNumber: string
			pledgeDocumentDate: string
			pledgeDocumentNumber: string
		}
		customMark: string
		customModel: string
		manufactureYear: number
		mark: string
		markModelId: string
		maxMass: number
		mileage: number
		model: string
		new: boolean
		numberOfSeats: number
		plege: boolean
		power: number
		regNumber: string
		region: string
		securitySystem: string
		trailer: boolean
		usage: string
		vin: string
	}

	export interface JuridicalFactAddress {
		address: string
		building: string
		country: string
		fiasId: string
		house: string
		locality: string
		localityCodeKladr: string | number
		region: string
		street: string
		district?: string
	}

	export interface JuridicalDocument {
		type: string
		series: string
		number?: string
		issueDate: string
		issuePlace: string
		issueCountry: string
	}

	export interface OsagoPayloadJuridical {
		fullName: string
		inn: string
		kpp: string
		ogrn: string
		opf: string
		opfId?: string
		phone: string
		shortName: string
		citizenship: string
		isResident?: boolean
		document: JuridicalDocument
		email: string
		factAddress: JuridicalFactAddress
	}

	export interface OsagoPayloadPhysical {
		birthDate: string
		birthPlace: string
		citizenship: string
		document: JuridicalDocument
		email: string
		factAddress: JuridicalFactAddress
		firstName: string
		inn: string
		lastName: string
		middleName: string
		ogrn: string
		phone: string
	}

	export interface PrefetchedDeal extends Deal {}

	export interface InsuranceResponse {
		calcId: string
		policyId: string
		insPremTotal: number
		isSuccess?: boolean
		IsSuccess?: boolean
		errors?: InsuranceError[] | null
		Errors?: InsuranceError[] | null
	}

	export interface IBrokerResponse extends InsuranceResponse {
		paymentsPlan: {
			payments: { date: string; number: number; sum: number }[]
		}
	}

	export interface InsuranceIssueResponse extends InsuranceResponse {
		Number?: string
		number?: string
		Url?: string
		url?: string
	}

	export enum InsuranceOsagoPaymentStatus {
		PAYMENT_PREPARATION = "PAYMENT_PREPARATION",
		ISSUE_FINALIZATION = "ISSUE_FINALIZATION",
		ISSUE_PREPARATION = "ISSUE_PREPARATION",
		ISSUE_SUCCESSFUL = "ISSUE_SUCCESSFUL",
		ISSUE_ERROR = "ISSUE_ERROR"
	}

	export interface InsurancePaymentResponse extends InsuranceResponse {
		state?: InsuranceOsagoPaymentStatus
		State?: InsuranceOsagoPaymentStatus
	}

	export enum InsuranceCompanyValue {
		NOT_SELECTED = 0,
		EADVOCATES = 5,
		ABSOLUTE = 9,
		ASORTI = 7,
		INGOS = 2,
		SOGAZ = 4,
		RESO = 6,
		ALFA = 8,
		SBS = 1,
		VSK = 3
	}

	export type InsuranceError = InsuranceService.Error

	export interface Opf {
		id: number
		opfCode: number
		opfName: string
		InsuranceCode: number
		InsuranceName: string
	}

	export interface Preapproved {
		isPreapproved: boolean
		crmLeadGrade: string
		crmLeadId: string
	}

	export interface OsagoPaymentParams {
		paymentNumber: string
		paymentDate: string
		policyId: string
	}

	export type OpfResponse = Response<Opf>

	export type PreapprovedResponse = Response<Preapproved>

	export type DealResponse = Response<Deal>
}
