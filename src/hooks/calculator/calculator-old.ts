// Components
import { message } from "ant-design-vue"

// hooks
import { useConfig } from "~/hooks"

// types
import { Calculator } from "@common-repo/types/src"

export function useCalculatorOld(
	calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	function generateLink(): string {
		const { oldFrontendUrl } = useConfig()

		return oldFrontendUrl || ""
	}

	function callLink(link: string): void {
		if (link) {
			window.location.href = link
		} else {
			message.error("Отсутствует ссылка на демо-версию приложения")
		}
	}

	function toOldVersion(): void {
		const link: string = generateLink()

		callLink(link)
	}

	function toOldCalculator(route: string): void {
		const { $event } = useNuxtApp()
		const link: string = generateLink()

		$event.switchCurrentVersion(calculatorType)

		callLink(link + route)
	}

	return { toOldVersion, toOldCalculator }
}
