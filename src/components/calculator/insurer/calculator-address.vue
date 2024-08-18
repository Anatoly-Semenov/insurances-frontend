<template>
	<div class="calculator__passport-address" v-if="isManualAddress">
		<ui-input
			title="Населенный пункт"
			:value="cityPlace"
			:error="errorEmpty(cityPlace)"
			:key="Fields.Address.LOCALITY"
			:id="Fields.Address.LOCALITY"
			:required="isRequiredCityPlace"
			@input:value="set('cityPlace', $event)"
		/>
		<ui-input
			title="Улица"
			:value="street"
			:error="errorEmpty(street)"
			:key="Fields.Address.STREET"
			:id="Fields.Address.STREET"
			:required="isRequiredStreet"
			@input:value="set('street', $event)"
		/>
		<ui-input
			title="Дом"
			:value="house"
			:error="errorEmpty(house)"
			:key="Fields.Address.HOUSE"
			:id="Fields.Address.HOUSE"
			:required="isRequiredHouse"
			@input:value="set('house', $event)"
		/>
		<ui-input
			title="Строение"
			:value="build"
			:error="errorEmpty(build)"
			:key="Fields.Address.BUILDING"
			:id="Fields.Address.BUILDING"
			:required="isRequiredBuild"
			@input:value="set('build', $event)"
		/>
		<ui-input
			title="Офис / Квартира"
			:value="office"
			:error="errorEmpty(office)"
			:key="Fields.Address.FLAT"
			:id="Fields.Address.FLAT"
			:required="isRequiredOffice"
			@input:value="set('office', $event)"
		/>
	</div>
	<ui-input
		v-else
		:title="addressTitle"
		:value="address"
		:error="errorEmpty(address)"
		:key="Fields.Address.ADDRESS_VALUE"
		:id="Fields.Address.ADDRESS_VALUE"
		:required="isRequiredFullAddress"
		@input:value="set('address', $event)"
	/>
</template>

<script setup lang="ts">
// Types
import type { PropType } from "@vue/runtime-core"
import {
	Calculator,
	CalculatorFields as Fields,
	Info
} from "@common-repo/types/src"

// Hooks
import { useStore, useError, useCalculatorRequired } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	},
	tab: {
		type: String as PropType<Calculator.Tab>,
		default: Calculator.Tab.INSURER
	},
	block: {
		type: String,
		default: "passport"
	}
})

// Store
const { store } = useStore(props.type)

// Data
const {
	isRequiredFullAddress,
	isRequiredCityPlace,
	isRequiredStreet,
	isRequiredOffice,
	isRequiredHouse,
	isRequiredBuild
} = useCalculatorRequired(props.type)

// Methods
const { errorEmpty } = useError()
function getField<T = string>(fieldName: string): T {
	return store.getField<T>(props.tab, props.block, fieldName)
}
function set(fieldName: string, value: any): void {
	store.setData(props.tab, props.block, fieldName, value)
}

// Computed
const cityPlace = computed(() => getField<string>("cityPlace"))
const street = computed(() => getField<string>("street"))
const house = computed(() => getField<string>("house"))
const build = computed(() => getField<string>("build"))
const office = computed(() => getField<string>("office"))
const address = computed(() => getField<string>("address"))
const isManualAddress = computed(() => getField<boolean>("isManualAddress"))

const addressTitle = computed((): string => {
	if (props.type === Calculator.TypeEnum.CYBER) {
		return store.getCompanyType === Info.CompanyType.COMPANY
			? "Адрес регистрации юр. лица"
			: "Адрес регистрации ИП"
	}

	return "Адрес регистрации"
})
</script>
