import type { Response, VerificationService } from "@common-repo/types/src"

export namespace InfoService {
	export interface TerBank {
		name: string
		id: number
	}

	export interface Info {
		id: number | string
		name: string
	}

	export interface ModelInfo extends Info {
		insuredInInsurance: boolean
		InsuranceModelName: string
		InsuranceMarkName: string
		InsuranceId: string
	}

	export type InfoList = Info[]

	export type InfoResponse = Response<InfoList>

	export type ModelsResponse = Response<ModelInfo>

	export interface DataByBik {
		data: DataByBikData
		unrestricted_value: string
		value: string
	}

	export interface DataByBikData {
		address: VerificationService.SuggestionDataAddresses
		treasury_accounts: string | null
		correspondent_account: string
		registration_number: string
		state: DataByBikDataState
		name: DataByBikDataName
		opf: DataByBikDataOpf
		phones: string | null
		payment_city: string
		okpo: string | null
		cbr: string | null
		rkc: string | null
		swift: string
		bic: string
		inn: string
		kpp: string
	}

	export interface DataByBikDataName {
		payment: string | null
		short: string | null
		full: string | null
	}

	export interface DataByBikDataOpf {
		short: string | null
		type: string | null
		full: string | null
	}

	export interface DataByBikDataState {
		liquidation_date: string | null
		registration_date: string | null
		actuality_date: number
		status: string | null
		code: string | null
	}

	export type DataByBikResponse = {
		suggestions: DataByBik[]
	}
}
