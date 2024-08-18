import type { Response, DealService } from "@common-repo/types/src"

export namespace BreakService {
	export interface Deal extends DealOptional {
		multiplyingKoef: number
		assetAddress: string
		insSum: number
		reasonDate: string
		kpp: string
		employees: any[]
		personInfoList: DealService.PersonInfo[]
		dealContact: DealService.DealContact
	}

	export interface DealOptional extends DealService.Deal {}

	export type DealResponse = Response<Deal>
}
