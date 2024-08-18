<template>
	<calculator-block
		title="Данные о сделке"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__intro">
			<ui-input
				title="Ответственный по сделке"
				:value="responsibleEmail"
				:error="errorEmail(responsibleEmail)"
				required
				:id="Calculator.Id.Field.OWNER"
				:key="Calculator.Id.Field.OWNER"
				@input:value="setResponsibleEmail($event)"
			/>
			<ui-date-picker
				title="Дата оформления"
				v-if="!isDetailDeal"
				:value="date"
				:error="errorEmpty(date)"
				required
				isReadOnly
				:id="Calculator.Id.Field.DATE"
				:key="Calculator.Id.Field.DATE"
				@change="setDate($event)"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError } from "~/hooks"
import { useAuthStore } from "~/store"

// Types
import { Calculator as CalculatorLocal } from "~/types"
import { Calculator } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, configStore } = useStore(props.type)
const authStore = useAuthStore()

// Computed
const responsibleEmail = computed((): string => {
	return store.getFieldDeal(CalculatorLocal.DealDataField.RESPONSIBLE_EMAIL)
})
const date = computed((): string => {
	return store.getFieldDeal(CalculatorLocal.DealDataField.DATE)
})
const isDetailDeal = computed((): boolean => {
	return !!store.getFieldDeal(CalculatorLocal.DealDataField.ID)
})

const user = ref<string>("manager@test-url.ru")

// Methods
const { errorEmpty, errorEmail } = useError()
function setResponsibleEmail(value: string) {
	store.setDealData(CalculatorLocal.DealDataField.RESPONSIBLE_EMAIL, value)
}
function setDate(value: string) {
	store.setDealData(CalculatorLocal.DealDataField.DATE, value)
}

onMounted(() => {
	const { $dayjs } = useNuxtApp()

	if (!responsibleEmail.value) setResponsibleEmail(authStore.getEmail)
	if (!date.value) setDate($dayjs().format(configStore.getFormatDates))
})
</script>
