import { DealService, InfoService, Response } from "@common-repo/types/src"

export namespace MotorService {
	export interface Deal extends DealService.Deal {
		vehicles: Vehicle[]
	}

	export interface VehiclePassport {
		issueDate: string
		number: string | null
	}

	export interface TableRow {
		insurancePremiumOsago: number
		registrationNumber: string
		chassisNumber: string
		insuranceSum: number
		startDate: string
		issueYear: number
		isKasco: boolean
		isOsago: boolean
		isNew: boolean
		brand: string
		model: string
		vin: string
		id: number
	}

	type VehicleRowExclude = "brand" | "model" | "isKasco" | "isOsago" | "id"

	type VehicleRow = Exclude<TableRow, VehicleRowExclude>

	export interface Vehicle extends VehicleRow {
		passport: VehiclePassport
		registrationCertificate: VehiclePassport
		modelsList: []
		avtocodRegion: string
		bodyColor: string | null
		category: number | string
		crmId: number
		customMark: string
		customModel: string
		customVehicle: boolean
		dangerousCargo: boolean
		draftsSentToClient: boolean
		endDate: string
		endDateCasco: string
		endDateOsago: string
		enginePower: number
		id: number | null
		index: number
		insuranceCasco: true
		insuranceOsago: boolean
		insurancePremiumCasco: number
		isNew: boolean
		isRightHand: boolean
		markId: number | string
		maxMass: number
		mileage: number
		modelId: number | string
		originalDocumentsSentToBrokerAndClient: boolean
		originalName: string
		passengerSeatsCount: number
		paymentLoaded: boolean
		policyNumber: string
		ptsIssueDate: string
		ptsSeriesNumber: string
		registrationRegion: number
		registrationRegionString: string
		rsaDraftCreated: boolean
		InsuranceCalcId: string
		InsuranceError: boolean
		InsuranceIssueStatus: string
		InsurancePolicyId: string
		startDateCasco: string
		startDateOsago: string
		tableId: number
		totalCost: number
		trailer: boolean
		usage: number | string
	}

	export interface Info extends InfoService.Info {
		deleted: boolean
	}

	export interface InfoObject {
		[key: string]: InfoService.Info[] | Info[]
	}

	export enum InfoType {
		MARKS = "marks",
		MODELS = "models",
		CATEGORIES = "categories"
	}

	export type InfoResponse = Response<Info>

	export type DealResponse = Response<Deal>
}
