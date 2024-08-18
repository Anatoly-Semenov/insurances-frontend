<template>
	<calculator-block
		title="Дополнительные соглашения"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div
			class="calculator__responsibility"
			:class="{ _border: isGo || isPpgo }"
		>
			<div class="calculator__responsibility-go">
				<p class="calculator__responsibility-subtitle">
					Гражданская ответственность
				</p>
				<ui-checkbox
					:value="isGo"
					@change="
						store.setResponsibilityData(SmrService.CalculationType.GO, $event)
					"
					:key="Fields.Responsibility.IS_GO"
					:id="Fields.Responsibility.IS_GO"
				>
					ГО
				</ui-checkbox>
				<ui-select
					v-if="isGo"
					title="Страховая сумма по ГО"
					:options="insuranceSumGoOptions"
					:value="insuranceSumGo"
					:error="errorEmpty(insuranceSumGo)"
					:key="Fields.Responsibility.INSURANCE_SUM_GO"
					:id="Fields.Responsibility.INSURANCE_SUM_GO"
					required
					@change="set('insuranceSumGo', $event)"
				/>
				<ui-button
					v-if="isGo"
					:disabled="isDisabledCalculateGo"
					:loading="isLoadingGo"
					:id="Calculator.Id.Button.CALCULATE_GO"
					@click="calculateGo"
				>
					Рассчитать
				</ui-button>
				<p class="calculator__responsibility-subtitle">Риски</p>
				<ui-checkbox
					:value="isTerrorRisk"
					@change="
						store.setResponsibilityData(
							SmrService.CalculationType.TERRORRISK,
							$event
						)
					"
					:key="Fields.Responsibility.IS_TERROR_RISK"
					:id="Fields.Responsibility.IS_TERROR_RISK"
				>
					Терроризм и диверсия
				</ui-checkbox>
				<ui-alert
					v-if="isTerrorRisk"
					:message="message"
					:type="Alert.Type.INFO"
					showIcon
				/>
				<ui-button
					v-if="isTerrorRisk"
					:loading="isLoadingEmergency"
					:id="Calculator.Id.Button.CALCULATE_TERROR_RISK"
					@click="calculateEmergencyRisk"
				>
					Рассчитать
				</ui-button>
			</div>
			<div class="calculator__responsibility-ppgo">
				<p class="calculator__responsibility-subtitle">
					Страхование послепусковых гарантийных обязательств
				</p>
				<ui-checkbox
					:value="isPpgo"
					:disabled="isPpgoDisabled"
					@change="
						store.setResponsibilityData(SmrService.CalculationType.PGO, $event)
					"
					:key="Fields.Responsibility.IS_PPGO"
					:id="Fields.Responsibility.IS_PPGO"
				>
					ППГО
				</ui-checkbox>
				<ui-alert
					v-if="isPpgoDisabled"
					:message="messagePpgoDisables"
					:type="Alert.Type.INFO"
					showIcon
				/>
				<ui-input-number
					v-if="isPpgo"
					title="Страховая сумма по ППГО"
					:value="insuranceSumPpgo"
					isAddonAfter
					:formatter="numberRubFormatter"
					:parser="numberRubParser"
					:error="errorEmpty(insuranceSumPpgo)"
					:key="Fields.Responsibility.INSURANCE_SUM_PPGO"
					:id="Fields.Responsibility.INSURANCE_SUM_PPGO"
					isReadOnly
					required
					@input:value="set('insuranceSumPpgo', $event)"
				>
					<template #addonAfter>Руб.</template>
				</ui-input-number>
				<ui-date-picker
					v-if="isPpgo"
					title="Дата начала страхования по ППГО"
					:value="ppgoStartedAt"
					:error="errorEmpty(ppgoStartedAt)"
					:key="Fields.Responsibility.PPGO_STARTED_AT"
					:id="Fields.Responsibility.PPGO_STARTED_AT"
					isReadOnly
					required
					@change="set('ppgoStartedAt', $event)"
				/>
				<ui-date-picker
					v-if="isPpgo"
					title="Дата окончания страхования по ППГО"
					:value="ppgoFinishedAt"
					:error="errorEmpty(ppgoFinishedAt)"
					:key="Fields.Responsibility.PPGO_FINISHED_AT"
					:id="Fields.Responsibility.PPGO_FINISHED_AT"
					:disabledDate="disabledBeforeDate(ppgoStartedAt)"
					isReadOnly
					required
					@change="set('ppgoFinishedAt', $event)"
				/>
				<ui-button
					v-if="isPpgo"
					:disabled="isDisabledCalculatePpgo"
					:loading="isLoadingPpgo"
					:id="Calculator.Id.Button.CALCULATE_PPGO"
					@click="calculatePpgo"
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
import type { UiCheckbox, UiSelect } from "~/types"
import { PropType } from "@vue/runtime-core"
import {
	CalculatorFields as Fields,
	SmrService,
	Calculator,
	Info
} from "@common-repo/types/src"
import { UiAlert as Alert } from "~/types"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.SMR
	}
})

// Store
const { store, infoStore, configStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum

const isLoadingGo = ref<boolean>(false)
const isLoadingPpgo = ref<boolean>(false)
const isLoadingEmergency = ref<boolean>(false)

const message: string =
	"Страховая сумма по риску Терроризм и диверсия равна общей страховой сумме, но не может быть больше 10 млн. руб."

const messagePpgoDisables: string =
	"Для страхования ППГО срок страхования должен быть не более 24 месяцев."

// Computed
const isGo = computed(() => getField<boolean>("isGo"))
const insuranceSumGo = computed(() => getField<string>("insuranceSumGo"))

const isPpgo = computed(() => getField<boolean>("isPpgo"))
const insuranceSumPpgo = computed(() => getField<string>("insuranceSumPpgo"))
const ppgoStartedAt = computed(() => getField<string>("ppgoStartedAt"))
const ppgoFinishedAt = computed(() => getField<string>("ppgoFinishedAt"))

const finishedAt = computed(() =>
	store.getField(Calculator.Tab.PAYMENT, "main", "finishedAt")
)

const isTerrorRisk = computed(() => getField<boolean>("isTerrorRisk"))

const isDisabledCalculateGo = computed(
	(): boolean => !store.getIsValidCalculation(SmrService.CalculationType.GO)
)

const isDisabledCalculatePpgo = computed(
	(): boolean => !store.getIsValidCalculation(SmrService.CalculationType.PGO)
)

const insuranceSumGoOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.GO_INSURANCE_SUM)
})

const isPpgoDisabled = computed((): boolean => store.getIsPpgoDisabled)

// Methods
const { errorEmpty } = useError()
const { numberRubFormatter, numberRubParser, disabledBeforeDate } = useFields()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "responsibility", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "responsibility", fieldName, value)
}

async function calculateGo(): Promise<void> {
	isLoadingGo.value = true
	await store.calculateGo()
	isLoadingGo.value = false
}

async function calculateEmergencyRisk(): Promise<void> {
	isLoadingEmergency.value = true
	await store.calculateEmergencyRisk()
	isLoadingEmergency.value = false
}

async function calculatePpgo(): Promise<void> {
	isLoadingPpgo.value = true
	await store.calculatePpgo()
	isLoadingPpgo.value = false
}

function setDates(): void {
	if (!ppgoStartedAt.value) {
		store.setPpgoDates(finishedAt.value)
	}
}

onMounted(() => {
	setDates()
})
</script>
