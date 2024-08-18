import { DealService, Response } from "@common-repo/types/src"

export namespace AssetService {
	export interface Deal extends DealService.Deal {
		beneficiaryDocumentListPledge: BeneficiaryDocument[]
		beneficiaryDocumentListLoan: BeneficiaryDocument[]
		personInfoList: DealService.PersonInfo[]
		territories: Territory[]
		insuranceRisks: Risk[]

		contractInfo: ContractInfo
		brokerInfo: BrokerInfo

		oldTermsProlongation: boolean
		beneficiaryTextSogaz: string
		beneficiaryTextInsurance: string
		dealId: number | null
		fioTechsales: string
		tnTechsales: string
		crmParentId: number
		beneficiary: number
		crmLeadId: number
		segment: number
		crmId: number
		city: string
		kpp: string
		id: number
	}

	export type DealResponse = Response<Deal>

	export interface Territory {
		incompleteConstructionType: number
		subjectOfFederation: number
		conservationType: number
		federalDistrict: number
		populationArea: string
		yearOfBuilding: number
		sogazRiskClass: number
		InsuranceRiskClass: string
		selectedIndustryActivity: number
		selectedIndustry: number
		realtyType: number
		address: string
		realty: number
		number: number
		area: string
		id: number

		insuranceObjects: InsuranceObject[]
		assetList: AssetItem[]
		factors: Factor[]
	}

	export interface Factor {
		id: number
		name: string
		orderNumber: number
		selected: boolean
		value: boolean
	}

	export interface AssetItem {
		description: string
		insuranceCost: number
		insuranceObjectId: number
		insuranceObjectName: string
		insuranceSum: number
		inventoryNumber: string
		isBuildings: boolean
		isTitul: boolean
		keyNum: number
		square: number
		subInsuranceObjectId: number
		subInsuranceObjectName: string
	}

	export interface Risk {
		orderNumber: number
		selected: boolean
		name: string
		id: number
	}

	export interface InsuranceObject extends Risk {
		subObjects: InsuranceObject[]
		isChildRequired: boolean
		sumZalog: number
		isLock: boolean
		sum: number
	}

	export type InsuranceSubObject = Omit<InsuranceObject, "subObjects">

	export interface IndustryType {
		sogazRiskGroup: number
		InsuranceRiskGroup: number
		industryId: number
		name: string
		id: number
	}

	export type InsuranceSubObjectsOption = Omit<
		InsuranceSubObject,
		"id" | "name"
	> & {
		value: number
		label: string
	}

	export type Territories = Territory[]

	export type InsuranceKey = "insurancePremium" | "cv" | "isSelected"

	export interface InsuranceParams {
		company: InsuranceCompany
		key: InsuranceKey
	}

	export enum InsuranceCompany {
		SOGAZ = "sogaz",
		SBS = "Insurance"
	}

	export enum InsuranceCompanyName {
		SOGAZ = "Согаз",
		SBS = "Страхование"
	}

	export interface BeneficiaryDocument {
		customDocumentType: string
		documentNumber: string
		isCustomType: boolean
		documentDate: string
		documentType: string
	}

	export interface ContractInfo {
		multiplyingCoefficientTitul: number
		multiplyingCoefficient: number
		insurancePremiumSogaz: number
		insurancePremiumTitul: number
		insurancePremiumInsurance: number
		insuranceSumTitul: number
		isContainsTitul: boolean
		insurancePremium: number
		insuranceCompany: number
		policyNumber: string
		insuranceSum: number
		installment: number
		startDate: string
		pledgeSum: number
		closeDate: string
		franchise: number
		kvTitul: number
		endDate: string
		pledge: number
		kv: number
	}

	export interface BrokerInfo {
		owner: string
		phone: string
	}

	export interface InsurancePayload extends InsuranceParams {
		value: string | number | boolean
	}
}
