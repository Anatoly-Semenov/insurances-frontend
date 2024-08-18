import { CalculatorPackage } from "@common-repo/types/src"
import {
	ApartmentOutlined,
	FileOutlined,
	QrcodeOutlined,
	SafetyOutlined,
	WalletOutlined
} from "@ant-design/icons-vue"

// Store
import { useCyberRisksStore } from "~/store"

export function useCalculatorPackage() {
	const store = useCyberRisksStore()

	const activePackageId = computed((): number => {
		return store.getFieldPayment("packages", "activePackage")
	})

	const packages: CalculatorPackage.Package[] = [
		{
			name: "Optima-Комплексный",
			slug: "complex",
			icon: ApartmentOutlined,
			risks: [
				"Страхование информационных систем и информационных ресурсов от инцидентов с нарушением кибербезопасности",
				"Страхование убытков, возникших в результате перерыва в хозяйственной деятельности в связи с инцидентом с нарушением кибербезопасности",
				"Страхование гражданской ответственности в связи с инцидентом с нарушением кибербезопасности",
				"Страхование от возникновения непредвиденных расходов в связи с инцидентом с нарушением кибербезопасности",
				"Страхование от несанкционированного списания денежных средств со счета страхователя в результате инцидента с нарушением кибербезопасности"
			],
			id: 1
		},
		{
			name: "Optima-Базовый",
			slug: "base",
			icon: FileOutlined,
			risks: [
				"Страхование информационных систем и информационных ресурсов от инцидентов с нарушением кибербезопасности",
				"Страхование гражданской ответственности в связи с инцидентом с нарушением кибербезопасности",
				"Страхование от возникновения непредвиденных расходов в связи с инцидентом с нарушением кибербезопасности"
			],
			id: 2
		},
		{
			name: "Optima-защита информации",
			slug: "information",
			icon: QrcodeOutlined,
			risks: [
				"Страхование информационных систем и информационных ресурсов от инцидентов с нарушением кибербезопасности",
				"Страхование от возникновения непредвиденных расходов в связи с инцидентом с нарушением кибербезопасности"
			],
			id: 3
		},
		{
			name: "Optima-Надежный кошелек",
			slug: "wallet",
			icon: WalletOutlined,
			risks: [
				"Страхование от несанкционированного списания денежных средств со счета страхователя в результате инцидента с нарушением кибербезопасности"
			],
			id: 4
		},
		{
			name: "Optima-DOS или DDOS-атака",
			slug: "ddos",
			icon: SafetyOutlined,
			risks: [
				"Страхование убытков, возникших в результате перерыва в хозяйственной деятельности в связи с инцидентом с нарушением кибербезопасности"
			],
			id: 5
		}
	]

	const activePackage = computed((): CalculatorPackage.Package => {
		const index = packages.findIndex(({ id }) => id === activePackageId.value)

		return packages[index]
	})

	return {
		packages,
		activePackage,
		activePackageId
	}
}
