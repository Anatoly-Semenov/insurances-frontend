<template>
	<calculator-block
		title="Сводные данные по автомобилям"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__motor">
			<ui-select
				title="Документ Страхователя"
				:options="documentTypeOptions"
				:value="documentType"
				:id="Fields.Policyholder.DOCUMENT_TYPE"
				required
				@change="set('documentType', $event)"
			/>
			<ui-input
				title="Номер документа Страхователя"
				:value="documentNumber"
				:error="errorEmpty(documentNumber)"
				:id="Fields.Policyholder.DOCUMENT_NUMBER"
				required
				@input:value="set('documentNumber', $event)"
			/>
			<ui-date-picker
				title="Дата выдачи документа Страхователя"
				:value="documentDate"
				:id="Fields.Policyholder.DOCUMENT_DATE"
				@change="set('documentDate', $event)"
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
import type { PropType } from "@vue/runtime-core"
import type { UiSelect } from "~/types"
import { CalculatorFields as Fields, Calculator } from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store } = useStore(props.type)

// Data
const documentTypeOptions: UiSelect.Option[] = [
	{
		label:
			"Выписка из единого государственного реестра юридических лиц (ЕГРЮЛ)",
		value: "Выписка из единого государственного реестра юридических лиц (ЕГРЮЛ)"
	}
]

// Methods
const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getFieldPayment<T>("main", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "main", fieldName, value)
}

// Computed
const documentType = computed(() => getField("documentType"))
const documentNumber = computed(() => getField("documentNumber"))
const documentDate = computed(() => getField("documentDate"))
</script>
