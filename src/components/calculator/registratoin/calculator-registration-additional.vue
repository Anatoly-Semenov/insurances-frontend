<template>
	<calculator-block
		title="Дополнительные данные сделки"
		:loading="store.getIsLoading"
		:disabled="store.getIsSended"
	>
		<div class="calculator__registration-additional">
			<ui-input
				title="Юридический адрес"
				:value="address"
				:error="errorEmpty(address)"
				required
				:key="Fields.RegistrationAdditional.ADDRESS"
				:id="Fields.RegistrationAdditional.ADDRESS"
				@input:value="set('address', $event)"
			/>
			<ui-input
				title="Город оформления договора страхования"
				class="_long"
				:value="city"
				:error="errorEmpty(city)"
				required
				:key="Fields.RegistrationAdditional.CITY"
				:id="Fields.RegistrationAdditional.CITY"
				@input:value="set('city', $event)"
			/>
			<ui-input
				title="Телефон ответственного брокера"
				:value="phone"
				:error="errorEmpty(phone)"
				required
				:key="Fields.RegistrationAdditional.PHONE"
				:id="Fields.RegistrationAdditional.PHONE"
				v-mask="Validation.Mask.PHONE"
				@input:value="set('phone', $event)"
			/>
			<ui-select
				title="Залог/Не залог"
				:value="pledge"
				:error="errorEmpty(pledge)"
				:options="pledgeOptions"
				required
				:key="Fields.RegistrationAdditional.PLEDGE"
				:id="Fields.RegistrationAdditional.PLEDGE"
				@change="setPledge"
			/>
		</div>
	</calculator-block>
</template>

<script lang="ts" setup>
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError } from "~/hooks"

// Types
import { PropType } from "@vue/runtime-core"
import { UiSelect as IUiSelect } from "~/types"
import {
	Calculator,
	Validation,
	CalculatorFields as Fields
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore, isCompany } = useStore(props.type)

// Data
const pledgeOptions: IUiSelect.Options = [
	{
		value: "Залог",
		label: "Залог"
	},
	{
		value: "Не залог",
		label: "Не залог",
		disabled: true
	}
]

// Methods
const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getFieldRegistration("additional", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.REGISTRATION, "additional", fieldName, value)
}

function setPledge(): void {
	set("pledge", true)
}

// Computed
const address = computed(() => getField<string>("address"))
const phone = computed(() => getField<string>("phone"))
const city = computed(() => getField<string>("city"))

const pledge = computed((): string => {
	return getField<boolean>("pledge") ? pledgeOptions[0].label : ""
})
</script>
