<template>
	<calculator-block
		title="Данные расчета"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__payment" :class="{ _full: isFull }">
			<template v-if="type === types.SMR">
				<ui-date-picker
					title="Дата начала работ"
					:value="worksStartedAt"
					:error="errorEmpty(worksStartedAt)"
					required
					:disabled="isDisabledPeriod"
					:key="Fields.Payment.WORK_START_DATE"
					:id="Fields.Payment.WORK_START_DATE"
					@change="set('worksStartedAt', $event)"
				/>
				<ui-date-picker
					title="Дата окончания работ"
					:value="worksFinishedAt"
					:error="errorEmpty(worksFinishedAt)"
					:key="Fields.Payment.WORK_END_DATE"
					:id="Fields.Payment.WORK_END_DATE"
					:disabled="isDisabledPeriod || isDisabledFinishedAt"
					:disabledDate="disabledBeforeDate(worksStartedAt)"
					required
					@change="set('worksFinishedAt', $event)"
				/>
			</template>

			<ui-popover
				:trigger="IUiPopover.Trigger.HOVER"
				:placement="IUiPopover.Placement.RIGHT"
			>
				<ui-date-picker
					title="Дата начала страхового периода"
					:value="startedAt"
					:error="errorEmpty(startedAt)"
					:disabledDate="beforeTodayDisabled"
					required
					:disabled="isDisabledPeriod"
					:key="Fields.Payment.START_DATE"
					:id="Fields.Payment.START_DATE"
					@change="setStartedAt"
				/>

				<template #content v-if="isSmrStartedAtPopover">
					<div class="calculator__payment-popover">
						Вставить дату начала работ
						<ui-button @click="set('startedAt', worksStartedAt)">
							Вставить
						</ui-button>
					</div>
				</template>
			</ui-popover>

			<ui-popover
				:trigger="IUiPopover.Trigger.HOVER"
				:placement="IUiPopover.Placement.RIGHT"
			>
				<ui-date-picker
					title="Дата окончания страхового периода"
					:value="finishedAt"
					:error="errorEmpty(finishedAt)"
					:key="Fields.Payment.END_DATE"
					:id="Fields.Payment.END_DATE"
					:isReadOnly="isDisabledPeriod || isDisabledFinishedAt"
					:disabledDate="disabledBeforeDate(startedAt)"
					required
					@change="setFinishedAt"
				/>
				<template #content v-if="isSmrFinishedAtPopover">
					<div class="calculator__payment-popover">
						Вставить дату окончания работ
						<ui-button @click="set('finishedAt', worksFinishedAt)">
							Вставить
						</ui-button>
					</div>
				</template>
			</ui-popover>
			<div class="calculator__payment-months" v-if="type === types.SPECTECH">
				<ui-slider
					title="Количество месяцев"
					:value="insurancePeriod"
					:id="Fields.Territory.INSURANCE_PERIOD"
					:min="1"
					:max="12"
					required
					@change="setInsurancePeriod"
				/>
				<ui-input-number
					type="number"
					:value="insurancePeriod"
					:id="Fields.Territory.INSURANCE_PERIOD"
					:min="1"
					:max="12"
					required
					@input:value="setInsurancePeriod"
				></ui-input-number>
			</div>
			<ui-input-number
				v-if="isCoefficientVisible"
				title="Повышающий коэффициент"
				type="number"
				:value="coefficient"
				:error="errorCoefficientValue"
				:key="Fields.Payment.MULTIPLIER"
				:id="Fields.Payment.MULTIPLIER"
				v-mask="coefficientMask"
				:min="coefficientRange.min"
				:max="coefficientRange.max"
				:step="coefficientStep"
				required
				@input:value="set('coefficient', $event)"
			/>

			<div class="calculator__payment-cv" v-if="isCvVisible">
				<ui-slider
					title="КВ"
					:value="cv"
					:min="minCv"
					:max="maxCv"
					:key="Fields.Payment.CV"
					:id="Fields.Payment.CV"
					@change="set('cv', $event)"
				/>
				<ui-input-number
					type="number"
					:value="cv"
					:min="minCv"
					:max="maxCv"
					isAddonAfter
					:key="Fields.Payment.CV"
					:id="Fields.Payment.CV"
					@input:value="set('cv', $event)"
				>
					<template #addonAfter>%</template>
				</ui-input-number>
			</div>

			<ui-input-number
				title="Франшиза"
				:value="franchise"
				:parser="numberRubParser"
				:formatter="numberRubFormatter"
				:key="Fields.Payment.FRANCHISE"
				:id="Fields.Payment.FRANCHISE"
				v-if="isFranchise"
				@input:value="set('franchise', $event)"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useCalculatorPayment, useFields } from "~/hooks"

// Types
import { PropType } from "@vue/runtime-core"
import { UiPopover as IUiPopover } from "~/types"
import { CalculatorFields as Fields, Calculator } from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Computed
const coefficientStep = computed((): number | string => {
	if (props.type === Calculator.TypeEnum.SPECTECH) {
		return "0.1"
	}

	return "1"
})

const coefficientRange = computed((): { min: number; max: number } => {
	let min = 0
	let max = 100

	if (props.type === Calculator.TypeEnum.SPECTECH) {
		min = 1
		max = 1.5
	}

	return { min, max }
})

const { numberRubFormatter, numberRubParser } = useFields()

const {
	isSmrFinishedAtPopover,
	isSmrStartedAtPopover,
	errorCoefficientValue,
	isCoefficientVisible,
	isDisabledFinishedAt,
	beforeTodayDisabled,
	disabledBeforeDate,
	preparePaymentData,
	setInsurancePeriod,
	isDisabledPeriod,
	errorCoefficient,
	insurancePeriod,
	coefficientMask,
	worksFinishedAt,
	worksStartedAt,
	setFinishedAt,
	setStartedAt,
	coefficient,
	isCvVisible,
	isFranchise,
	configStore,
	finishedAt,
	errorEmpty,
	calculate,
	startedAt,
	franchise,
	isFull,
	store,
	types,
	minCv,
	maxCv,
	set,
	cv
} = useCalculatorPayment(props.type)

onMounted(() => {
	preparePaymentData()
})
</script>
