<template>
	<calculator-block
		title="Адрес регистрации компании"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__company-address">
			<calculator-address :type="type" block="companyAddress" />
			<ui-checkbox
				@change="set('isManualAddress', $event)"
				:value="isManualAddress"
				:key="Fields.Passport.IS_FILL_BY_FIELDS"
				:id="Fields.Passport.IS_FILL_BY_FIELDS"
				type="switch"
			>
				Заполнить по полям
			</ui-checkbox>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { calculatorAddress } from "./"

// Hooks
import { useStore } from "~/hooks"

// Types
import { Calculator, CalculatorFields as Fields } from "@common-repo/types/src"
import { PropType } from "@vue/runtime-core"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store } = useStore(props.type)

// Methods
function getField<T = string>(fieldName: string): T {
	return store.getFieldInsurer("companyAddress", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.INSURER, "companyAddress", fieldName, value)
}

// Computed
const isManualAddress = computed(() => getField<boolean>("isManualAddress"))
</script>
