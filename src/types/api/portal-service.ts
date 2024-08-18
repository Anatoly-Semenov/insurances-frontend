export namespace PortalService {
	type Value = string | number

	export interface Profile {
		CITY_ID: Value
		GOSB: Value
		ID: Value
		LAST_NAME: Value
		NAME: Value
		PERSONAL_CITY: Value
		REGION: Value
		REGION_ID: Value
		SECOND_NAME: Value
		TB: Value
		UF_VSP_NUMBER: Value
	}

	export interface Time {
		date_finish: string
		date_start: string
		duration: number
		finish: number
		processing: number
		start: number
	}

	export interface Response<T> {
		result: T
		time: Time
	}

	export type ProfileResponse = Response<Profile>
}
