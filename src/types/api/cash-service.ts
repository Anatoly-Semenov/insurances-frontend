import { DealService, Response } from "@common-repo/types/src"

export namespace CashService {
	export interface Deal extends DealService.Deal {}

	export type DealResponse = Response<Deal>
}
