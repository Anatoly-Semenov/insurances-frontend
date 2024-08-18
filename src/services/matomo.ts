// hooks
import { useConfig } from "~/hooks"

// Types
import { Matomo as IMatomo } from "@common-repo/types/src"

type Options = IMatomo.TrackEventOptions
type EventType = keyof typeof IMatomo.Message.Success
type EventOptions = IMatomo.EventOptions
type PaqEvent = IMatomo.PaqEvent

export class Matomo {
	private isLocal: boolean = false

	constructor() {
		this.checkByHost()
	}

	trackEvent(params: Options): void {
		if (this.checkByProduction()) {
			const { calcName, type, status, prop } = params

			const event: PaqEvent = [
				"trackEvent",
				calcName,
				`${type} ${calcName}`,
				`${status} ${calcName}`
			]

			if (prop) event.push(prop)

			if (window?._paq) {
				window?._paq.push(event)
			}
		}
	}

	private checkByHost(): void {
		this.isLocal = window.location.host.includes("localhost")
	}

	checkByProduction(): boolean {
		const { isDev } = useConfig()

		return !isDev && !this.isLocal
	}

	async generateEvent(
		params: EventOptions,
		eventType: EventType
	): Promise<void> {
		const { calcName, isSuccess, value: prop } = params

		// @ts-ignore
		const type = `${IMatomo.Message.Name[eventType]} ${calcName}`

		const status = isSuccess
			? // @ts-ignore
			  `${IMatomo.Message.Success[eventType]} ${calcName}`
			: // @ts-ignore
			  `${IMatomo.Message.Failed[eventType]} ${calcName}`

		delete params.isSuccess
		delete params.value

		const event: any = {
			...params,
			type,
			status
		}

		if (prop) event.prop = prop

		this.trackEvent(event)
	}

	setUserId(email: string): void {
		if (window?._paq) {
			window?._paq.push(["setUserId", email])
		}
	}

	setCustomDimension(terBank: string): void {
		if (window?._paq) {
			window?._paq.push(["setCustomDimension", 1, terBank])
		}
	}

	async clickToCalculator(calculatorName: string): Promise<void> {
		const event: PaqEvent = [
			"trackEvent",
			calculatorName,
			IMatomo.Message.Name.CLICK_TO_CALCULATOR
		]

		if (window?._paq) {
			window?._paq.push(event)
		}
	}

	async saveDeal(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.SAVE)
	}

	async calculation(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.CALCULATION)
	}

	async sendCalculation(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.CALCULATION_SEND)
	}

	async check115(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.CHECK_115)
	}

	async saveRegistration(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.REGISTRATION)
	}

	async openArchive(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.ARCHIVE)
	}

	async openDeal(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.DETAIL_DEAL)
	}

	async savePrint(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.PRINT)
	}

	async saveLinkToDeal(params: EventOptions): Promise<void> {
		await this.generateEvent(params, IMatomo.Message.Types.LINK_TO_DEAL)
	}
}
