import type { Response } from "@common-repo/types/src"

export namespace VerificationService {
	export interface PersonInfo {
		BirthDate: string
		BirthPlace: string
		FullName: string
		Passport: string
	}

	export interface CompanyPayload {
		ApiClientGuid: string
		PersonInfo: PersonInfo[]
		Query: {
			query: string
		}
	}

	export interface VerificationInfo {
		verificationGuid: string
		isAllPermitted: boolean
		message: string | null
	}

	export interface Suggestion {
		value: string
		unrestricted_value: string
		data: SuggestionData
	}

	export interface Company {
		companyInfo: {
			suggestions: Suggestion[]
		}
		verificationInfo: VerificationInfo
	}

	export type CompanyResponse = Response<Company>

	export interface Manager {
		ogrn: string | null
		inn: string
		name: string
		fio: {
			surname: string
			name: string
			patronymic: string
			gender: string
			source: string
		}
		post: string
		hid: string
		type: string
	}

	export interface SuggestionData {
		kpp: string
		management: {
			name: string
			post: string
		}
		managers: Manager[]
		branch_type: string
		branch_count: number
		hid: string
		type: string
		state: {
			status: string
			actuality_date: number
			registration_date: number
			liquidation_date: string | null
		}
		opf: {
			type: string
			code: string
			full: string
			short: string
		}
		name: {
			full_with_opf: string
			short_with_opf: string
			latin: string | null
			full: string
			short: string
		}
		inn: string
		ogrn: string
		okpo: string
		okved: string
		address: SuggestionDataAddresses
		ogrn_date: number
		okved_type: string
		documents: {
			ftsRegistration: {
				series: string
				number: string
				issueDate: string
			}
			ftsReport: {
				series: string | null
				number: string | null
				issueDate: string
			}
		}
	}

	export interface SuggestionDataAddresses {
		value: string
		unrestricted_value: string
		data: {
			postal_code: string
			country: string
			region_fias_id: string
			region_kladr_id: string
			region_with_type: string
			region_type: string
			region_type_full: string
			region: string
			area_fias_id: string | null
			area_kladr_id: string | null
			area_with_type: string | null
			area_type: string | null
			area_type_full: string | null
			area: string | null
			city_fias_id: string
			city_kladr_id: string
			city_with_type: string
			city_type: string
			city_type_full: string
			city: string
			city_area: string
			city_district_fias_id: string | null
			city_district_kladr_id: string | null
			city_district_with_type: string
			city_district_type: string
			city_district_type_full: string
			city_district: string
			settlement_fias_id: string | null
			settlement_kladr_id: string | null
			settlement_with_type: string | null
			settlement_type: string | null
			settlement_type_full: string | null
			settlement: string | null
			street_fias_id: string
			street_kladr_id: string
			street_with_type: string
			street_type: string
			street_type_full: string
			street: string
			house_fias_id: string
			house_kladr_id: string
			house_type: string
			house_type_full: string
			house: string
			block_type: string | null
			block_type_full: string | null
			block: string | null
			flat_type: string | null
			flat_type_full: string | null
			flat: string | null
			flat_area: string | null
			square_meter_price: string | null
			flat_price: string | null
			postal_box: string | null
			fias_id: string
			fias_code: string
			fias_level: string
			fias_actuality_state: string
			kladr_id: string
			geoname_id: string
			capital_marker: string
			okato: string
			oktmo: string
			tax_office: string
			tax_office_legal: string
			timezone: string
			geo_lat: string
			geo_lon: string
			beltway_hit: string
			beltway_distance: string | null
			metro: [
				{
					name: string
					line: string
					distance: number
				},
				{
					name: string
					line: string
					distance: number
				},
				{
					name: string
					line: string
					distance: number
				}
			]
			qc_geo: string
			qc_complete: string | null
			qc_house: string | null
			history_values: string | null
			unparsed_parts: string | null
			source: string
			qc: string
		}
	}
}
