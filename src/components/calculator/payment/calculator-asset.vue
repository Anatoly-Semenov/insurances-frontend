<template>
	<div
		class="calculator__asset"
		:class="{
			_open: isOpenBlock,
			_openTable: isOpenTable,
			_fullscreen: isFullScreen,
			_loadingDeal: isLoadingDeal
		}"
	>
		<calculator-block
			:title="`Территория страхования № ${number + 1}`"
			:loading="store.getIsLoading"
			:disabled="store.getIsDisabledFields"
			:isContent="isOpenBlock"
		>
			<template #header>
				<div class="calculator__asset-buttons">
					<ui-button
						class="calculator__asset-delete"
						@click="showDelete(number)"
						type="default"
						size="middle"
					>
						<delete-outlined />
						Удалить Территорию
					</ui-button>
					<button
						class="calculator__block-button"
						@click="isFullScreen = !isFullScreen"
						:id="Fields.Motor.TOGGLE_FULL_SCREEN"
						v-if="isOpenBlock"
					>
						<fullscreen-exit-outlined v-if="isFullScreen" />
						<fullscreen-outlined v-else />
					</button>
					<button
						class="calculator__block-button"
						:class="{ _open: isOpenBlock }"
						@click="setIsOpenBlock"
					>
						<down-outlined />
					</button>
				</div>
			</template>

			<div class="calculator__asset-container" v-if="isOpenBlock">
				<div class="calculator__asset-info">
					<div class="calculator__asset-fields">
						<component
							v-for="(
								{ title, options, value, setKey, component, mode, isReadOnly },
								index
							) in fields"
							:key="index + title"
							:error="errorEmpty(setKey)"
							:isReadOnly="isReadOnly"
							:options="options"
							:title="title"
							:value="value"
							:mode="mode"
							:is="component"
							:loading="activeLoadingField === setKey"
							required
							@input:value="
								component === 'ui-input' &&
									!isReadOnly &&
									store.setTerritoryFieldValue(props.number, setKey, $event)
							"
							@change="
								setSelectField({
									isReadOnly: isReadOnly,
									component: component,
									setKey: setKey,
									value: $event
								})
							"
							@click="onFocusField(setKey)"
						/>
					</div>

					<div class="calculator__asset-factors">
						<div class="calculator__asset-factors-row">
							<p class="calculator__asset-subtitle">Факторы</p>

							<button
								class="calculator__asset-factors-toggle"
								:class="{ _open: isOpenFactors }"
								@click="isOpenFactors = !isOpenFactors"
							>
								<down-outlined />
							</button>
						</div>

						<transition name="slide-fade-top">
							<div class="calculator__asset-factors-list" v-if="isOpenFactors">
								<ui-checkbox
									v-for="({ name, id, selected }, index) in factors"
									:key="index"
									:id="`factors-${index + 1}`"
									type="checkbox"
									:value="selected"
									@change="
										setFactors({
											territoryIndex: props.number,
											value: id,
											isActive: $event
										})
									"
								>
									{{ name }}
								</ui-checkbox>
							</div>
						</transition>
					</div>
				</div>
				<div class="calculator__asset-action">
					<div class="calculator__asset-action-container">
						<p class="calculator__asset-subtitle">
							Перечень застрахованного имущества
						</p>
						<ui-button
							@click="store.addAssetItem(number), (isOpenTable = true)"
						>
							Добавить
						</ui-button>
					</div>
					<button
						class="calculator__asset-factors-toggle"
						:class="{ _open: isOpenTable }"
						@click="isOpenTable = !isOpenTable"
					>
						<down-outlined />
					</button>
				</div>
			</div>
		</calculator-block>
		<transition name="slide-fade-top">
			<a-table
				class="ui-table calculator__asset-table"
				:class="{ _loading: isLoading }"
				:scroll="{ x: isFullScreen ? false : 1500 }"
				:rowKey="(row) => row.id"
				:pagination="pagination"
				:dataSource="assetList"
				:columns="tableColumns"
				v-if="isOpenBlock && isOpenTable"
			>
				<template #bodyCell="{ column, record, index }">
					<div
						class="calculator__asset-group"
						v-if="column.key === 'insuranceObjectName'"
					>
						<ui-select
							:options="insuranceObjectsOptions"
							:value="
								store.getAssetItemValue(
									props.number,
									index,
									'insuranceObjectName'
								)
							"
							@change="
								store.setAssetItemValue(
									props.number,
									index,
									'insuranceObjectName',
									$event
								)
							"
						/>
						<ui-checkbox
							:value="
								store.getAssetItemValue(props.number, index, 'isBuildings')
							"
							@change="
								store.setAssetItemValue(
									props.number,
									index,
									'isBuildings',
									$event
								)
							"
						>
							Застраховать отдельные элементы
						</ui-checkbox>
						<ui-select
							v-if="store.getAssetItemValue(props.number, index, 'isBuildings')"
							:options="
								store.getInsuranceSubObjectsOptions(props.number, index)
							"
							:value="
								store.getAssetItemValue(
									props.number,
									index,
									'subInsuranceObjectName'
								)
							"
							@change="
								store.setAssetItemValue(
									props.number,
									index,
									'subInsuranceObjectName',
									$event
								)
							"
						/>
					</div>
					<template v-if="column.key === 'isTitul'">
						<ui-checkbox
							:value="store.getAssetItemValue(props.number, index, 'isTitul')"
							@change="
								store.setAssetItemValue(props.number, index, 'isTitul', $event)
							"
						/>
					</template>
					<template v-if="column.key === 'description'">
						<ui-input
							:value="
								store.getAssetItemValue(props.number, index, 'description')
							"
							@input:value="
								store.setAssetItemValue(
									props.number,
									index,
									'description',
									$event
								)
							"
						/>
					</template>
					<template v-if="column.key === 'square'">
						<ui-input
							:value="store.getAssetItemValue(props.number, index, 'square')"
							@input:value="
								store.setAssetItemValue(props.number, index, 'square', $event)
							"
						/>
					</template>
					<template v-if="column.key === 'inventoryNumber'">
						<ui-input
							:value="
								store.getAssetItemValue(props.number, index, 'inventoryNumber')
							"
							@input:value="
								store.setAssetItemValue(
									props.number,
									index,
									'inventoryNumber',
									$event
								)
							"
						/>
					</template>
					<template v-if="column.key === 'insuranceSum'">
						<ui-input-number
							:value="
								store.getAssetItemValue(props.number, index, 'insuranceSum')
							"
							@input:value="
								store.setAssetItemValue(
									props.number,
									index,
									'insuranceSum',
									$event
								)
							"
							:formatter="numberRubFormatter"
							:parser="numberRubParser"
							isAddonAfter
						>
							<template #addonAfter>Руб.</template>
						</ui-input-number>
					</template>
					<template v-if="column.key === 'insuranceCost'">
						<ui-input-number
							:value="
								store.getAssetItemValue(props.number, index, 'insuranceCost')
							"
							@input:value="
								store.setAssetItemValue(
									props.number,
									index,
									'insuranceCost',
									$event
								)
							"
							:formatter="numberRubFormatter"
							:parser="numberRubParser"
							isAddonAfter
						>
							<template #addonAfter>Руб.</template>
						</ui-input-number>
					</template>
				</template>
			</a-table>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { createVNode } from "vue"

// Components
import {
	DownOutlined,
	DeleteOutlined,
	FullscreenOutlined,
	FullscreenExitOutlined,
	ExclamationCircleOutlined
} from "@ant-design/icons-vue"
import { Modal } from "ant-design-vue"
import ATable from "ant-design-vue/lib/table"
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError, useFields } from "~/hooks"

// Types
import {
	Info,
	Calculator,
	CalculatorFields as Fields
} from "@common-repo/types/src"
import type { UiTable, UiSelect, UiInput } from "~/types"
import { AssetService, UiSelect as IUiSelect } from "~/types"
import { PropType } from "@vue/runtime-core"

interface Field {
	options?: ComputedRef<IUiSelect.Options>
	setKey: keyof AssetService.Territory
	mode?: IUiSelect.Mode
	isReadOnly?: boolean
	component?: string
	title: string
	value: any
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.ASSET
	},
	id: {
		type: Number,
		default: 0
	},
	number: {
		type: Number,
		default: 0
	},
	selectedIndustry: {
		type: Number,
		default: 0
	},
	selectedIndustryActivity: {
		type: Number,
		default: 0
	},
	InsuranceRiskClass: {
		type: String,
		default: ""
	},
	sogazRiskClass: {
		type: Number,
		default: 0
	},
	realty: {
		type: Number,
		default: 0
	},
	incompleteConstructionType: {
		type: Number,
		default: 0
	},
	conservationType: {
		type: Number,
		default: 0
	},
	realtyType: {
		type: Number,
		default: 0
	},
	area: {
		type: String,
		default: ""
	},
	yearOfBuilding: {
		type: Number,
		default: 0
	},
	federalDistrict: {
		type: Number,
		default: 0
	},
	subjectOfFederation: {
		type: Number,
		default: 0
	},
	populationArea: {
		type: String,
		default: ""
	},
	address: {
		type: String,
		default: ""
	},
	factors: {
		type: Array,
		default: []
	},
	assetList: {
		type: Array,
		default: []
	},
	insuranceObjects: {
		type: Array,
		default: []
	},
	isLoadingDeal: {
		type: Boolean,
		default: false
	}
})

// Store
const { store, infoStore, configStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum
const isOpenBlock = ref<boolean>(false)
const isOpenTable = ref<boolean>(false)
const isFullScreen = ref<boolean>(false)
const isOpenFactors = ref<boolean>(false)
const activeLoadingField = ref<string>("")

// Computed
const industryOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.ASSET_INDUSTRIES)
})
const industryTypeOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.ASSET_INDUSTRIES_TYPES)
})
const realtyOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.REALTY)
})
const incompleteConstructionTypeOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.INCOMPLETE_CONSTRUCTION_TYPES)
})
const conservationTypeOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.CONSERVATION_TYPE)
})
const realtyTypeOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.REALTY_TYPE)
})
const federalDistrictOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.FEDERAL_DISTRICTS)
})
const subjectOfFederationOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.SUBJECTS_OF_FEDERATION)
})
const insuranceObjectsOptions = computed((): UiSelect.Options => {
	return infoStore.getAssetInsuranceObjects.map(
		({
			isChildRequired,
			subObjects,
			selected,
			sumZalog,
			isLock,
			name,
			sum,
			id
		}: AssetService.InsuranceObject) => {
			return {
				isChildRequired,
				label: name,
				subObjects,
				value: id,
				sumZalog,
				selected,
				isLock,
				sum
			}
		}
	)
})

const fields = computed((): Field[] => {
	return [
		{
			title: "Отрасль фактической деятельности",
			component: "ui-select",
			options: industryOptions,
			value: props.selectedIndustry,
			setKey: "selectedIndustry"
		},
		{
			title: "Вид фактической деятельности на территории страхования",
			component: "ui-select",
			options: industryTypeOptions,
			value: props.selectedIndustryActivity,
			setKey: "selectedIndustryActivity"
		},
		{
			title: "Класс риска Страхование",
			component: "ui-input",
			value: props.InsuranceRiskClass,
			setKey: "InsuranceRiskClass",
			isReadOnly: true
		},
		{
			title: "Класс риска СОГАЗ",
			component: "ui-input",
			value: props.sogazRiskClass,
			setKey: "sogazRiskClass",
			isReadOnly: true
		},
		{
			title: "Объект недвижимости представляет собой",
			component: "ui-select",
			options: realtyOptions,
			value: props.realty,
			setKey: "realty"
		},
		{
			title: "Объект незавершенного строительства",
			component: "ui-select",
			options: incompleteConstructionTypeOptions,
			value: props.incompleteConstructionType,
			setKey: "incompleteConstructionType"
		},
		{
			title: "Объект не эксплуатируется (на консервации)",
			component: "ui-select",
			options: conservationTypeOptions,
			value: props.conservationType,
			setKey: "conservationType"
		},
		{
			title: "Конструктивный тип здания",
			component: "ui-select",
			options: realtyTypeOptions,
			value: props.realtyType,
			setKey: "realtyType"
		},
		{
			title: "Площадь здания (м2)",
			component: "ui-input",
			value: props.area,
			setKey: "area"
		},
		{
			title: "Год постройки/капитального ремонта здания",
			component: "ui-input",
			value: props.yearOfBuilding,
			setKey: "yearOfBuilding"
		},
		{
			title: "Федеральный округ",
			component: "ui-select",
			options: federalDistrictOptions,
			value: props.federalDistrict,
			setKey: "federalDistrict"
		},
		{
			title: "Субъект Российской Федерации",
			component: "ui-select",
			options: subjectOfFederationOptions,
			value: props.subjectOfFederation,
			setKey: "subjectOfFederation"
		},
		{
			title: "Населенный пункт",
			component: "ui-input",
			value: props.populationArea,
			setKey: "populationArea"
		},
		{
			title: "Улица, дом, строение, корпус, помещение",
			component: "ui-input",
			value: props.address,
			setKey: "address"
		}
	]
})

const tableColumns: UiTable.Column[] = [
	{
		title: "Номенклатурная группа",
		dataIndex: "insuranceObjectName",
		key: "insuranceObjectName",
		scopedSlots: { customRender: "insuranceObjectName" },
		align: "center",
		width: 300
	},
	{
		title: "Титул",
		dataIndex: "isTitul",
		key: "isTitul",
		scopedSlots: { customRender: "isTitul" },
		align: "center"
	},
	{
		title: "Детализация имущества",
		dataIndex: "description",
		key: "description",
		scopedSlots: { customRender: "description" },
		align: "center"
	},
	{
		title: "Количество (ед. изм./кв. м./шт)",
		dataIndex: "square",
		key: "square",
		scopedSlots: { customRender: "square" },
		align: "center"
	},
	{
		title: "Кадастровый / Инвентарный номер",
		dataIndex: "inventoryNumber",
		key: "inventoryNumber",
		scopedSlots: { customRender: "inventoryNumber" },
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
		title: "Страховая стоимость, руб.",
		dataIndex: "",
		key: "insuranceCost",
		scopedSlots: { customRender: "insuranceCost" },
		align: "center"
	}
]

// Methods
const { numberRubFormatter, numberRubParser } = useFields()
const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "territory", fieldName)
}

function setFactors({
	territoryIndex,
	isActive,
	value
}: {
	territoryIndex: number
	isActive: boolean
	value: number
}): void {
	store.setFactors({
		territoryIndex,
		type: isActive ? "add" : "delete",
		value
	})
}

function setSelectField({
	isReadOnly = false,
	component,
	setKey,
	value
}: {
	setKey: keyof AssetService.Territory
	isReadOnly: boolean
	component: string
	value: string
}): void {
	if (!isReadOnly && component === "ui-select") {
		setTerritoryFieldValue({
			index: props.number,
			field: setKey,
			value
		})
	}
}

function setTerritoryFieldValue({
	index,
	field,
	value
}: {
	index: number
	field: keyof AssetService.Territory
	value: any
}): void {
	store.setTerritoryFieldValue(index, field, value)

	{
		function resetField(name: string): void {
			store.setTerritoryFieldValue(index, name, "")
		}

		if (field === "selectedIndustry") {
			infoStore.fetchAssetIndustriesTypes(value)

			resetField("selectedIndustryActivity")
		}

		if (field === "federalDistrict") {
			infoStore.fetchSubjectsOfFederation(value, props.type)

			resetField("subjectOfFederation")
		}
	}
}

async function onFocusField(
	field: keyof AssetService.Territory
): Promise<void> {
	activeLoadingField.value = field

	switch (field) {
		case "selectedIndustryActivity":
			props.selectedIndustry &&
				(await infoStore.fetchAssetIndustriesTypes(props.selectedIndustry))
			break
		case "subjectOfFederation":
			await infoStore.fetchSubjectsOfFederation(
				props.federalDistrict,
				props.type
			)
			break
		default:
			break
	}

	activeLoadingField.value = ""
}

function setIsOpenBlock(): void {
	const value = !isOpenBlock.value

	isOpenBlock.value = value

	if (!value) {
		isFullScreen.value = false
	}
}

function showDelete(index: number): void {
	Modal.confirm({
		title: "Вы действительно хотите удалить эту территорию",
		// @ts-ignore
		icon: createVNode(ExclamationCircleOutlined),
		content: `№ территории - ${index + 1}`,
		cancelText: "Нет",
		okType: "danger",
		class: "ui-modal",
		okText: "Да",
		width: 500,

		onOk(): void {
			store.deleteTerritory(index)
		}
	})
}

async function prefetchLists(): Promise<void> {
	const promises: Promise<void>[] = []

	if (props.selectedIndustryActivity && props.selectedIndustry) {
		promises.push(infoStore.fetchAssetIndustriesTypes(props.selectedIndustry))
	}

	if (props.federalDistrict) {
		promises.push(
			infoStore.fetchSubjectsOfFederation(props.federalDistrict, props.type)
		)
	}

	await Promise.all(promises)
}

onMounted(() => {
	if (!props.number) {
		isOpenBlock.value = true
	}

	prefetchLists()
})
</script>
