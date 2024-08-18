// Components
import {
	FormatPainterOutlined,
	SecurityScanOutlined,
	ClockCircleOutlined,
	FileDoneOutlined,
	DollarOutlined,
	CloudOutlined,
	HomeOutlined,
	CarOutlined,
	FileProtectOutlined
} from "@ant-design/icons-vue"

// hooks
import { useConfig } from "~/hooks"
import { useFetchToggleStore } from "~/store"

// Types
import { IndexInsurance, Landing } from "~/types"
import { Calculator } from "@common-repo/types/src"

export function useCalculatorInsurances() {
	const { isDev } = useConfig()

	const fetchToggleStore = useFetchToggleStore()

	onMounted(async () => {
		await fetchToggleStore.fetchAllToggles()
	})

	const insurancesList: IndexInsurance.Data[] = [
		{
			name: "Имущество",
			id: IndexInsurance.Id.ASSET,
			subjects: [
				"торговые здания;",
				"административные комплексы;",
				"частные жилые дома;",
				"многоквартирные дома;",
				"комнаты и квартиры в многоквартирных домах;",
				"жилищные комплексы;",
				"участки земли;",
				"офисное помещение;"
			],
			path: "/asset",
			oldPath: "/asset-new",
			icon: HomeOutlined,
			isAvailableOnProduction: false,
			description: "Страхование недвижимого имущества",
			isButtonsVisible: true
		},
		{
			name: "Спецтехника",
			id: IndexInsurance.Id.SPECTECH,
			subjects: [
				"Дорожная",
				"Коммунальная",
				"Строительная",
				"Сельскохозяйственная",
				"Военная",
				"Пожарная",
				"Медицинская",
				"Транспортировочная"
			],
			path: "/spectech",
			oldPath: "/spectech",
			icon: CarOutlined,
			isAvailableOnProduction: fetchToggleStore.haveToggle("PROPINS-2817"),
			description: "Страхование Спецтехники",
			isButtonsVisible: true
		},
		{
			name: "ОСАГО / Спецтехника",
			id: IndexInsurance.Id.OSAGO_SPECTECH,
			subjects: [
				"Ремонт;",
				"Денежная компенсация. Сумму определяет страховая компания после экспертизы автомобиля."
			],
			path: "/osago-spectech",
			oldPath: "/osago-spectech",
			icon: FileDoneOutlined,
			isAvailableOnProduction: fetchToggleStore.haveToggle("PROPINS-2808"),
			description: "Страхование ОСАГО для Спецтехники",
			isButtonsVisible: true
		},
		{
			name: "Кибер-риски",
			id: IndexInsurance.Id.CYBER,
			subjects: [
				"ущерб от перерывов в деятельности;",
				"расходы на восстановление системы;",
				"расходы на восстановление и дешифровку данных, включая стоимость необходимого программного обеспечения;",
				"расходы по минимизации последствий и расследованию причин киберпреступления."
			],
			path: "/cyber",
			oldPath: "/cyberRisks",
			icon: SecurityScanOutlined,
			isAvailableOnProduction: true,
			description: "Страхование рисков кибер-безопасности",
			isButtonsVisible: true
		},
		{
			name: "Каско",
			id: IndexInsurance.Id.KASCO,
			subjects: [
				"Ремонт;",
				"Денежная компенсация. Сумму определяет страховая компания после экспертизы автомобиля."
			],
			path: "/kasco",
			oldPath: "/kasco",
			icon: CarOutlined,
			isAvailableOnProduction: fetchToggleStore.haveToggle("PROPINS-2772"),
			description: "Страхование КАСКО и ОСАГО для автомобилей",
			isButtonsVisible: true
		},
		{
			name: "СМР",
			id: IndexInsurance.Id.SMR,
			description: "Страхование строительно-монтажных рисков",
			// subjects: [
			// 	"объектов промышленного строительства – промышленных зданий, объектов транспортной инфраструктуры (дорожных и железнодорожных сооружений, аэропортов, морских портов, мостов, каналов, плотин, туннелей, газопроводов, нефтепроводов, продуктопроводов);",
			// 	"объектов гражданского строительства (административных зданий, объектов жилищного строительства и т.п.);",
			// 	"объектов, находящихся на строительной площадке или в непосредственной близости к ней, принадлежащих заказчику или подрядчику;"
			// ],
			path: "/smr",
			oldPath: "/smr",
			icon: FormatPainterOutlined,
			isAvailableOnProduction: fetchToggleStore.haveToggle("PROPINS-2799"),
			isButtonsVisible: true
		},
		// Todo: Maybe temporary hide calculator: "Cash"
		// {
		// 	name: "Наличность",
		// 	subjects: [
		// 		"товарные деньги (золото, серебро, жемчуг, каменные деньги, скот и т. д.);",
		// 		"знаки стоимости (монеты и бумажные деньги);",
		// 		"кредитные деньги (кредитные карты, чеки)."
		// 	],
		// 	path: "/cash",
		// 	icon: DollarOutlined,
		// description: "Описание продукта",
		// },
		{
			name: "Перерыв",
			id: IndexInsurance.Id.BREAK,
			description: "Страхование перерыва в предпринимательской деятельности",
			path: "/break",
			oldPath: "/non-damage-bi",
			icon: ClockCircleOutlined,
			isAvailableOnProduction: true,
			isButtonsVisible: true
		},
		{
			name: "ЭКО",
			id: IndexInsurance.Id.ECO,
			subjects: [
				"1. Экологическое страхование осуществляется в целях защиты имущественных интересов юридических и физических лиц на случай экологических рисков.",
				"2. В Российской Федерации может осуществляться обязательное государственное экологическое страхование.",
				"3. Экологическое страхование в Российской Федерации осуществляется в соответствии с законодательством Российской Федерации."
			],
			path: "/eco",
			oldPath: "/eco",
			icon: CloudOutlined,
			isAvailableOnProduction: true,
			description: "Описание экологических рисков",
			isButtonsVisible: true
		},
		{
			name: "Мотор-помощник",
			id: IndexInsurance.Id.MOTOR_ASSISTANT,
			description: "Дополнительное страхование автомобилей",
			path: "/motor-assistant",
			oldPath: "/motorAssistant",
			icon: CarOutlined,
			isAvailableOnProduction: false,
			isButtonsVisible: true
		},
		{
			name: "Агро",
			id: IndexInsurance.Id.AGRO,
			description: "Страхование сельскохозяйственных рисков",
			path: "/agro",
			oldPath: "/agro",
			icon: CloudOutlined,
			isAvailableOnProduction: fetchToggleStore.haveToggle("PROPINS-2804"),
			isButtonsVisible: true
		},
		{
			name: "ГО",
			id: Landing.Id.GO_LANDING,
			path: "/go",
			icon: FileProtectOutlined,
			isAvailableOnProduction: fetchToggleStore.haveToggle("PROPINS-3069"),
			description: "Переход на лендинг",
			isButtonsVisible: false
		}
	]

	const availableInsurancesOnProduction = insurancesList.filter(
		({ isAvailableOnProduction }) => isAvailableOnProduction
	)

	const insurances = !isDev ? availableInsurancesOnProduction : insurancesList

	function getInsuranceByName(
		name: Calculator.Type
	): IndexInsurance.Data | undefined {
		return insurances.find(({ path }) => {
			return (path.slice(1) as Calculator.Type) === name
		})
	}

	return { insurances, getInsuranceByName }
}
