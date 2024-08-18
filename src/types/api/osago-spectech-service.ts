import { DealService, KascoService, Response } from "@common-repo/types/src"

export namespace OsagoSpectechService {
	export interface CompanyRequisites {
		legalAddress: CompanyRequisitesAddress
		correspondentAccount: string
		companyAddressKladr: string
		companyFullName: string
		ogrnIssueDate: string
		postAddress: string
		companyName: string
		companyType: number
		bankAccount: string
		bankInfo: string
		regDate: string
		okved: string
		fioKm: string
		ifns: string
		ogrn: string
		okpo: string
		tnKm: string
		inn: string
		kpp: string
		bik: string
	}

	interface CompanyRequisitesAddress {
		federalDistrict: string
		useAddressFull: boolean
		addressFull: string
		cityKladr: string
		cityPlace: string
		building: string
		country: string
		office: string
		region: string
		street: string
		house: string
		kladr: string
		flat: string
		area: string
	}

	export interface PersonInfo {
		address: Address
		isForeignPerson: boolean
		isSignatory: boolean
		citizenship: string
		fio: string
		inn: string
		passport: {
			passportDivisionCode: string
			passportSeriesNumber: string
			validityPeriodEnd: string
			passportIssueDate: string
			passportOffice: string
			birthPlace: string
			birthDate: string
		}
		secondDocument: {
			validityPeriodStart: string
			validityPeriodEnd: string
			seriesNumber: string
			activityType: string
			issueDate: string
			office: string
			type: string
		}
	}

	type BaseDeal = Omit<
		DealService.Deal,
		"companyRequisites" | "personInfoList"
	> & {
		companyRequisites: CompanyRequisites
		personInfoList: PersonInfo[]
	}

	export interface Deal extends BaseDeal {
		personInfoList: PersonInfo[]
		InsurancePolicyInfo: InsurancePolicyInfo
		currentPolicyNumber: string
		paymentOrderNumber: string
		vehicleOwner: VehicleOwner
		insuranceCompany: number
		isCurrentDeal: boolean
		draftSendDate: string
		draftSended: boolean
		crmParentId: number
		crmLeadId: number
		crmId: number
		car: Car

		ownerIsInsurant?: boolean
	}

	export interface VehicleOwner {
		juridicalSubject: Subject
		physicalSubject: Subject
		companyType: number
	}

	export interface CarDocument {
		issueDate: string
		number: string
		series: string
		type: number
	}

	export interface Car {
		insurancePremium: number
		document: CarDocument
		chassisNumber: string
		isRightHand: boolean
		customModel: string
		enginePower: number
		subcategory: number
		bodyNumber: string
		carModelId: number
		customMark: string
		customCar: boolean
		carMarkId: number
		trailer: boolean
		category: number
		regSign: string
		maxMass: string
		usage: string
		year: number
		vin: string
	}

	export interface CarInfo {
		documentInfo: CarDocument
		manufactureYear: number
		chassisNumber: string
		customModel: string
		subcategory: number
		bodyNumber: string
		customMark: string
		regNumber: string
		trailer: boolean
		category: number
		model: string
		power: number
		usage: string
		mark: string
		vin: string
	}

	export interface SubjectDocument {
		issueCountry: string
		issuePlace: string
		issueDate: string
		number: string
		series: string
		type: string
	}

	export interface Address {
		useAddressFull: boolean
		federalDistrict: string
		addressFull: string
		cityKladr: string
		cityPlace: string
		building: string
		country: string
		region: string
		street: string
		office: string
		house: string
		kladr: string
		flat: string
		area: string
	}

	export interface FactAddress {
		localityCodeKladr: string
		building: string
		district: string
		locality: string
		country: string
		region: string
		street: string
		fiasId: string
		house: string
	}

	export interface Subject {
		document: SubjectDocument
		address: Address
		citizenship?: string
		fullName?: string
		phone?: string
		email?: string
		ogrn: string
		opf?: string
		kpp?: string
		inn: string
	}

	type SubjectOptional = "fullName" | "phone" | "email" | "opf" | "kpp"

	export interface InsurancePolicyInfo {
		documentTypeValue: string
		documentTypeDate: string
		documentTypeId: number
		calculationId: string
		policyNumber: string
		startDate: string
		policyId: string
		opfName: string
		endDate: string
		opfId: number
		kv: number
	}

	export interface InsurancePaymentDocument {
		number: string
		date: string
	}

	export interface LoadPaymentPayload {
		paymentDocument: InsurancePaymentDocument
		policyId: string
	}

	export interface CalculatePayload {
		ownerIsInsurant: boolean
		insurant: OwnerData
		policyDate: string
		startDate: string
		owner: OwnerData
		endDate: string
		carInfo: Car
	}

	export interface OwnerData {
		physicalPerson: PhysicalPerson
		subjectType: KascoService.SubjectType
		juridicalSubject: JuridicalSubjectCalculate
	}

	export interface JuridicalSubject extends Subject {
		shortName?: string
	}

	export type JuridicalSubjectCalculate = Omit<JuridicalSubject, "address"> & {
		factAddress: FactAddress
	}

	export interface PhysicalPerson extends Exclude<Subject, SubjectOptional> {
		middleName: string
		firstName: string
		birthDate: string
		lastName: string
	}

	export interface SaveDraftCrmPayload {
		insuranceTypeCode: string
		crmParentId: number
		clientType: number
		crmLeadId: number
		token: string
		owner: string
		crmId: number
		inn: string
	}

	export interface Draft {
		paymentOrderDate: string
		paymentOrderNumber: string
	}

	export type DraftResponse = Response<Draft>

	export type InsuranceResponse = KascoService.InsuranceResponse

	export type IssueResponse = Omit<Response<null>, "entity">
}
