import { DealService, Response, Info } from "@common-repo/types/src"

export namespace SpectechService {
	type BaseDeal = Omit<DealService.Deal, "personInfo" | "companyRequisites">

	export interface PersonInfo {
		signatoryGenitive: string
		positionGenitive: string
		signatory: string
		document: string
		position: string
		reason: string
		date: string
	}

	export interface Deal extends BaseDeal {
		beneficiaryDocumentListPledge: BeneficiaryDocument[]
		beneficiaryDocumentListLoan: BeneficiaryDocument[]
		beneficiaryRequisites: BeneficiaryRequisites
		companyRequisites: CompanyRequisites
		dealBeneficiaryTerBank: string
		companyType: Info.CompanyType
		isSecurityAssist: boolean
		territories: Territory[]
		multiplyingKoef: number
		companyNameFull: string
		insurancePeriod: number
		personInfo: PersonInfo
		exchangeRate: number
		brokerEmail: string
		installment: number
		crmParentId: number
		brokerName: string
		crmLeadId: number
		franchise: number
		currency: string
		sumZalog: number
		zalog: number
	}

	export interface CompanyRequisites {
		directorCitizenshipId: string | null
		directorIsForeignPerson: boolean
		correspondentAccount: string
		expiryDate: string | null
		groupFL: string | null
		passportOffice: string
		passportDate: string
		personBirth: string
		bankAccount: string
		birthPlace: string
		legalAddress: null // todo
		middleName: string
		firstName: string
		director: string
		lastName: string
		bankInfo: string
		passport: string
		regDate: string
		phone: string
		email: string
		okved: string
		ifns: string
		bik: string
		inn: string
		kpp: string
		ogrn: string
	}

	export interface BeneficiaryRequisites {
		beneficTextarea: string
		beneficiary: number
		brokerPhone: string
		address: string
		city: string
		tb: string
	}

	export type DealResponse = Response<Deal>

	export interface Territory {
		selectedTerritoryType: number | null
		subjectOfFederations: Subjects[]
		cadastralNumber: string
		assetList: AssetItem[]
		office: number | null
		factors: Factors[]
		street: string
		number: number
		house: string
		city: string
		id: number
	}

	export interface AssetItem {
		sumZalog: number | null
		territoryNumber: number
		productionYear: string
		engineNumber: string
		vendorName: string
		sum: number | null
		modelName: string
		keyNum: number
		name: string
	}

	export interface Factors {
		value: boolean
		name: string
		id: number
	}

	export interface Subjects {
		name: string
		id: number
	}

	export interface CalculateResponse {
		InsuranceCalculationId: number
		insuranceCompany: number
		insurancePremium: number
		insuranceCost: number
		assetDetails: string
		insuranceSum: number
		isSuccess: boolean
		message: string
	}

	export interface UploadedTerritory {
		territoryNumber: number
		productionYear: number
		engineNumber: string
		vendorName: string
		modelName: string
		sumZalog: number
		name: string
		sum: number
	}

	export type UploadedTerritoryResponse = Response<UploadedTerritory[]>

	export type BeneficiaryDocument = DealService.BeneficiaryDocument

	export type Territories = Territory[]
}
