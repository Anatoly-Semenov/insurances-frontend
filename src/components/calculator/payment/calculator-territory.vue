<template>
	<calculator-block
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__territory" :class="{ _closed: !isDetails }">
			<div class="calculator__territory-intro">
				<p>Территория страхования № {{ index + 1 }}</p>

				<div class="calculator__territory-buttons">
					<ui-button
						:disabled="!isSecurityAssist"
						@click="store.deleteTerritory(index)"
						type="danger"
						:id="`${CalculatorFields.Territory.DELETE_TERRITORY}-${index}`"
					>
						Удалить Территорию
						<delete-outlined />
					</ui-button>
					<button
						class="calculator__territory-toggle"
						:class="{ _open: isDetails }"
						@click="isDetails = !isDetails"
					>
						<down-outlined />
					</button>
				</div>
			</div>
			<transition name="slide-fade-top">
				<div class="calculator__territory-data" v-if="isDetails">
					<div class="calculator__territory-info">
						<div class="calculator__territory-type">
							<div class="calculator__territory-radio">
								<p class="calculator__territory-subtitle">
									<span class="calculator__territory-required">*</span>
									Тип территории
								</p>
								<ui-radio
									:options="territoryTypeOptions"
									:value="selectedTerritoryType"
									@change="
										store.setTerritoryFieldValue(
											props.index,
											'selectedTerritoryType',
											$event
										)
									"
									:id="`${CalculatorFields.Territory.TERRITORY_TYPE}-${props.index}`"
								/>
							</div>
							<ui-select
								v-if="isRegionFieldVisible"
								title="Регион"
								:options="subjectsOfFederationsOptions"
								:value="subjectOfFederationsValue"
								:mode="
									selectedTerritoryType === 1
										? IUiSelect.Mode.MULTIPLE
										: IUiSelect.Mode.DEFAULT
								"
								required
								@change="
									store.setTerritoryFieldValue(
										props.index,
										'subjectOfFederations',
										$event
									)
								"
								:id="`${CalculatorFields.Territory.SUBJECT_OF_FEDERATIONS}-${props.index}`"
							/>
							<div class="calculator__territory" v-if="isAddressFieldsVisible">
								<component
									v-for="(
										{
											component,
											required,
											options,
											setKey,
											value,
											title,
											mode
										},
										index
									) in fields"
									:key="index + title"
									:is="component"
									:options="options"
									:title="title"
									:mode="mode"
									:value="value"
									:error="errorEmpty(setKey)"
									:required="required"
									:id="`${setKey}-${index}`"
									@input:value="
										component === 'ui-input' &&
											store.setTerritoryFieldValue(props.index, setKey, $event)
									"
									@change="
										component === 'ui-select' &&
											store.setTerritoryFieldValue(props.index, setKey, $event)
									"
								/>
							</div>
						</div>

						<div class="calculator__territory-list">
							<p class="calculator__territory-subtitle">Факторы</p>

							<ui-checkbox
								v-for="({ label, value }, index) in factorsOptions"
								:key="index"
								:id="`${CalculatorFields.Territory.FACTORS}-${index + 1}`"
								type="checkbox"
								:value="factors.map((factor) => factor.id).includes(value)"
								@change="
									setFactors({
										territoryIndex: props.index,
										value,
										isActive: $event
									})
								"
							>
								{{ label }}
							</ui-checkbox>
						</div>
					</div>
					<div class="calculator__territory-intro">
						<p class="calculator__territory-subtitle">
							Перечень застрахованного имущества
						</p>
						<ui-button
							:disabled="!isSecurityAssist"
							@click="store.addAssetItem(index)"
							:id="`${CalculatorFields.Territory.ADD_ASSET_ITEM}-${index}`"
						>
							Добавить имущество
							<car-outlined />
						</ui-button>
					</div>

					<a-table
						class="ui-table"
						:class="{ _loading: isLoading }"
						:columns="tableColumns"
						:dataSource="assetList"
						:rowKey="(row) => row.id"
						:scroll="{ x: 1300 }"
					>
						<template #bodyCell="{ column, record, index }">
							<template v-if="column.key === 'name'">
								<ui-select
									:options="machineryGroupsOptions"
									:value="+store.getAssetItemValue(props.index, index, 'name')"
									size="small"
									:id="`${CalculatorFields.Territory.ASSET_ITEM_NAME}-${index}`"
									@change="
										store.setAssetItemValue(props.index, index, 'name', $event)
									"
								/>
							</template>
							<template v-for="field in inputFields" :key="field">
								<ui-input
									:value="store.getAssetItemValue(props.index, index, field)"
									v-if="column.key === field"
									size="small"
									:id="`${field}-${index}`"
									@input:value="
										store.setAssetItemValue(props.index, index, field, $event)
									"
								/>
							</template>

							<template v-if="column.key === 'delete'">
								<button
									class="calculator__territory-delete"
									@click="showDelete(props.index, index)"
									:id="`delete-${index + 1}`"
								>
									<delete-outlined />
								</button>
							</template>

							<template v-for="field in inputRubleFields" :key="field">
								<ui-input-number
									:value="store.getAssetItemValue(props.index, index, field)"
									:formatter="numberRubFormatter"
									v-if="column.key === field"
									:parser="numberRubParser"
									isAddonAfter
									size="small"
									:id="`${field}-${index}`"
									@input:value="
										store.setAssetItemValue(props.index, index, field, $event)
									"
								>
									<template #addonAfter>Руб.</template>
								</ui-input-number>
							</template>
						</template>
					</a-table>
				</div>
			</transition>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
import { createVNode } from "vue"

// Components
import { calculatorBlock } from "~/components/calculator"
import ATable from "ant-design-vue/lib/table"
import { Modal } from "ant-design-vue"

// Icons
import {
	ExclamationCircleOutlined,
	DeleteOutlined,
	DownOutlined,
	CarOutlined
} from "@ant-design/icons-vue"

// Hooks
import { useStore, useError, useFields } from "~/hooks"

// Types
import type { UiRadio, UiTable, UiSelect } from "~/types"
import { Calculator, Info, CalculatorFields } from "@common-repo/types/src"
import { UiSelect as IUiSelect } from "~/types"
import { PropType } from "@vue/runtime-core"

interface Field {
	readonly options?: ComputedRef<IUiSelect.Options>
	readonly mode?: IUiSelect.Mode
	readonly component?: string
	readonly setKey: string
	readonly required: boolean
	readonly title: string
	value: any
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.SPECTECH
	},
	index: {
		type: Number,
		default: 0
	},
	cadastralNumber: {
		type: String,
		default: ""
	},
	city: {
		type: String,
		default: ""
	},
	house: {
		type: String,
		default: ""
	},
	id: {
		type: Number,
		default: 0
	},
	number: {
		type: Number,
		default: 0
	},
	office: {
		type: Number,
		default: 0
	},
	selectedTerritoryType: {
		type: Number,
		default: 0
	},
	street: {
		type: String,
		default: ""
	},
	subjectOfFederations: {
		type: Array,
		default: []
	},
	assetList: {
		type: Array,
		default: []
	},
	factors: {
		type: Array,
		default: []
	}
})

// Store
const { store, infoStore, configStore } = useStore(props.type)

// Data
const isDetails = ref<boolean>(true)
const isLoading = ref<boolean>(true)
const types = Calculator.TypeEnum

const inputFields = [
	"productionYear",
	"engineNumber",
	"vendorName",
	"modelName"
]

const inputRubleFields = ["sumZalog", "sum"]

// Computed
const isSecurityAssist = computed(() => getField<boolean>("isSecurityAssist"))

const isRegionFieldVisible = computed((): boolean => {
	return props.selectedTerritoryType > 0 && props.selectedTerritoryType < 4
})

const isAddressFieldsVisible = computed((): boolean => {
	return props.selectedTerritoryType === 3
})

const subjectOfFederationsValue = computed((): number | number[] => {
	if (props.selectedTerritoryType === 1) {
		return props?.subjectOfFederations.map((subject) => {
			return subject?.id || 0
		})
	} else {
		return props?.subjectOfFederations?.[0]?.id || 0
	}
})

const subjectsOfFederationsOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.SUBJECTS_OF_FEDERATION)
})

const machineryGroupsOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.MACHINERY_GROUPS)
})

const territoryTypeOptions = computed((): UiRadio.Options => {
	return infoStore.getInfo(Info.InfoType.TERRITORY_TYPES)
})

const factorsOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.FACTORS)
})

const fields = computed((): Field[] => {
	return [
		{
			title: "Населенный пункт",
			component: "ui-input",
			value: props.city,
			required: true,
			setKey: "city"
		},
		{
			title: "Улица",
			component: "ui-input",
			value: props.street,
			required: true,
			setKey: "street"
		},
		{
			title: "Дом, литера, поле",
			component: "ui-input",
			value: props.house,
			required: true,
			setKey: "house"
		},
		{
			title: "Офис, помещение",
			component: "ui-input",
			value: props.office,
			required: false,
			setKey: "office"
		},
		{
			title: "Кадастровый номер",
			component: "ui-input",
			value: props.cadastralNumber,
			required: false,
			setKey: "cadastralNumber"
		}
	]
})

const tableColumns: UiTable.Column[] = [
	{
		title: "Наименование",
		dataIndex: "name",
		key: "name",
		scopedSlots: { customRender: "name" },
		align: "center",
		width: 300
	},
	{
		title: "Марка",
		dataIndex: "vendorName",
		key: "vendorName",
		scopedSlots: { customRender: "vendorName" },
		align: "center"
	},
	{
		title: "Модель",
		dataIndex: "modelName",
		key: "modelName",
		scopedSlots: { customRender: "modelName" },
		align: "center"
	},
	{
		title: "Год выпуска",
		dataIndex: "productionYear",
		key: "productionYear",
		scopedSlots: { customRender: "productionYear" },
		align: "center"
	},
	{
		title: "№ двигателя",
		dataIndex: "engineNumber",
		key: "engineNumber",
		scopedSlots: { customRender: "engineNumber" },
		align: "center"
	},
	{
		title: "Страховая сумма, руб.",
		dataIndex: "sum",
		key: "sum",
		scopedSlots: { customRender: "sum" },
		align: "center",
		width: 200
	},
	{
		title: "Страховая стоимость, руб.",
		dataIndex: "sumZalog",
		key: "sumZalog",
		scopedSlots: { customRender: "sumZalog" },
		align: "center",
		width: 200
	},
	{
		title: "",
		dataIndex: "delete",
		key: "delete",
		scopedSlots: { customRender: "delete" },
		align: "center",
		width: 40
	}
]

// Methods
const { errorEmpty } = useError()
const { numberRubFormatter, numberRubParser } = useFields()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "territory", fieldName)
}

function setFactors({
	territoryIndex,
	value,
	isActive
}: {
	territoryIndex: number
	value: number
	isActive: boolean
}): void {
	store.setFactors({
		territoryIndex,
		type: isActive ? "add" : "delete",
		value
	})
}

function showDelete(territoryIndex: number, assetIndex: number): void {
	Modal.confirm({
		class: "ui-modal",
		title: "Вы действительно хотите удалить это имущество",
		icon: createVNode(ExclamationCircleOutlined),
		content: `№ имущества - ${assetIndex + 1}`,
		okText: "Да",
		okType: "danger",
		cancelText: "Нет",
		width: 500,
		async onOk(): Promise<void> {
			store.deleteAsset(territoryIndex, assetIndex)
		}
	})
}
</script>
