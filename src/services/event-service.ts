// Store
import { useAuthStore } from "~/store"

// Types
import { ApiServices } from "@common-repo/api-requests/src/types"
import { ActionService, AuthService } from "@common-repo/types"

type ActionApiService = ApiServices.List["actionsService"]
type Response = ActionService.Response | void
type AwaitedResponse = Promise<Response>
type Log = ActionService.Log

interface GenerateEventParams {
	calculatorName: string
	eventName: string
	dealId: number
}

// Todo: add to types package
enum Event {
	SWITCH_CURRENT_VERSION = "switch-current-version", // Нажатие кнопки "Прошлая версия калькулятора"
	NEW_DEAL = "new-deal", //	Нажатие плашки "Кибер Риски" на домашней странице веб-витрины
	NEXT_PAGE = "next-page", // Нажатие кнопки для навигации по списку сделок вправо
	PREV_PAGE = "prev-page", // Нажатие кнопки для навигации по списку сделок влево
	SWITCH_NEW_VERSION = "switch-new-version", //	Нажатие кнопки "НОВАЯ ВЕРСИЯ"
	REMOVE_DEAL = "remove-deal", // Нажатие иконки для удаления в списке сделок
	COPY_DEAL = "copy-deal", // Нажатие иконки для копирования в списке сделок
	DO_CALCULATION = "do-calculation", // Нажатие кнопки "ОТПРАВИТЬ РАСЧЕТ"
	SHOW_CALCULATION = "show-calculation", // Нажатие на вкладку "РАСЧЕТ"
	COMPLIANCE = "compliance", // Нажатие кнопки "ПРОВЕРИТЬ ПО 115-ФЗ"
	SHOW_CLIENT = "show-client", // Нажатие на вкладку "СТРАХОВАТЕЛЬ"
	OPEN_DEAL = "open-deal", // Переход по ссылке в карточку сделки
	CLOSE_DEAL = "close-deal ", // Нажатие кнопки "ЗАКРЫТЬ СДЕЛКУ"
	SHOW_DRAFTS = "show-drafts", //	Нажатие на вкладку "ЧЕРНОВИКИ"
	SHOW_FINAL = "show-final", // Нажатие на вкладку "ОФОРМЛЕНИЕ"
	SHOW_WINS = "show-wins", // Нажатие на вкладку "ЗАВЕРШЕНЫ"
	SHOW_ALL = "show-all", // Нажатие на вкладку "ВСЕ РАСЧЕТЫ"
	SAVE_DEAL = "save-deal", // Нажатие кнопки "СОХРАНИТЬ"
	GO_ARCHIVE = "go-archive" //	Нажатие "АРХИВ СДЕЛОК"
}

export class EventService {
	private readonly actionService: ActionApiService
	private isLocal: boolean = false

	constructor(actionService: ActionApiService) {
		this.actionService = actionService
		this.checkByHost()
	}

	private generateEvent({
		calculatorName,
		eventName,
		dealId = 0
	}: GenerateEventParams): Log {
		const { $dayjs } = useNuxtApp()
		const authStore = useAuthStore()

		const user: AuthService.User = authStore.getUser!

		const systemId: string = `w-${calculatorName}`
		const entityType: string = `w-${calculatorName}.deal`
		const activityDate: string = $dayjs().format()

		const activityTypeId: string = `w-${calculatorName}.${eventName}`

		return {
			userEmail: user.email,
			// @ts-ignore
			entityId: dealId,
			activityTypeId,
			activityDate,
			entityType,
			systemId,

			// Unused fields
			activityDescription: "",
			activityTypeName: "",
			systemName: "",
			userId: ""
		}
	}

	private checkByHost(): void {
		this.isLocal = window.location.host.includes("localhost")
	}

	public async sendEvent(event: Log): AwaitedResponse {
		if (!this.isLocal) {
			try {
				return await this.actionService.sendAction(event)
			} catch (e) {
				console.error("Failed to send event")
			}
		}
	}

	public async switchCurrentVersion(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SWITCH_CURRENT_VERSION,
				calculatorName,
				dealId
			})
		)
	}

	public async newDeal(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.NEW_DEAL,
				calculatorName,
				dealId
			})
		)
	}

	public async nextPage(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.NEXT_PAGE,
				calculatorName,
				dealId
			})
		)
	}

	public async prevPage(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.PREV_PAGE,
				calculatorName,
				dealId
			})
		)
	}

	public async switchNewVersion(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SWITCH_NEW_VERSION,
				calculatorName,
				dealId
			})
		)
	}

	public async removeDeal(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.REMOVE_DEAL,
				calculatorName,
				dealId
			})
		)
	}

	public async copyDeal(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.COPY_DEAL,
				calculatorName,
				dealId
			})
		)
	}

	public async doCalculation(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.DO_CALCULATION,
				calculatorName,
				dealId
			})
		)
	}

	public async showCalculation(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SHOW_CALCULATION,
				calculatorName,
				dealId
			})
		)
	}

	public async compliance(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.COMPLIANCE,
				calculatorName,
				dealId
			})
		)
	}

	public async showClient(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SHOW_CLIENT,
				calculatorName,
				dealId
			})
		)
	}

	public async openDeal(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.OPEN_DEAL,
				calculatorName,
				dealId
			})
		)
	}

	public async closeDeal(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.CLOSE_DEAL,
				calculatorName,
				dealId
			})
		)
	}

	public async showDrafts(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SHOW_DRAFTS,
				calculatorName,
				dealId
			})
		)
	}

	public async showFinal(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SHOW_FINAL,
				calculatorName,
				dealId
			})
		)
	}

	public async showWins(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SHOW_WINS,
				calculatorName,
				dealId
			})
		)
	}

	public async showAll(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SHOW_ALL,
				calculatorName,
				dealId
			})
		)
	}

	public async saveDeal(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.SAVE_DEAL,
				calculatorName,
				dealId
			})
		)
	}

	public async goArchive(
		calculatorName: string,
		dealId: number = 0
	): AwaitedResponse {
		return await this.sendEvent(
			this.generateEvent({
				eventName: Event.GO_ARCHIVE,
				calculatorName,
				dealId
			})
		)
	}
}
