import type { Response, DealService } from "@common-repo/types/src"

export namespace EcoService {
	export interface Deal extends DealService.Deal {
		multiplyingCoefficient: number
		employees: any[]
		kpp: string
		reasonDate: string
		personInfoList: PersonInfo[]
		facilitiesTypes: any[]
		price: string | number
		franchise: number
		facilityDescription: FacilityDescription
		facilityName: string
		facilityAddress: string
		facilityForeign: boolean
		facilityDisasterProne: boolean
		facilityWasteStorage: boolean
		industry: {
			id: number
			isStop: boolean
			name: string
		}
		insuranceSum: number | string
		dealContact: DealService.DealContact
	}

	export interface PersonInfo {
		citizenship: string
		fio: string
		id: number
		inn: string
		isForeignPerson: false
		isSignatory: true
		legalAddress: LegalAddress
		passport: Passport
		secondDocument: string
	}

	export interface LegalAddress {
		addressFull: string
		building: string
		cityKladr: string
		cityPlace: string
		country: string
		federalDistrict: string
		flat: string
		house: string
		kladr: string
		office: string
		region: string
		street: string
		useAddressFull: true
	}

	export interface Passport {
		birthDate: string
		birthPlace: string
		passportDivisionCode: string
		passportIssueDate: string
		passportOffice: string
		passportSeriesNumber: string
	}

	export interface SendCommercialOffer {
		dealId: number
		email: string
	}

	export interface PrefetchedDeal extends Deal {}

	export interface FacilityDescription {
		id: number
		name: string
	}

	export type DealResponse = Response<Deal>
}
