import { InfoService as InfoServiceApi } from "~/services"
import { Calculator, InfoService, AssetService } from "@common-repo/types/src"

export namespace Info {
	export enum InfoType {
		INCOMPLETE_CONSTRUCTION_TYPES = "incompleteConstructionTypes",
		PLEDGE_AGREEMENT_CATALOG = "pledgeAgreementCatalog",
		ASSET_INSURANCE_OBJECTS = "assetInsuranceObjects",
		FACILITIES_DESCRIPTION = "facilitiesDescription",
		SUBJECTS_OF_FEDERATION = "subjectsOfFederation",
		LOAN_AGREEMENT_CATALOG = "loanAgreementCatalog",
		ASSET_INDUSTRIES_TYPES = "assetIndustriesTypes",
		CONTRACTOR_EXPERIENCE = "contractorExperience",
		SUB_CATEGORY_TS_TYPE = "subcategoryTsType",
		SBS_DOCUMENTS_TYPES = "InsuranceDocumentsTypes",
		DYNAMIC_FRANCHISE = "dynamicFranchise",
		FEDERAL_DISTRICTS = "federalDistricts",
		CONSERVATION_TYPE = "conservationType",
		CAR_DOCUMENT_TYPE = "carDocumentType",
		MACHINERY_GROUPS = "machineryGroups",
		FACILITIES_TYPES = "facilitiesTypes",
		ASSET_INDUSTRIES = "assetIndustries",
		GO_INSURANCE_SUM = "goInsuranceSum",
		CATEGORY_TS_TYPE = "categoryTsType",
		TERRITORY_TYPES = "territoryTypes",
		COUNTRY_CATALOG = "countryCatalog",
		ASSET_FACTORS = "assetFactors",
		CLIENT_TYPES = "clientTypes",
		BANK_FINANCE = "bankFinance",
		BENEFICIARY = "beneficiary",
		REALTY_TYPE = "realtyType",
		INDUSTRIES = "industries",
		WORK_TYPE = "workType",
		TER_BANKS = "terBanks",
		SEGMENTS = "segments",
		BINDINGS = "bindings",
		SBS_OPFS = "InsuranceOpfs",
		REGIONS = "regions",
		FACTORS = "factors",
		CITIES = "cities",
		MODELS = "models",
		REALTY = "realty",
		MARKS = "marks",
		GOSB = "gosb"
	}

	export enum InfoTypeKasco {
		SBS_DOCUMENT_TYPES = "InsuranceDocumentTypes",
		DATA_BY_VIN = "dataByVin",
		CAR_TYPES = "carTypes",
		OPS_LIST = "opsList",
		DAGO = "dago",
		NS = "ns"
	}

	export enum InfoTypeStatic {
		PAYMENT_FREQUENCY = "paymentFrequency",
		SECOND_DOCUMENT = "secondDocument",
		COMPANY_TYPES = "companyTypes",
		USAGE_VEHICLE = "usageVehicle",
		SUBJECT_TYPE = "subjectType",
		BENEFICIARY = "beneficiary",
		CITIZENSHIP = "citizenship",
		PHONE_TYPES = "phoneTypes",
		FRANCHISE = "franchise",
		BASED_ENG = "basedEng",
		GENDERS = "genders",
		BASED = "based",
		BAIL = "bail"
	}

	export type ApiMethod = keyof InfoServiceApi

	export interface IState {
		activeCalculatorType: Calculator.Type | null
		dynamic: StateBlock
		static: StateBlock
	}

	export interface StateBlock {
		[key: string]: InfoService.InfoList
	}

	export type List = InfoService.InfoList

	export type AssetFactor = AssetService.Factor
	export type AssetIndustryType = AssetService.IndustryType
	export type AssetInsuranceObject = AssetService.InsuranceObject

	export enum CompanyType {
		COMPANY = 651,
		PERSON = 1432,
		IP = 652
	}

	export enum SecondDocumentType {
		RESIDENCE_PERMIT = "residencePermit",
		MIGRATION_CARD = "migrationCard",
		WORK_PERMIT = "workPermit"
	}
}
