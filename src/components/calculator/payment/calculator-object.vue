<template>
	<calculator-block
		title="Данные объекта"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__object" v-if="type === types.ECO">
			<component
				v-for="(
					{ title, options, value, setKey, component, id }, index
				) in fields"
				:key="index + title"
				:id="id"
				:is="component"
				:title="title"
				:options="options"
				:value="value"
				:loading="isLoadingFields"
				required
				@change="component === 'ui-select' && set(setKey, $event)"
				@input:value="component === 'ui-input' && set(setKey, $event)"
			/>
			<div class="calculator__object-list">
				<ui-checkbox
					v-for="({ title, value, setKey, id }, index) in checkboxes"
					:key="index + title"
					:id="id"
					@change="set(setKey, $event)"
					:value="value"
					type="checkbox"
				>
					{{ title }}
				</ui-checkbox>
			</div>

			<p class="calculator__object-subtitle">Тип объекта</p>

			<div class="calculator__object-list">
				<ui-checkbox
					v-for="({ label, value }, index) in facilitiesTypesOptions"
					:key="index"
					:id="`facilitiesType-${index + 1}`"
					type="checkbox"
					:disabled="isLoadingFields"
					:value="facilityTypes.includes(value)"
					@change="setFacilityType({ value, isActive: $event })"
				>
					{{ label }}
				</ui-checkbox>
			</div>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError } from "~/hooks"

// Types
import { ComputedRef, PropType } from "@vue/runtime-core"
import {
	CalculatorFields as Fields,
	Calculator,
	Info
} from "@common-repo/types/src"
import type { UiSelect } from "~/types"

interface Field {
	title: string
	id: string
	component?: string
	options?: ComputedRef<UiSelect.Options>
	value: any
	setKey: string
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum
const isLoadingFields = ref<boolean>(false)

// Methods
const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "object", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "object", fieldName, value)
}

function setFacilityType({
	value,
	isActive
}: {
	value: number
	isActive: boolean
}): void {
	store.setFacilityType({ type: isActive ? "add" : "delete", value })
}

// Computed
const industriesOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.INDUSTRIES)
})
const facilitiesTypesOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.FACILITIES_TYPES)
})
const facilitiesDescriptionOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.FACILITIES_DESCRIPTION)
})

const industry = computed(() => getField<string>("industry"))
const facilityName = computed(() => getField<string>("facilityName"))
const facilityAddress = computed(() => getField<string>("facilityAddress"))
const facilityTypes = computed(() => getField<string>("facilityTypes"))
const isFacilityForeign = computed(() => getField<boolean>("isFacilityForeign"))
const isDisasterTerritory = computed(() =>
	getField<boolean>("isDisasterTerritory")
)
const isFacilityWasteStorage = computed(() =>
	getField<boolean>("isFacilityWasteStorage")
)
const facilityDescription = computed(() =>
	getField<string>("facilityDescription")
)

const fields = computed((): Field[] => {
	return [
		{
			title: "Отрасль",
			component: "ui-select",
			options: industriesOptions,
			value: industry,
			setKey: "industry",
			id: Fields.Object.INDUSTRY
		},
		{
			title: "Описание объекта",
			component: "ui-select",
			options: facilitiesDescriptionOptions,
			value: facilityDescription,
			setKey: "facilityDescription",
			id: Fields.Object.FACILITY_DESCRIPTION
		},
		{
			title: "Точное описание объекта (согласно документации)",
			component: "ui-input",
			value: facilityName,
			setKey: "facilityName",
			id: Fields.Object.FACILITY_NAME
		},
		{
			title:
				"Фактический адрес расположения объекта (согласно правоустанавливающим документам)",
			component: "ui-input",
			value: facilityAddress,
			setKey: "facilityAddress",
			id: Fields.Object.FACILITY_ADDRESS
		}
	]
})

const checkboxes = computed((): Field[] => {
	return [
		{
			title: "Не является субъектом РФ",
			value: isFacilityForeign,
			setKey: "isFacilityForeign",
			id: Fields.Object.IS_FACILITY_FOREIGN
		},
		{
			title: "Территории подверженные стихийным бедтсвиям",
			value: isDisasterTerritory,
			setKey: "isDisasterTerritory",
			id: Fields.Object.IS_DISASTER_TERRITORY
		},
		{
			title:
				"Объект представляет собой площадки, полигоны и сооружения хранения твердых и жидких отходов",
			value: isFacilityWasteStorage,
			setKey: "isFacilityWasteStorage",
			id: Fields.Object.IS_FACILITY_WASTE_STORAGE
		}
	]
})

onMounted(async () => {
	if (types.ECO) {
		isLoadingFields.value = true

		await Promise.all([
			infoStore.fetchEcoIndustries(),
			infoStore.fetchEcoFacilitiesTypes(),
			infoStore.fetchEcoFacilitiesDescriptions()
		])

		isLoadingFields.value = false
	}
})
</script>
