<template>
	<calculator-block
		title="Расположение"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__placement">
			<ui-select
				title="Регион"
				:options="regionOptions"
				:value="+region"
				:error="errorEmpty(region)"
				required
				:key="Fields.Placement.REGION"
				:id="Fields.Placement.REGION"
				@change="setRegion"
			/>
			<ui-select
				title="Город"
				:options="cityOptions"
				:value="+city"
				:error="errorEmpty(city)"
				:disabled="isDisabledCity"
				:loading="isLoadingCity"
				required
				:key="Fields.Placement.CITY_ID"
				:id="Fields.Placement.CITY_ID"
				@change="set('city', $event)"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Types
import type { UiSelect } from "~/types"
import {
	Calculator,
	CalculatorFields as Fields,
	Info
} from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"

// Hooks
import { useStore, useError, useDeal } from "~/hooks"

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
const isLoadingCity = ref<boolean>(false)
const { isDetail } = useDeal()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.REGISTRATION, "placement", fieldName)
}

// Computed
const isDisabledCity = computed(() => {
	return !getField("region") || isLoadingCity.value
})
const regionOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.REGIONS)
})
const cityOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.CITIES)
})
const region = computed(() => getField<string>("region"))
const city = computed(() => getField<string>("city"))

// Methods
const { errorEmpty } = useError()

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.REGISTRATION, "placement", fieldName, value)
}

async function setRegion(value: any): Promise<void> {
	set("region", value)
	set("city", "")

	isLoadingCity.value = true
	await infoStore.fetchCities(value)
	isLoadingCity.value = false
}

onMounted(async () => {
	await infoStore.fetchInfo(Info.InfoType.REGIONS)

	if (!isDisabledCity.value || isDetail.value) {
		await infoStore.fetchCities(getField("region"))
	}
})
</script>
