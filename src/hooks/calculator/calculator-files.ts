import _cloneDeep from "lodash/cloneDeep"

// Hooks
import { useStore } from "~/hooks"

// Types
import {
	Calculator,
	SmrService,
	UiSelect,
	UiTable,
	UiUpload
} from "@common-repo/types/src"
import { message } from "ant-design-vue"

export interface Data {
	required: boolean
	name: string
	fileList: UiUpload.FileList
	fileName: SmrService.FileName
	id: number
}

export function useCalculatorFiles(type: Calculator.Type) {
	// Store
	const { store } = useStore(type)

	// Methods
	function getBase64(img: Blob, callback: (base64Url: string) => void) {
		const reader = new FileReader()
		reader.addEventListener("load", () => callback(reader.result as string))
		reader.readAsDataURL(img)
	}

	function removeFile(name: SmrService.FileName): void {
		store.resetFile(name)
	}

	function deleteFileFromLoadingList(name: SmrService.FileName): void {
		const index: number = loadingFiles.findIndex((file) => file === name)

		if (index > -1) {
			loadingFiles.splice(index, 1)
		}
	}

	async function handleChangeUpload(
		info: UiUpload.UploadChangeParam,
		name: SmrService.FileName
	): Promise<void> {
		const displayError = () => {
			message.error("Ошибка загрузки файла")
		}

		if (info.file.status === "error") {
			displayError()

			return
		}

		loadingFiles.push(name)

		if (info.file.originFileObj) {
			await store.saveFile(info.file.originFileObj, name)
			store.setFileName(name, info?.file?.name || "")

			deleteFileFromLoadingList(name)
		} else {
			displayError()
		}
	}

	// Computed
	const title = computed((): string => {
		if (type === Calculator.TypeEnum.SMR)
			return "Документы необходимые для сделки"

		return "Документы"
	})

	const data = computed((): Data[] => {
		let list: Data[] = [
			{
				id: 1,
				name: "Договор генерального подряда / Договор подряда / Расчет стоимости строительства (РСС)",
				fileName: SmrService.FileName.CONTRACT,
				fileList: _cloneDeep(emptyFileList),
				required: true
			},
			{
				id: 2,
				name: "Доп. договор",
				fileName: SmrService.FileName.DOP_CONTRACT,
				fileList: _cloneDeep(emptyFileList),
				required: false
			}
		]

		const listAdditional = [
			{
				id: 3,
				name: "Разрешение на строительство",
				fileName: SmrService.FileName.BUILDING_PERMIT,
				fileList: _cloneDeep(emptyFileList),
				required: true
			},
			{
				id: 4,
				name: "Положительное заключение экспертизы проектной документации (НЕ «банковское» заключение строительной экспертизы)",
				fileName: SmrService.FileName.EXPERTISE,
				fileList: _cloneDeep(emptyFileList),
				required: true
			}
		]

		if (store.getBankFinance) {
			list = [...list, ...listAdditional]
		} else {
			list = [
				...list,
				{
					id: 3,
					name: "Смета / Сводно-сметный расчет",
					fileName: SmrService.FileName.WORK_SCHEDULE,
					fileList: _cloneDeep(emptyFileList),
					required: true
				},
				{
					id: 4,
					name: "Календарный график производства работ",
					fileName: SmrService.FileName.ESTIMATE,
					fileList: _cloneDeep(emptyFileList),
					required: true
				},
				...listAdditional
			]

			list[4].id = 5
			list[5].id = 6
		}

		if (store.getIsExpLessOneYear) {
			list.push({
				id: list.length + 2,
				name: "Выписка из ЕГРП (подрядчик)",
				fileName: SmrService.FileName.EXTRACT_FROM_EGRP,
				fileList: _cloneDeep(emptyFileList),
				required: true
			})
		}

		return list
	})

	// Data
	const loadingFiles: SmrService.FileName[] = []

	const emptyFileList: UiUpload.FileList = [
		{
			uid: "",
			name: "",
			status: "",
			url: ""
		}
	]

	const bankFinanceOptions: UiSelect.Options = [
		{
			value: 1,
			label: "Финансирование банка"
		},
		{
			value: 0,
			label: "Финансирование банка отсутствует"
		}
	]

	const tableColumns: UiTable.Column[] = [
		{
			title: "Название документа",
			dataIndex: "name",
			key: "name",
			slots: { title: "name" },
			scopedSlots: { customRender: "name" },
			align: "left"
		},
		{
			title: "Загрузка документа",
			dataIndex: "upload",
			key: "upload",
			slots: { title: "upload" },
			scopedSlots: { customRender: "upload" },
			align: "center"
		},
		{
			title: "",
			dataIndex: "delete",
			key: "delete",
			slots: { title: "delete" },
			scopedSlots: { customRender: "delete" },
			align: "right"
		}
	]

	return {
		bankFinanceOptions,
		handleChangeUpload,
		emptyFileList,
		loadingFiles,
		tableColumns,
		removeFile,
		getBase64,
		title,
		store,
		data
	}
}
