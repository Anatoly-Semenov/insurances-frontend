<template>
	<calculator-block
		title="ОСАГО"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<template #header>
			<ui-popover
				title="Необходимо заполнить поля"
				v-if="unAvailableList.length"
			>
				<template #content>
					<div class="ui-popover__list _danger">
						<p
							class="ui-popover__list-item"
							v-for="(item, index) in unAvailableList"
							:key="index"
						>
							- {{ item }}
						</p>
					</div>
				</template>

				<ui-button
					size="small"
					:loading="isLoadingCalculate"
					:disabled="unAvailableList.length"
					:id="Calculator.Id.Button.CALCULATE_OSAGO"
					@click="calculateOsago"
				>
					Рассчитать ОСАГО
				</ui-button>
			</ui-popover>
			<ui-button
				size="small"
				:loading="isLoadingCalculate"
				:disabled="unAvailableList.length"
				:id="Calculator.Id.Button.CALCULATE_OSAGO"
				@click="calculateOsago"
				v-else
			>
				Рассчитать ОСАГО
			</ui-button>
		</template>

		<div class="calculator__osago" v-if="isDisplayFields">
			<ui-date-picker
				title="Дата начала страхового периода"
				:value="startedAt"
				:error="errorEmpty(startedAt)"
				:disabledDate="beforeTodayDisabled"
				:disabled="isDisabled"
				:id="Fields.Osago.STARTED_AT"
				:key="Fields.Osago.STARTED_AT"
				@change="setStartedAt"
			/>
			<ui-date-picker
				title="Дата окончания страхового периода"
				:value="finishedAt"
				:error="errorEmpty(finishedAt)"
				:disabled="isDisabled"
				isReadOnly
				:id="Fields.Osago.FINISHED_AT"
				:key="Fields.Osago.FINISHED_AT"
				@change="set('finishedAt', $event)"
			/>
			<template v-if="store.getCompanyType === Info.CompanyType.COMPANY">
				<ui-select
					title="Документ страхователя"
					:options="insurerDocumentOptions"
					:value="+insurerDocument"
					:id="Fields.Osago.INSURER_DOCUMENT"
					:key="Fields.Osago.INSURER_DOCUMENT"
					@change="set('insurerDocument', $event, index)"
				/>
				<ui-input
					title="Номер документа страхователя"
					:value="insurerDocumentNumber"
					:error="errorEmpty(insurerDocumentNumber)"
					:loading="isLoadingFields"
					:id="Fields.Osago.INSURER_DOCUMENT_NUMBER"
					:key="Fields.Osago.INSURER_DOCUMENT_NUMBER"
					@input:value="set('insurerDocumentNumber', $event)"
				/>
				<ui-date-picker
					title="Дата выдачи документа страхователя"
					:value="insurerDocumentDate"
					:error="errorEmpty(insurerDocumentDate)"
					:disabledDate="afterTodayDisabled"
					:disabled="isDisabled"
					:id="Fields.Osago.INSURER_DOCUMENT_DATE"
					:key="Fields.Osago.INSURER_DOCUMENT_DATE"
					@change="set('insurerDocumentDate', $event)"
				/>
			</template>
			<ui-select
				title="Цель использования ТС"
				:options="usageVehicleOptions"
				:value="usage"
				:id="Fields.Osago.USAGE"
				:key="Fields.Osago.USAGE"
				@change="set('usage', $event, index)"
			/>
			<ui-checkbox
				:value="isTrailer"
				@change="set('isTrailer', $event)"
				:id="Fields.Osago.IS_TRAILER"
				:key="Fields.Osago.IS_TRAILER"
				type="checkbox"
			>
				ТС с прицепом
			</ui-checkbox>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError, useFields, useCalculatorStarted } from "~/hooks"

// Types
import { PropType } from "@vue/runtime-core"
import {
	CalculatorFields as Fields,
	Calculator,
	Info
} from "@common-repo/types/src"
import type { UiSelect } from "~/types"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.KASCO
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum

const isLoadingFields = ref<boolean>(false)
const isLoadingCalculate = ref<boolean>(false)

const insurerDocumentOptions: UiSelect.Option[] = [
	{
		label:
			"Выписка из единого государственного реестра юридических лиц (ЕГРЮЛ)",
		value: 4
	}
]

const usageVehicleOptions: UiSelect.Option[] = infoStore.getInfo(
	Info.InfoTypeStatic.USAGE_VEHICLE,
	"static"
)

// Computed
const isDisplayFields = computed((): boolean => {
	return props.type === types.KASCO || props.type === types.OSAGO_SPECTECH
})

const insurerDocument = computed(() => getField<string>("insurerDocument"))
const finishedAt = computed(() => getField<string>("finishedAt"))
const startedAt = computed(() => getField<string>("startedAt"))
const isTrailer = computed(() => getField<boolean>("isTrailer"))
const usage = computed(() => getField<number>("usage"))

const insurerDocumentNumber = computed(() =>
	getField<string>("insurerDocumentNumber")
)
const insurerDocumentDate = computed(() =>
	getField<string>("insurerDocumentDate")
)

const unAvailableList = computed((): string[] => {
	return store.getOsagoUnAvailableList
})

// Methods
const { errorEmpty } = useError()
const { beforeTodayDisabled, afterTodayDisabled } = useFields()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "osago", fieldName)
}

function setStartedAt(value: string = ""): void {
	const { staredAt, finishedAt } = useCalculatorStarted(value)

	set("startedAt", staredAt)
	set("finishedAt", finishedAt)
}

function set(fieldName: string, value: any, isRest: boolean = true): void {
	store.setData(Calculator.Tab.PAYMENT, "osago", fieldName, value)

	if (isRest) store.resetInsurancesIfExist({ isKasco: false })
}

async function calculateOsago(): Promise<void> {
	isLoadingCalculate.value = true
	await store.calculateOsago()
	isLoadingCalculate.value = false
}

onMounted(() => {
	if (!startedAt) setStartedAt()
})
</script>
