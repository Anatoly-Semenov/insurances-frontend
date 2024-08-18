import { Response } from "@common-repo/types/src"

export namespace AgroService {
	export interface Deal {
		totalInsurancePremiumToPayEmergencyRisk: number
		totalInsurancePremiumEmergencyRisk: number
		totalInsuranceCostEmergencyRisk: number
		totalInsuranceSumEmergencyRisk: number
		totalInsurancePremium50Percent: number
		calculateEmergencyRisk: boolean
		totalInsurancePremium: number
		totalInsuranceCost: number
		totalInsuranceSum: number
		cultures: Culture[]
		subjectType: number
		createDate: string
		factPlace: string
		regionId: number
		owner: string
		inn: string
		id: number
	}

	export type CalculatePayload = Omit<
		Deal,
		| "totalInsurancePremiumToPayEmergencyRisk"
		| "totalInsurancePremiumEmergencyRisk"
		| "totalInsuranceCostEmergencyRisk"
		| "totalInsuranceSumEmergencyRisk"
		| "totalInsurancePremium50Percent"
		| "totalInsurancePremium"
		| "totalInsuranceCost"
		| "totalInsuranceSum"
	>

	export type DealResponse = Response<Deal>

	export interface CultureInfo {
		bindingId: number | null
		cultureName: string
		id: number | null
		year1: string
		year2: string
		year3: string
		year4: string
		year5: string
	}

	export interface Culture {
		insurancePremiumToPayEmergencyRisk: number
		insurancePremiumTotalEmergencyRisk: number
		relationInsuranceSumToCostRange: number[]
		relationInsuranceSumToCost: number
		insuranceCostEmergencyRisk: number
		insuranceSumEmergencyRisk: number
		insurancePremium50Percent: number
		franchiseEmergencyRisk: number
		salePriceEmergencyRisk: number
		insurancePremiumTotal: number
		areaHaEmergencyRisk: number
		tariffEmergencyRisk: number
		plantingStartDate: string
		last5YearsHarvest: number
		harvestStartDate: string
		plantingEndDate: string
		harvestEndDate: string
		insuranceCost: number
		insuranceSum: number
		cultureName: string
		salePrice: number
		bindingId: number
		franchise: number
		tariff: number
		keynum: number
		areaHa: number
		year1: number
		year2: number
		year3: number
		year4: number
		year5: number
		risks: any[]
		id: number
	}

	export interface CalculateAllRisks {
		totalInsurancePremiumToPayEmergencyRisk: number
		totalInsurancePremiumEmergencyRisk: number
		totalInsurancePremium50Percent: number
		totalInsuranceCostEmergencyRisk: number
		totalInsuranceSumEmergencyRisk: number
		totalInsurancePremium: number
		totalInsuranceCost: number
		totalInsuranceSum: number
		subjectType: number
		cultures: Culture[]
		regionId: number
	}

	export type CalculateAllRisksResponse = Response<CalculateAllRisks>

	export type Cultures = CultureInfo[]

	export enum FertilityComponentType {
		FERTILITY = "fertility",
		EMERGENCY = "emergency",
		DETAILS = "details"
	}
}
