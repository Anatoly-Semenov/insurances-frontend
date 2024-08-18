<template>
	<calculator-block
		title="Результаты расчета"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__risk">
			<p class="calculator__risk-subtitle">Мультириск</p>
			<div class="calculator__risk-results">
				<ui-input-number
					v-for="(
						{ title, value, setKey }, index
					) in multiRiskCalculationResultsFields"
					:key="index + setKey"
					:id="setKey"
					:title="title"
					:value="value"
					isAddonAfter
					:formatter="numberRubFormatter"
					:parser="numberRubParser"
					isReadOnly
					:error="errorEmpty(value)"
					@input:value="set(setKey, $event)"
				>
					<template #addonAfter>Руб.</template>
				</ui-input-number>
			</div>

			<template v-if="isEmergencyRisk">
				<p class="calculator__risk-subtitle">Риск ЧС</p>
				<div class="calculator__risk-results">
					<ui-input-number
						v-for="(
							{ title, value, setKey }, index
						) in emergencyRiskCalculationResultsFields"
						:key="index + setKey"
						:id="setKey"
						:title="title"
						:value="value"
						isAddonAfter
						:formatter="numberRubFormatter"
						:parser="numberRubParser"
						isReadOnly
						:error="errorEmpty(value)"
						@input:value="set(setKey, $event)"
					>
						<template #addonAfter>Руб.</template>
					</ui-input-number>
				</div>
			</template>

			<div class="calculator__risk-buttons">
				<ui-button
					:disabled="!store.getIsValidCalculation"
					:id="Calculator.Id.Button.CALCULATE"
					:loading="isCalculateLoading"
					@click="calculate"
				>
					Рассчитать
				</ui-button>
			</div>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError, useFields } from "~/hooks"

// Types
import { PropType } from "@vue/runtime-core"
import { CalculatorFields as Fields, Calculator } from "@common-repo/types/src"

interface Field {
	title: string
	value: number
	setKey: string
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.AGRO
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum
const isCalculateLoading = ref<boolean>(false)

// Methods
const { errorEmpty } = useError()
const { numberRubFormatter, numberRubParser } = useFields()

function getField<T = string>(fieldName: string): T {
	return store.getField(Calculator.Tab.PAYMENT, "calculationResults", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "calculationResults", fieldName, value)
}

async function calculate(): Promise<void> {
	isCalculateLoading.value = true

	await store.calculateDeal()

	isCalculateLoading.value = false
}

// Computed

const totalInsuranceCost = computed(() =>
	getField<number>("totalInsuranceCost")
)

const totalInsurancePremium = computed(() =>
	getField<number>("totalInsurancePremium")
)

const totalInsurancePremium50Percent = computed(() =>
	getField<number>("totalInsurancePremium50Percent")
)

const totalInsuranceSumEmergencyRisk = computed(() =>
	getField<number>("totalInsuranceSumEmergencyRisk")
)

const totalInsuranceCostEmergencyRisk = computed(() =>
	getField<number>("totalInsuranceCostEmergencyRisk")
)

const totalInsurancePremiumEmergencyRisk = computed(() =>
	getField<number>("totalInsurancePremiumEmergencyRisk")
)

const totalInsurancePremiumToPayEmergencyRisk = computed(() =>
	getField<number>("totalInsurancePremiumToPayEmergencyRisk")
)

const isEmergencyRisk = computed((): boolean => store.getIsEmergencyRisk)

const totalInsuranceSum = computed(() => getField<number>("totalInsuranceSum"))

const multiRiskCalculationResultsFields = computed((): Field[] => {
	return [
		{
			title: "Общая страховая стоимость",
			value: totalInsuranceCost.value,
			setKey: "totalInsuranceCost"
		},
		{
			title: "Общая страховая сумма",
			value: totalInsuranceSum.value,
			setKey: "totalInsuranceSum"
		},
		{
			title: "Общая страховая премия",
			value: totalInsurancePremium.value,
			setKey: "totalInsurancePremium"
		},
		{
			title: "Общая страховая премия (к уплате 50%)",
			value: totalInsurancePremium50Percent.value,
			setKey: "totalInsurancePremium50Percent"
		}
	]
})

const emergencyRiskCalculationResultsFields = computed((): Field[] => {
	return [
		{
			title: "Итоговая страховая стоимость",
			value: totalInsuranceCostEmergencyRisk.value,
			setKey: "totalInsuranceCostEmergencyRisk"
		},
		{
			title: "Итоговая страховая сумма",
			value: totalInsuranceSumEmergencyRisk.value,
			setKey: "totalInsuranceSumEmergencyRisk"
		},
		{
			title: "Итоговая страховая премия",
			value: totalInsurancePremiumEmergencyRisk.value,
			setKey: "totalInsurancePremiumEmergencyRisk"
		},
		{
			title: "Итоговая страховая премия (к уплате)",
			value: totalInsurancePremiumToPayEmergencyRisk.value,
			setKey: "totalInsurancePremiumToPayEmergencyRisk"
		}
	]
})
</script>
