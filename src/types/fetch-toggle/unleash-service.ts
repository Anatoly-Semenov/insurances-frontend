export namespace UnleashService {
	export interface Variant {
		name: string
		enabled: boolean
		payload?: {
			type: string
			value: string
		}
	}

	export interface Toggle {
		impressionData: boolean
		variant: Variant
		enabled: boolean
		name: string
	}

	export interface TogglesResponse {
		toggles: Toggle[]
	}
}
