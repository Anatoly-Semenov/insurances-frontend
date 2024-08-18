<template>
	<calculator-block title="Локации" :disabled="store.getIsDisabledFields">
		<div class="calculator__locations">
			<ui-input
				title="Колличество локаций"
				:value="countLocation"
				:error="errorEmpty(countLocation)"
				@input:value="countLocation = $event"
			/>
			<ui-input
				title="Страховая сумма по одной локации"
				:value="insurerSum"
				:error="errorEmpty(insurerSum)"
				@input:value="insurerSum = $event"
			/>
			<ui-input
				title="Номер договора инкасации / Торгового эквайринга / РКО"
				:value="contractNumber"
				:error="errorEmpty(contractNumber)"
				@input:value="contractNumber = $event"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"

// Hooks
import { useError } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Data
const countLocation = ref<string>("")
const insurerSum = ref<string>("")
const contractNumber = ref<string>("")

// Methods
const { errorEmpty } = useError()
</script>
