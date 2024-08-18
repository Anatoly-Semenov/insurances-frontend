<template>
	<calculator-block
		title="Данные родительской сделки"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__parent">
			<ui-input
				v-for="{ title, field } in fields"
				:key="field"
				:title="title"
				:value="getField(field)"
				:error="errorId(getField(field))"
				:id="field"
				showError
				@input:value="set(field, $event)"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Types
import { Calculator, CalculatorFields as Fields } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"

interface Field {
	field: Fields.Parent
	title: string
}

// Hooks
import { useStore, useError } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.KASCO
	}
})

// Store
const { store } = useStore(props.type)

// Computed
const fields = computed((): Field[] => {
	const isKasco: boolean = props.type === Calculator.TypeEnum.KASCO

	const list: Field[] = [
		{
			title: `ID родительской сделки${isKasco ? " КАСКО" : ""}`,
			field: Fields.Parent.CRM_PARENT_ID
		},
		{
			title: `ID лида${isKasco ? " КАСКО" : ""}`,
			field: Fields.Parent.CRM_LEAD_ID
		},
		{
			title: "ID родительской сделки ОСАГО",
			field: Fields.Parent.OSAGO_CRM_PARENT_ID
		},
		{
			title: "ID лида ОСАГО",
			field: Fields.Parent.OSAGO_CRM_LEAD_ID
		}
	]

	if (props.type === Calculator.TypeEnum.OSAGO_SPECTECH) {
		list.splice(0, 2)
	} else if (!isKasco) {
		list.splice(2, 2)
	}

	return list
})

// Methods
const { errorId } = useError()

function getField(fieldName: string): string {
	return store.getFieldRegistration("parent", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.REGISTRATION, "parent", fieldName, value)
}
</script>
