// Components
import { Modal } from "ant-design-vue"

// Hooks
import { useStore } from "~/hooks"

// Mocks
import { motorCars as loadingData } from "~/mocks"

// Types
import {
	CalculatorFields as Fields,
	MotorService,
	Calculator,
	UiTable,
	UiSelect
} from "@common-repo/types/src"
import { createVNode } from "vue"
import { ExclamationCircleOutlined } from "@ant-design/icons-vue"

interface DataList {
	title: string
	value: string | number | null
}

export function useCalculatorCars(
	calculator: Calculator.Type = Calculator.TypeEnum.CYBER
) {
	// Store
	const { store } = useStore(calculator)

	// Data
	const isLoading = ref<boolean>(false)
	const isLoadingAutocode = ref<boolean>(false)
	const isAllKasco = ref<boolean>(false)
	const isAllOsago = ref<boolean>(false)

	const checkboxes = reactive([
		{
			text: "Выбрать всё КАСКО",
			value: isAllKasco,
			id: Fields.Motor.SELECT_ALL_KASCO
		},
		{
			text: "Выбрать всё ОСАГО",
			value: isAllOsago,
			id: Fields.Motor.SELECT_ALL_OSAGO
		}
	])

	const tableColumns: UiTable.Column[] = [
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
			title: "КАСКО",
			dataIndex: "isKasco",
			key: "isKasco",
			scopedSlots: { customRender: "isKasco" },
			align: "center",
			width: 90
		},
		{
			title: "ОСАГО",
			dataIndex: "isOsago",
			key: "isOsago",
			scopedSlots: { customRender: "isOsago" },
			align: "center",
			width: 90
		},
		{
			title: "VIN",
			dataIndex: "vin",
			key: "vin",
			scopedSlots: { customRender: "vin" },
			align: "center",
			width: 200
		},
		{
			title: "Номер шасси",
			dataIndex: "chassisNumber",
			key: "chassisNumber",
			scopedSlots: { customRender: "chassisNumber" },
			align: "center",
			width: 200
		},
		{
			title: "Гос.знак",
			dataIndex: "registrationNumber",
			key: "registrationNumber",
			scopedSlots: { customRender: "registrationNumber" },
			align: "center",
			width: 145
		},
		{
			title: "Марка",
			dataIndex: "brand",
			key: "brand",
			scopedSlots: { customRender: "brand" },
			align: "left",
			width: 200
		},
		{
			title: "Модель",
			dataIndex: "model",
			key: "model",
			scopedSlots: { customRender: "model" },
			align: "left",
			width: 200
		},
		{
			title: "Год выпуска",
			dataIndex: "issueYear",
			key: "issueYear",
			scopedSlots: { customRender: "issueYear" },
			align: "center",
			width: 120
		},
		{
			title: "Новое ТС",
			dataIndex: "isNew",
			key: "isNew",
			scopedSlots: { customRender: "isNew" },
			align: "center",
			width: 100
		},
		{
			title: "Дата начала страхования",
			dataIndex: "startDate",
			key: "startDate",
			scopedSlots: { customRender: "startDate" },
			align: "center"
		},
		{
			title: "Страховая сумма ТС",
			dataIndex: "insuranceSum",
			key: "insuranceSum",
			scopedSlots: { customRender: "insuranceSum" },
			align: "center"
		},
		{
			title: "Страховая премия осаго",
			dataIndex: "insurancePremiumOsago",
			key: "insurancePremiumOsago",
			scopedSlots: { customRender: "insurancePremiumOsago" },
			align: "center"
		},
		{
			title: "",
			dataIndex: "edit",
			key: "edit",
			scopedSlots: { customRender: "edit" },
			fixed: "right",
			align: "center",
			width: 80
		},
		{
			title: "",
			dataIndex: "delete",
			key: "delete",
			scopedSlots: { customRender: "delete" },
			align: "center",
			width: 80
		}
	]

	// Computed
	const data = computed((): MotorService.TableRow[] => {
		return isLoading.value ? loadingData : store.getCars
	})

	const isLoadingData = computed((): boolean => {
		return store.getIsLoading || isLoading.value || isLoadingAutocode.value
	})

	const markOptions = computed(() => {
		return store.getInfo(MotorService.InfoType.MARKS)
	})

	const modelOptions = computed(() => {
		return store.getInfo(MotorService.InfoType.MODELS)
	})

	// methods
	function getCarByIndex(index: number): MotorService.Vehicle {
		return store.getCarByIndex(index)
	}

	function deleteCar(index: number): void {
		const car: any = getCarByIndex(index)

		if (car.vin) {
			Modal.confirm({
				class: "ui-modal",
				title: "Вы действительно хотите удалить этот автомобиль",
				icon: createVNode(ExclamationCircleOutlined),
				content: `№ автомобиля - ${index + 1}`,
				okText: "Да",
				okType: "danger",
				cancelText: "Нет",
				width: 500,
				async onOk(): Promise<void> {
					store.deleteCar(index)
				}
			})
		} else {
			store.deleteCar(index)
		}
	}

	async function fetchAvtocodeData(): Promise<void> {
		isLoadingAutocode.value = true

		await store.fetchAvtocodeData()

		isLoadingAutocode.value = false
	}

	function getMarkModelNameById(
		markModelId: number | string,
		type: MotorService.InfoType
	): string {
		const marksModelsList: UiSelect.Options = store.getInfo(type)

		const infoItemMarkModel: UiSelect.Option = marksModelsList.find(
			({ value }: UiSelect.Option) => value === markModelId
		)

		return infoItemMarkModel?.label || ""
	}

	function getDataListsByIndex(index: number): DataList[][] {
		const car: MotorService.Vehicle = getCarByIndex(index)

		return [
			[
				{
					title: "VIN",
					value: car.vin
				},
				{
					title: "Номер шасси",
					value: car.chassisNumber
				},
				{
					title: "Гос.знак",
					value: car.registrationNumber
				},
				{
					title: "Марка",
					value: getMarkModelNameById(car.markId, MotorService.InfoType.MARKS)
				},
				{
					title: "Модель",
					value: getMarkModelNameById(car.modelId, MotorService.InfoType.MODELS)
				},
				{
					title: "Год выпуска",
					value: car.issueYear
				},
				{
					title: "Категория ТС",
					value: car.category
				},
				{
					title: "Цвет кузова",
					value: car.bodyColor
				},
				{
					title: "Мощность двигателя (л/с)",
					value: car.enginePower
				},
				{
					title: "Разрешенная макс. масса",
					value: car.maxMass
				},
				{
					title: "Серия и номер СТС",
					value: car.registrationCertificate.number
				}
			],
			[
				{
					title: "Дата выдачи СТС",
					value: car.registrationCertificate.issueDate
				},
				{
					title: "Cерия номер ПТС/ЭПТС",
					value: car.passport.number
				},
				{
					title: "Дата выдачи ПТС/ЭПТС",
					value: car.passport.issueDate
				},
				{
					title: "Регион регистрации ТС",
					value: car.registrationRegionString
				},
				{
					title: "Цель использования ТС",
					value: car.usage
				},
				{
					title: "Пробег",
					value: car.mileage
				},
				{
					title: "Количество пассажирских мест для категории D",
					value: 0
				},
				{
					title: "Дата начала страхования",
					value: car.startDate
				},
				{
					title: "Дата окончания страхования",
					value: car.endDate
				},
				{
					title: "Полная стоимость ТС",
					value: car.totalCost
				},
				{
					title: "Страховая сумма ТС",
					value: car.insuranceSum
				}
			]
		]
	}

	return {
		getMarkModelNameById,
		getDataListsByIndex,
		fetchAvtocodeData,
		isLoadingAutocode,
		getCarByIndex,
		modelOptions,
		isLoadingData,
		tableColumns,
		markOptions,
		isAllKasco,
		isAllOsago,
		checkboxes,
		isLoading,
		deleteCar,
		store,
		data
	}
}
