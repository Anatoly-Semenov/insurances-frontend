import type { Response, DealService } from "@common-repo/types/src"

export namespace CyberService {
	export interface Deal extends DealService.Deal {
		multiplier: number | bigint
		isProlongation: boolean
		prolongationDocNumber: string
		programs: DealService.ProgramModel[]
	}

	export interface PrefetchedDeal extends Deal {
		fias: null | string
		isMedicalCertificateOptionIncluded: boolean
		isReplacement: boolean
		kladr: null | string
		price: string | number
	}

	export interface PersonInfo {
		date: string
		document: string
		position: string
		positionGenetive: string
		reason: string
		signatory: string
		signatoryGenitive: string
	}

	export type DealResponse = Response<Deal>
}
