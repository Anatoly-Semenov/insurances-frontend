import { Modal } from "ant-design-vue"
import { createVNode } from "vue"

// Icons
import {
	DownOutlined,
	DeleteOutlined,
	FullscreenOutlined,
	FullscreenExitOutlined,
	ExclamationCircleOutlined
} from "@ant-design/icons-vue"

// Hooks
import { useStore, useError } from "~/hooks"

// Types
import type { UiTable } from "~/types"
import { UiSelect as IUiSelect } from "~/types"
import { AgroService, Calculator, Info } from "@common-repo/types/src"

export function useCalculatorFertility(
	type: Calculator.Type = Calculator.TypeEnum.AGRO,
	componentType: AgroService.FertilityComponentType = AgroService
		.FertilityComponentType.FERTILITY
) {
	// Store
	const { store, infoStore } = useStore(type)

	// Methods
	const { errorRelationInsuranceSumToCost, errorEmpty } = useError()

	function countYear(value: number): number {
		const { $dayjs } = useNuxtApp()

		const thisYear = $dayjs().year()
		return thisYear - value
	}

	const generateFranchise = (): IUiSelect.Options => {
		const values: IUiSelect.Options = []

		for (let value: number = 10; value <= 50; value += 5) {
			values.push({
				value: value,
				label: value + ""
			})
		}

		return values
	}

	const generateTableColumns = (): UiTable.Column[] => {
		switch (componentType) {
			case AgroService.FertilityComponentType.FERTILITY:
				return fertilityColumns
			case AgroService.FertilityComponentType.DETAILS:
				return detailsColumns
			case AgroService.FertilityComponentType.EMERGENCY:
				return emergencyColumns
			default:
				return []
		}
	}

	function showDelete(index: number): void {
		Modal.confirm({
			class: "ui-modal",
			title: "Вы действительно хотите удалить эту культуру",
			icon: createVNode(ExclamationCircleOutlined),
			content: `№ культуры - ${index + 1}`,
			okText: "Да",
			okType: "danger",
			cancelText: "Нет",
			width: 500,
			async onOk(): Promise<void> {
				store.deleteCulture(index)
			}
		})
	}

	// Computed
	const title = computed((): string => {
		switch (componentType) {
			case AgroService.FertilityComponentType.FERTILITY:
				return "Урожайность сельскохозяйственных культур, заявленных на страхование, в хозяйстве Страхователя:"
			case AgroService.FertilityComponentType.DETAILS:
				return "Основные сведения о сельскохозяйственных культурах:"
			case AgroService.FertilityComponentType.EMERGENCY:
				return "Страхование риска ЧС:"
			default:
				return ""
		}
	})

	const cultures = computed((): AgroService.Cultures => {
		return store.getCultures
	})

	const bindingOptions = computed((): IUiSelect.Options => {
		return infoStore.getInfo(Info.InfoType.BINDINGS)
	})

	const isBindingDisabled = computed((): boolean => {
		return !bindingOptions.value.length
	})

	const isEmergency = computed(() => {
		return componentType === AgroService.FertilityComponentType.EMERGENCY
	})

	const isEmergencyRisk = computed((): boolean => {
		return !isEmergency.value || store.getIsEmergencyRisk
	})

	const tableWidth = computed((): number => {
		switch (componentType) {
			case AgroService.FertilityComponentType.FERTILITY:
				return 1100
			case AgroService.FertilityComponentType.DETAILS:
				return 2100
			case AgroService.FertilityComponentType.EMERGENCY:
				return 2400
			default:
				return 1000
		}
	})

	// Data
	const franchiseOptions: IUiSelect.Options = generateFranchise()
	const isFullScreen = ref<boolean>(false)
	const isOpenBlock = ref<boolean>(true)
	const isLoading = ref<boolean>(false)
	const types = Calculator.TypeEnum

	const numberFields: string[] = [
		"salePriceEmergencyRisk",
		"areaHaEmergencyRisk",
		"salePrice",
		"areaHa"
	]

	const textFields: string[] = [
		"insurancePremiumTotalEmergencyRisk",
		"insurancePremiumToPayEmergencyRisk",
		"insuranceCostEmergencyRisk",
		"insuranceSumEmergencyRisk",
		"insurancePremium50Percent",
		"insurancePremiumTotal",
		"tariffEmergencyRisk",
		"last5YearsHarvest",
		"insuranceCost",
		"insuranceSum",
		"tariff"
	]

	const fertilityColumns: UiTable.Column[] = [
		{
			title: "№",
			dataIndex: "id",
			key: "id",
			scopedSlots: { customRender: "id" },
			align: "center",
			width: 50,
			fixed: true
		},
		{
			title: "Сельскохозяйственная культура",
			dataIndex: "bindingId",
			key: "bindingId",
			scopedSlots: { customRender: "bindingId" },
			align: "center"
		},
		{
			title: "Уточненное название культуры",
			dataIndex: "cultureName",
			key: "cultureName",
			scopedSlots: { customRender: "cultureName" },
			align: "center"
		},
		{
			title: countYear(1) + ", (ц/га)",
			dataIndex: "year1",
			key: "year1",
			scopedSlots: { customRender: "year1" },
			align: "center",
			width: 110
		},
		{
			title: countYear(2) + ", (ц/га)",
			dataIndex: "year2",
			key: "year2",
			scopedSlots: { customRender: "year2" },
			align: "center",
			width: 110
		},
		{
			title: countYear(3) + ", (ц/га)",
			dataIndex: "year3",
			key: "year3",
			scopedSlots: { customRender: "year3" },
			align: "center",
			width: 110
		},
		{
			title: countYear(4) + ", (ц/га)",
			dataIndex: "year4",
			key: "year4",
			scopedSlots: { customRender: "year4" },
			align: "center",
			width: 110
		},
		{
			title: countYear(5) + ", (ц/га)",
			dataIndex: "year5",
			key: "year5",
			scopedSlots: { customRender: "year5" },
			align: "center",
			width: 110
		},
		{
			title: "",
			dataIndex: "delete",
			key: "delete",
			scopedSlots: { customRender: "delete" },
			width: 50,
			align: "center"
		}
	]

	const detailsColumns: UiTable.Column[] = [
		{
			title: "№",
			dataIndex: "id",
			key: "id",
			scopedSlots: { customRender: "id" },
			align: "center",
			width: 50,
			fixed: true
		},
		{
			title: "Сельскохозяйственная культура",
			dataIndex: "bindingId",
			key: "bindingId",
			scopedSlots: { customRender: "bindingId" },
			align: "center"
		},
		{
			title: "Уточненное название культуры",
			dataIndex: "cultureName",
			key: "cultureName",
			scopedSlots: { customRender: "cultureName" },
			align: "center"
		},
		{
			title: "Общая площадь посева/посадки, га",
			dataIndex: "areaHa",
			key: "areaHa",
			scopedSlots: { customRender: "areaHa" },
			align: "center"
		},
		{
			title: "Средняя цена реализации, руб./ц",
			dataIndex: "salePrice",
			key: "salePrice",
			scopedSlots: { customRender: "salePrice" },
			align: "center"
		},
		{
			title: "Средняя урожайность за 5 лет, (ц/га)",
			dataIndex: "last5YearsHarvest",
			key: "last5YearsHarvest",
			scopedSlots: { customRender: "last5YearsHarvest" },
			align: "center"
		},
		{
			title: "Безусловная франшиза, %",
			dataIndex: "franchise",
			key: "franchise",
			scopedSlots: { customRender: "franchise" },
			align: "center"
		},
		{
			title: "Страховая стоимость, руб",
			dataIndex: "insuranceCost",
			key: "insuranceCost",
			scopedSlots: { customRender: "insuranceCost" },
			align: "center"
		},
		{
			title: "Страховая сумма, руб.",
			dataIndex: "insuranceSum",
			key: "insuranceSum",
			scopedSlots: { customRender: "insuranceSum" },
			align: "center"
		},
		{
			title: "Тариф, %",
			dataIndex: "tariff",
			key: "tariff",
			scopedSlots: { customRender: "tariff" },
			align: "center"
		},
		{
			title: "Страховая премия (общая)",
			dataIndex: "insurancePremiumTotal",
			key: "insurancePremiumTotal",
			scopedSlots: { customRender: "insurancePremiumTotal" },
			align: "center"
		},
		{
			title: "Страховая премия (к уплате 50%)",
			dataIndex: "insurancePremium50Percent",
			key: "insurancePremium50Percent",
			scopedSlots: { customRender: "insurancePremium50Percent" },
			align: "center"
		},
		{
			title: "",
			dataIndex: "delete",
			key: "delete",
			scopedSlots: { customRender: "delete" },
			width: 50,
			align: "center"
		}
	]

	const emergencyColumns: UiTable.Column[] = [
		{
			title: "№",
			dataIndex: "id",
			key: "id",
			scopedSlots: { customRender: "id" },
			align: "center",
			width: 50,
			fixed: true
		},
		{
			title: "Сельскохозяйственная культура",
			dataIndex: "bindingId",
			key: "bindingId",
			scopedSlots: { customRender: "bindingId" },
			align: "center"
		},
		{
			title: "Уточненное название культуры",
			dataIndex: "cultureName",
			key: "cultureName",
			scopedSlots: { customRender: "cultureName" },
			align: "center"
		},
		{
			title: "Площадь посева/посадки, га",
			dataIndex: "areaHaEmergencyRisk",
			key: "areaHaEmergencyRisk",
			scopedSlots: { customRender: "areaHaEmergencyRisk" },
			align: "center"
		},
		{
			title: "Средняя цена реализации, руб./ц",
			dataIndex: "salePriceEmergencyRisk",
			key: "salePriceEmergencyRisk",
			scopedSlots: { customRender: "salePriceEmergencyRisk" },
			align: "center"
		},
		{
			title: "Средняя урожайность за 5 лет, (ц/га)",
			dataIndex: "last5YearsHarvest",
			key: "last5YearsHarvest",
			scopedSlots: { customRender: "last5YearsHarvest" },
			align: "center"
		},
		{
			title: "Безусловная франшиза, %",
			dataIndex: "franchisesEmergencyRisk",
			key: "franchisesEmergencyRisk",
			scopedSlots: { customRender: "franchisesEmergencyRisk" },
			align: "center"
		},
		{
			title: "Итоговая страховая стоимость, руб",
			dataIndex: "insuranceCostEmergencyRisk",
			key: "insuranceCostEmergencyRisk",
			scopedSlots: { customRender: "insuranceCostEmergencyRisk" },
			align: "center"
		},
		{
			title: "Отношение СС к СТ, %",
			dataIndex: "relationInsuranceSumToCost",
			key: "relationInsuranceSumToCost",
			scopedSlots: { customRender: "relationInsuranceSumToCost" },
			align: "center"
		},
		{
			title: "Итоговая страховая сумма, руб.",
			dataIndex: "insuranceSumEmergencyRisk",
			key: "insuranceSumEmergencyRisk",
			scopedSlots: { customRender: "insuranceSumEmergencyRisk" },
			align: "center"
		},
		{
			title: "Тариф, %",
			dataIndex: "tariffEmergencyRisk",
			key: "tariffEmergencyRisk",
			scopedSlots: { customRender: "tariffEmergencyRisk" },
			align: "center"
		},
		{
			title: "Итоговая страховая премия (общая)",
			dataIndex: "insurancePremiumTotalEmergencyRisk",
			key: "insurancePremiumTotalEmergencyRisk",
			scopedSlots: { customRender: "insurancePremiumTotalEmergencyRisk" },
			align: "center"
		},
		{
			title: "Итоговая страховая премия (к уплате)",
			dataIndex: "insurancePremiumToPayEmergencyRisk",
			key: "insurancePremiumToPayEmergencyRisk",
			scopedSlots: { customRender: "insurancePremiumToPayEmergencyRisk" },
			align: "center"
		},
		{
			title: "",
			dataIndex: "delete",
			key: "delete",
			scopedSlots: { customRender: "delete" },
			width: 50,
			align: "center"
		}
	]

	const tableColumns: UiTable.Column[] = generateTableColumns()

	return {
		errorRelationInsuranceSumToCost,
		FullscreenExitOutlined,
		FullscreenOutlined,
		isBindingDisabled,
		franchiseOptions,
		isEmergencyRisk,
		DeleteOutlined,
		bindingOptions,
		DownOutlined,
		numberFields,
		isFullScreen,
		tableColumns,
		isEmergency,
		isOpenBlock,
		showDelete,
		textFields,
		errorEmpty,
		tableWidth,
		countYear,
		infoStore,
		isLoading,
		cultures,
		title,
		types,
		store
	}
}
