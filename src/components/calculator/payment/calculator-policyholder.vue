<template>
	<calculator-block
		title="Данные страхователя"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__policyholder">
			<ui-input
				title="Email страхователя"
				:value="email"
				:error="errorEmail(email)"
				required
				:key="Fields.Bank.EMAIL"
				:id="Fields.Bank.EMAIL"
				@input:value="set('email', $event)"
			/>
			<ui-input
				title="Телефон страхователя"
				:value="phone"
				:error="errorPhone(phone)"
				v-mask="Validation.Mask.PHONE"
				required
				:key="Fields.Bank.PHONE"
				:id="Fields.Bank.PHONE"
				@input:value="set('phone', $event)"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Types
import type { PropType } from "@vue/runtime-core"
import {
	Calculator,
	CalculatorFields as Fields,
	Validation
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Hooks
import { useError, useStore } from "~/hooks"

// Store
const { store } = useStore(props.type)

// Computed
const email = computed((): string => getField("email"))
const phone = computed((): string => getField("phone"))

// Methods
const { errorEmail, errorPhone } = useError()

function getField(fieldName: string): string {
	return store.getFieldRegistration("bank", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.REGISTRATION, "bank", fieldName, value)
}
</script>
