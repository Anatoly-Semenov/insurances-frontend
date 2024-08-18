import { FunctionalComponent } from "vue"

export namespace IndexInsurance {
	export interface Data {
		isAvailableOnProduction: boolean
		isButtonsVisible?: boolean
		icon: FunctionalComponent
		description?: string
		subjects?: string[]
		oldPath?: string
		name: string
		path: string
		id: string
	}

	export const enum Id {
		MOTOR_ASSISTANT = "dashboard_page_MotorAssistant",
		OSAGO_SPECTECH = "dashboard_page_OsagoSpectech",
		SPECTECH = "dashboard_page_Spectech",
		BREAK = "dashboard_page_NonDamageBi",
		CYBER = "dashboard_page_CyberRisks",
		ASSET = "dashboard_page_Asset",
		KASCO = "dashboard_page_Kasco",
		CASH = "dashboard_page_Cash",
		AGRO = "dashboard_page_Agro",
		ECO = "dashboard_page_Eco",
		SMR = "dashboard_page_Smr"
	}
}
