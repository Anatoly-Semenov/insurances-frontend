<template>
	<div
		class="calculator__cars"
		:class="{
			_fullscreen: isFullScreen,
			_loading: isLoadingData
		}"
	>
		<calculator-block
			title="Сводные данные по автомобилям"
			class="calculator__cars-block"
			:loading="isLoadingData"
			:disabled="store.getIsDisabledFields"
		>
			<template #header>
				<div class="calculator__cars-head">
					<ui-checkbox
						v-for="({ text, value, id }, index) in checkboxes"
						:value="value"
						type="checkbox"
						:key="id"
						:id="id"
						@change="checkboxes[index].value = $event"
					>
						{{ text }}
					</ui-checkbox>
					<button
						class="calculator__block-button"
						@click="isFullScreen = !isFullScreen"
						:id="Fields.Motor.TOGGLE_FULL_SCREEN"
					>
						<fullscreen-exit-outlined v-if="isFullScreen" />
						<fullscreen-outlined v-else />
					</button>
				</div>
			</template>
			<div class="calculator__cars-container">
				<p class="calculator__cars-subtitle">
					Реестр для заполнения данных по авто Скачать файл для заполнения
				</p>
				<div class="calculator__cars-actions">
					<ui-button
						@click="fetchAvtocodeData"
						:disabled="!store.getVinNumbers.length"
						:loading="isLoadingAutocode"
						:id="Fields.Motor.FETCH_AUTO_CODE"
						type="default"
					>
						Обогатить данные автокодом
					</ui-button>
					<ui-button
						@click="store.createEmptyCar"
						type="default"
						:id="Fields.Motor.ADD_AUTO"
					>
						Добавить авто
					</ui-button>
				</div>
			</div>
		</calculator-block>
		<a-table
			class="ui-table calculator__cars-table"
			:class="{ _loading: isLoading }"
			:columns="tableColumns"
			:dataSource="data"
			:pagination="pagination"
			:scroll="{ x: isFullScreen ? false : 2000 }"
		>
			<template #bodyCell="{ column, record, index }">
				<template v-if="textFields.includes(column.key)">
					<!--					<p :id="Fields.Motor.ID">{{ index + 1 }}</p>-->
					<p :id="getIdByColumnKey(column.key)">
						<template v-if="column.key === 'id'">
							{{ store.getCarField(column.key, index) + 1 }}
						</template>
						<template v-else>
							{{ store.getCarField(column.key, index) }}
						</template>
					</p>
				</template>

				<template v-if="column.key === 'startDate'">
					<ui-date-picker
						:value="store.getCarField('startDate', index)"
						:id="Fields.Motor.START_DATE"
						@change="store.setCarField('startDate', $event, index)"
					/>
				</template>

				<template v-if="column.key === 'brand'">
					<ui-select
						title="Марка"
						:options="markOptions"
						:size="Select.SizeEnum.DEFAULT"
						:value="store.getCarField('markId', index)"
						:id="Fields.Motor.BRAND"
						@change="setMark($event, index)"
					/>
				</template>
				<template v-if="column.key === 'model'">
					<ui-select
						title="Модель"
						:options="modelOptions"
						:size="Select.SizeEnum.DEFAULT"
						:value="store.getCarField('modelId', index)"
						:loading="isLoadingModel"
						:disabled="!store.getCarField('markId', index)"
						:id="Fields.Motor.MODEL"
						@change="store.setCarField('modelId', $event, index)"
						@focusin="fetchModels(store.getCarField('markId', index))"
					/>
				</template>

				<template v-if="column.key === 'isKasco'">
					<ui-checkbox
						:value="store.getCarField('isKasco', index)"
						type="checkbox"
						:id="Fields.Motor.IS_KASCO"
						@change="store.setCarField('isKasco', $event, index)"
					/>
				</template>
				<template v-if="column.key === 'isOsago'">
					<ui-checkbox
						:value="store.getCarField('isOsago', index)"
						type="checkbox"
						:id="Fields.Motor.IS_OSAGO"
						@change="store.setCarField('isOsago', $event, index)"
					/>
				</template>
				<template v-if="column.key === 'isNew'">
					<ui-checkbox
						:value="store.getCarField('isNew', index)"
						type="checkbox"
						:id="Fields.Motor.IS_NEW"
						@change="store.setCarField('isNew', $event, index)"
					/>
				</template>

				<template v-if="column.key === 'vin'">
					<ui-input
						:value="store.getCarField('vin', index)"
						:error="errorEmpty(store.getCarField('vin', index))"
						:size="Input.SizeEnum.SMALL"
						:id="Fields.Motor.VIN"
						@input:value="store.setCarField('vin', $event, index)"
					/>
				</template>
				<template v-if="column.key === 'chassisNumber'">
					<ui-input
						:value="store.getCarField('chassisNumber', index)"
						:error="errorEmpty(store.getCarField('chassisNumber', index))"
						:size="Input.SizeEnum.SMALL"
						:id="Fields.Motor.CHASSIS_NUMBER"
						@input:value="store.setCarField('chassisNumber', $event, index)"
					/>
				</template>
				<template v-if="column.key === 'registrationNumber'">
					<ui-input
						:value="store.getCarField('registrationNumber', index)"
						:error="errorEmpty(store.getCarField('registrationNumber', index))"
						:size="Input.SizeEnum.SMALL"
						:id="Fields.Motor.REGISTRATION_NUMBER"
						@input:value="
							store.setCarField('registrationNumber', $event, index)
						"
					/>
				</template>

				<template v-if="column.key === 'edit'">
					<ui-tooltip title="Редактировать автомобиль">
						<button
							class="calculator__cars-action _edit"
							@click="openEdit(index)"
							:disabled="isLoadingData"
							:id="`${Fields.Motor.EDIT}-${index + 1}`"
						>
							<edit-outlined />
						</button>
					</ui-tooltip>
				</template>
				<template v-if="column.key === 'delete'">
					<ui-tooltip title="Удалить автомобиль">
						<button
							class="calculator__cars-action _delete"
							@click="deleteCar(index)"
							:disabled="isLoadingData"
							:id="`${Fields.Motor.DELETE}-${index + 1}`"
						>
							<delete-outlined />
						</button>
					</ui-tooltip>
				</template>
			</template>
			<template #expandedRowRender="{ record, index }">
				<div class="calculator__cars-data">
					<a-timeline
						v-for="(list, listIndex) in getDataListsByIndex(index)"
						:key="`list ${listIndex}`"
					>
						<a-timeline-item
							v-for="({ title, value }, index) in list"
							:key="title + index"
							color="var(--color-text)"
						>
							<div class="calculator__cars-data-item">
								<p class="calculator__cars-param">{{ title }}:</p>
								<p class="calculator__cars-value">{{ value }}</p>
							</div>
						</a-timeline-item>
					</a-timeline>
				</div>
			</template>
		</a-table>
		<calculator-cars-detail
			:isDisplay="isDetail"
			:index="detailIndex"
			:type="type"
			@close="closeEdit"
		/>
	</div>
</template>

<script lang="ts" setup>
// Components
import { calculatorBlock } from "~/components/calculator"
import { calculatorCarsDetail } from "./"
import ATable from "ant-design-vue/lib/table"
import ATimeline, {
	TimelineItem as ATimelineItem
} from "ant-design-vue/lib/timeline"
import {
	FullscreenOutlined,
	FullscreenExitOutlined,
	DeleteOutlined,
	EditOutlined
} from "@ant-design/icons-vue"

// Hooks
import { useError, useCalculatorCars } from "~/hooks"

// Types
import { UiSelect as Select, UiInput as Input } from "~/types"
import type { PropType } from "@vue/runtime-core"
import {
	CalculatorFields as Fields,
	Calculator,
	MotorService
} from "@common-repo/types/src"
import CalculatorCarsDetail from "~/components/calculator/payment/calculator-cars-detail.vue"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Computed
const pagination = computed(() => {
	if (data.value?.length > 10) {
		return {}
	}

	return false
})

// Methods
const { errorEmpty } = useError()

// Data
const {
	getDataListsByIndex,
	fetchAvtocodeData,
	isLoadingAutocode,
	isLoadingData,
	tableColumns,
	modelOptions,
	markOptions,
	checkboxes,
	isLoading,
	deleteCar,
	store,
	data
} = useCalculatorCars(props.type)

const isLoadingModel = ref<boolean>(false)
const isFullScreen = ref<boolean>(false)
const isDetail = ref<boolean>(false)
const detailIndex = ref<number>(0)

const textFields: string[] = [
	"insurancePremiumOsago",
	"insuranceSum",
	"issueYear",
	"id"
]

// Methods
function openEdit(index: number): void {
	isDetail.value = true
	detailIndex.value = index
}

function closeEdit(): void {
	isDetail.value = false
	detailIndex.value = 0
}

async function fetchModels(markId: number): Promise<void> {
	store.resetModelsList()

	isLoadingModel.value = true

	await store.fetchInfoModels(markId)

	isLoadingModel.value = false
}

function setMark(value: number, index: number): void {
	store.setCarField("markId", value, index)
	store.setCarField("modelId", "", index)

	fetchModels(value)
}

function getIdByColumnKey(key: keyof typeof textFields): string {
	switch (key) {
		case "insurancePremiumOsago":
			return Fields.Motor.INSURANCE_PREMIUM_OSAGO
		case "insuranceSum":
			return Fields.Motor.INSURANCE_SUM
		case "issueYear":
			return Fields.Motor.ISSUE_YEAR
		case "id":
			return Fields.Motor.ID
	}

	return ""
}

onMounted(() => {
	Promise.all([
		store.fetchInfo(MotorService.InfoType.CATEGORIES),
		store.fetchInfo(MotorService.InfoType.MARKS)
	])
})
</script>
