<template>
	<calculator-block
		title="КАСКО"
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
					:id="Calculator.Id.Button.CALCULATE_KASCO"
					@click="calculateKasco"
				>
					Рассчитать КАСКО
				</ui-button>
			</ui-popover>
			<ui-button
				size="small"
				:loading="isLoadingCalculate"
				:disabled="unAvailableList.length"
				:id="Calculator.Id.Button.CALCULATE_KASCO"
				@click="calculateKasco"
				v-else
			>
				Рассчитать КАСКО
			</ui-button>
		</template>

		<div class="calculator__kasco" v-if="type === types.KASCO">
			<ui-date-picker
				title="Дата начала страхового периода"
				:value="startedAt"
				:error="errorEmpty(startedAt)"
				:disabledDate="beforeTodayDisabled"
				:disabled="isDisabled"
				:id="Fields.Kasco.STARTED_AT"
				:key="Fields.Kasco.STARTED_AT"
				@change="setStartedAt"
			/>
			<ui-date-picker
				title="Дата окончания страхового периода"
				:value="finishedAt"
				:error="errorEmpty(finishedAt)"
				:disabled="isDisabled"
				isReadOnly
				:id="Fields.Kasco.FINISHED_AT"
				:key="Fields.Kasco.FINISHED_AT"
				@change="set('finishedAt', $event)"
			/>
			<ui-select
				title="Регион регистрации ТС"
				:options="registrationRegionOptions"
				:value="registrationRegion"
				:loading="isLoadingInfo"
				id="registrationRegion"
				:id="Fields.Kasco.REGISTRATION_REGION"
				:key="Fields.Kasco.REGISTRATION_REGION"
				@change="set('registrationRegion', $event)"
			/>
			<ui-input-number
				title="Пробег"
				:value="mileage"
				:error="errorEmpty(mileage)"
				isAddonAfter
				:formatter="numberFormatter"
				:parser="numberParser"
				:loading="isLoadingFields"
				:id="Fields.Vehicle.MILEAGE"
				:key="Fields.Vehicle.MILEAGE"
				@input:value="set('mileage', $event)"
			>
				<template #addonAfter>Км.</template>
			</ui-input-number>
			<ui-input-number
				title="Полная стоимость ТС"
				:value="totalCost"
				isAddonAfter
				:formatter="numberRubFormatter"
				:parser="numberRubParser"
				:error="errorEmpty(totalCost)"
				:loading="isLoadingFields"
				:id="Fields.Kasco.TOTAL_COST"
				:key="Fields.Kasco.TOTAL_COST"
				@input:value="setTotalCost"
			>
				<template #addonAfter>Руб.</template>
			</ui-input-number>

			<ui-input-number
				title="Страховая сумма ТС"
				:value="insuranceCost"
				:formatter="numberRubFormatter"
				:parser="numberRubParser"
				isAddonAfter
				:error="errorEmpty(insuranceCost)"
				:loading="isLoadingFields"
				:id="Fields.Kasco.INSURANCE_COST"
				:key="Fields.Kasco.INSURANCE_COST"
				@input:value="set('insuranceCost', $event)"
			>
				<template #addonAfter>Руб.</template>
			</ui-input-number>

			<ui-select
				title="Безусловная франшиза"
				:options="franchiseOptions"
				:value="franchise"
				:loading="isLoadingFranchise"
				:disabled="!franchiseOptions.length"
				:id="Fields.Kasco.FRANCHISE"
				:key="Fields.Kasco.FRANCHISE"
				@change="set('franchise', $event)"
			/>

			<ui-select
				title="ДСАГО Югория"
				:options="dagoOptions"
				:loading="isLoadingInfo"
				:value="dago"
				@change="set('dago', $event)"
			/>

			<ui-select
				title="АвтоНС Югория"
				:options="nsOptions"
				:loading="isLoadingInfo"
				:value="ns"
				@change="set('ns', $event)"
			/>

			<transition name="slide-fade-top">
				<ui-alert
					class="calculator__kasco-alert"
					v-if="totalCostInfo"
					:message="totalCostInfo"
					:type="Alert.Type.INFO"
					showIcon
				/>
			</transition>

			<div class="calculator__kasco-list">
				<ui-checkbox
					:value="isNew"
					@change="set('isNew', $event)"
					:id="Fields.Kasco.IS_NEW"
					:key="Fields.Kasco.IS_NEW"
					type="checkbox"
				>
					Новое ТС
				</ui-checkbox>
				<ui-checkbox
					:value="isOps"
					@change="set('isOps', $event), set('opsId', '')"
					:id="Fields.Kasco.IS_OPS"
					:key="Fields.Kasco.IS_OPS"
					type="checkbox"
				>
					Наличие ОПС
				</ui-checkbox>
				<transition name="slide-fade-top">
					<ui-select
						class="calculator__kasco-ops"
						v-if="isOps"
						title="Марка/Модель ОПС"
						:options="opsOptions"
						:value="opsId"
						:id="Fields.Kasco.OPS"
						:key="Fields.Kasco.OPS"
						@change="set('opsId', $event)"
					/>
				</transition>
				<ui-checkbox
					:value="isInstallment"
					@change="set('isInstallment', $event)"
					:id="Fields.Kasco.IS_INSTALLMENT"
					:key="Fields.Kasco.IS_INSTALLMENT"
					type="checkbox"
				>
					Рассрочка на 2 платежа
				</ui-checkbox>
				<ui-checkbox
					:value="isTaxiMode"
					@change="set('isTaxiMode', $event)"
					:id="Fields.Kasco.IS_TAXI_MODE"
					:key="Fields.Kasco.IS_TAXI_MODE"
					type="checkbox"
				>
					Эксплуатируется в режиме Такси, проката, городского или пригородного
					пассажирского транспорта
				</ui-checkbox>
			</div>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Libs
import _debounce from "lodash/debounce"

// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError, useFields, useCalculatorStarted } from "~/hooks"

// Types
import { CalculatorFields as Fields, Calculator } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"
import { UiAlert as Alert, Info } from "~/types"
import type { UiSelect } from "~/types"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore, configStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum

const isLoadingInfo = ref<boolean>(false)
const isLoadingFields = ref<boolean>(false)
const isLoadingCalculate = ref<boolean>(false)
const isLoadingFranchise = ref<boolean>(false)

const emptyOption: UiSelect.Option[] = [
	{
		label: "Не выбрано",
		value: 0
	}
]

// Computed
const registrationRegionOptions = computed((): UiSelect.Option[] => {
	const regions = infoStore.getInfo(Info.InfoType.REGIONS)

	if (regions) return regions

	return emptyOption
})

const franchiseOptions = computed((): UiSelect.Option[] => {
	return infoStore
		.getInfo(Info.InfoType.DYNAMIC_FRANCHISE)
		.map(({ label, value }) => {
			return { label: value ? `${label} руб.` : label, value }
		})
})

const opsOptions = computed((): UiSelect.Option[] => {
	return infoStore.getInfo(Info.InfoTypeKasco.OPS_LIST)
})

const nsOptions = computed((): UiSelect.Option[] => {
	return infoStore.getInfo(Info.InfoTypeKasco.NS)
})

const dagoOptions = computed((): UiSelect.Option[] => {
	return infoStore.getInfo(Info.InfoTypeKasco.DAGO)
})

const totalCostInfo = computed((): string => {
	const { $mask } = useNuxtApp()

	let min: string = store.getActualCost("min") + ""
	let max: string = store.getActualCost("max") + ""

	if (+min && +max) {
		const masks: string[] = [
			"# ###",
			"## ###",
			"### ###",
			"# ### ###",
			"## ### ###",
			"### ### ###"
		]

		min = $mask(min, masks)
		max = $mask(max, masks)

		return `Стоимость ТС должна быть в диапазоне: ${min} - ${max} руб.`
	}

	return ""
})

const insuranceCost = computed(() => getField<string>("insuranceCost"))
const isInstallment = computed(() => getField<boolean>("isInstallment"))
const isTaxiMode = computed(() => getField<boolean>("isTaxiMode"))
const finishedAt = computed(() => getField<string>("finishedAt"))
const startedAt = computed(() => getField<string>("startedAt"))
const totalCost = computed(() => getField<number>("totalCost"))
const franchise = computed(() => getField<string>("franchise"))
const mileage = computed(() => getField<string>("mileage"))
const isNew = computed(() => getField<boolean>("isNew"))
const isOps = computed(() => getField<boolean>("isOps"))
const opsId = computed(() => getField<number>("opsId"))
const dago = computed(() => getField<number>("dago"))
const ns = computed(() => getField<number>("ns"))
const registrationRegion = computed(() =>
	getField<string>("registrationRegion")
)

const unAvailableList = computed((): string[] => {
	return store.getKascoUnAvailableList
})

const fetchKascoFranchise = computed((): (() => void) => {
	return _debounce(
		async () => {
			isLoadingFranchise.value = true
			await infoStore.fetchKascoFranchise(+totalCost.value).catch(() => {})
			isLoadingFranchise.value = false
		},
		250,
		{
			maxWait: 1000
		}
	)
})

// Methods
const {
	beforeTodayDisabled,
	numberRubFormatter,
	numberRubParser,
	numberFormatter,
	numberParser
} = useFields()

const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "kasco", fieldName)
}

function set(fieldName: string, value: any, isRest: boolean = true): void {
	store.setData(Calculator.Tab.PAYMENT, "kasco", fieldName, value)

	if (isRest) store.resetInsurancesIfExist({ isOsago: false })
}

function setStartedAt(value: string = ""): void {
	const { staredAt, finishedAt } = useCalculatorStarted(value)

	set("startedAt", staredAt)
	set("finishedAt", finishedAt)
}

async function calculateKasco(): Promise<void> {
	isLoadingCalculate.value = true
	await store.calculateKasco()
	isLoadingCalculate.value = false
}

function setTotalCost(value: string | number): void {
	set("totalCost", value)
	set("franchise", 1)
}

function fetchInfoLists(): void {
	isLoadingInfo.value = true

	try {
		Promise.all([
			infoStore.fetchInfo(Info.InfoType.REGIONS),
			fetchKascoFranchise.value(),
			infoStore.fetchDago(),
			infoStore.fetchNs()
		])
	} catch (e) {
	} finally {
		isLoadingInfo.value = false
	}
}

onMounted(() => {
	if (!startedAt) setStartedAt()
	fetchInfoLists()
})

watch(
	() => totalCost.value,
	(newValue: number, oldValue: number) => {
		fetchKascoFranchise.value()
	}
)
</script>
