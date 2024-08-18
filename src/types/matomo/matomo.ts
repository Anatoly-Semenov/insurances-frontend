import { Router } from "vue-router"

export namespace Matomo {
	export type PaqEvent = any[]

	export interface ConnectOptions {
		router: Router
		host: string
		siteId: number
		trackerFileName: string
		enableLinkTracking: boolean
		requireConsent: boolean
		trackInitialView: boolean
		disableCookies: boolean
		enableHeartBeatTimer: boolean
		heartBeatTimerInterval: number
		debug: boolean
		userId: string | null
		cookieDomain: any | null
		domains: any | null
		preInitActions: any[]
	}

	export interface TrackEventOptions {
		calcName: string
		type: string
		status: string
		prop?: string | number | undefined
	}

	export interface EventOptions {
		calcName: string
		isSuccess?: boolean
		value?: number
	}

	export namespace Message {
		export const enum Types {
			SAVE = "SAVE",
			CALCULATION_SEND = "CALCULATION_SEND",
			REGISTRATION = "REGISTRATION",
			CALCULATION = "CALCULATION",
			ARCHIVE = "ARCHIVE",
			DETAIL_DEAL = "DETAIL_DEAL",
			PRINT = "PRINT",
			LINK_TO_DEAL = "LINK_TO_DEAL",
			SEND_DRAFT = "SEND_DRAFT",
			CHECK_115 = "CHECK_115",
			CLICK_TO_CALCULATOR = "CLICK_TO_CALCULATOR"
		}

		export const enum Name {
			SAVE = "Сохранение сделки",
			CALCULATION_SEND = "Отправление расчета сделки на почту",
			CALCULATION = "Расчёт сделки",
			ARCHIVE = "Архив сделок",
			DETAIL_DEAL = "Детальная страница сделки",
			REGISTRATION = "Регистарция",
			PRINT = "Печать сделки",
			LINK_TO_DEAL = "Переход по ссылке на сделку",
			SEND_DRAFT = "Отправка черновика",
			CHECK_115 = "Проверка по 115ФЗ",
			CLICK_TO_CALCULATOR = "Переход в калькулятор с главной страницы"
		}

		export const enum Success {
			SAVE = "Успешно сохранена сделка",
			CALCULATION_SEND = "Успешно отправлен расчёт",
			CALCULATION = "Успешно выполнен расчёт",
			ARCHIVE = "Переход в архив сделок",
			DETAIL_DEAL = "Переход в детальную страницу сделки",
			REGISTRATION = "Успешно оформлена сделка",
			PRINT = "Успешно распечатана сделка",
			LINK_TO_DEAL = "Успешно перешли по ссылке",
			SEND_DRAFT = "Черновик успешно отправлен",
			CHECK_115 = "Пройдена проверка 115 ФЗ"
		}

		export const enum Failed {
			SAVE = "Не удалось сохранить сделку",
			CALCULATION_SEND = "Не удалось отправить расчёт",
			CALCULATION = "Не удалось выполнить расчёт",
			ARCHIVE = "Не удалось перейти в архив сделок",
			DETAIL_DEAL = "Не удалось перейти в детальную страницу сделки",
			REGISTRATION = "Не удалось оформить сделку",
			PRINT = "Не удалось распечатать сделку",
			LINK_TO_DEAL = "Не удалось перейти по ссылке",
			SEND_DRAFT = "Не удалось отправить черновик полиса",
			CHECK_115 = '"Не удалось пройти проверку 115 ФЗ"'
		}
	}
}
