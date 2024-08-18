<template>
	<calculator-block
		:title="title"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__summary">
			<div class="calculator__summary-fields">
				<div
					class="calculator__summary-field"
					v-for="({ title, value }, index) in fields"
					:key="index"
				>
					<p class="calculator__summary-name">{{ title }}:</p>

					<ui-input-number :value="value" isAddonAfter isReadOnly>
						<template #addonAfter>шт.</template>
					</ui-input-number>
				</div>
			</div>

			<div class="calculator__summary-additional" v-if="canDisplayAdditional">
				<div class="calculator__summary-risks">
					<p class="calculator__summary-title">Риски</p>

					<ui-checkbox
						v-for="({ id, name, orderNumber, selected }, index) in risks"
						:key="index"
						:id="`risk-${index + 1}`"
						type="checkbox"
						:value="selected"
						@change="store.toggleSelectedRiskByIndex(index)"
					>
						{{ name }}
					</ui-checkbox>
				</div>
				<div class="calculator__summary-pledge">
					<p class="calculator__summary-title">Залог</p>

					<ui-radio
						type="button"
						:value="pledge"
						:options="pledgeOptions"
						@change="set('pledge', $event)"
					/>

					<ui-input-number
						title="Страховая залога"
						:value="pledgeSum"
						:formatter="numberRubFormatter"
						:parser="numberRubParser"
						isAddonAfter
						:error="errorEmpty(pledgeSum)"
						@input:value="set('pledgeSum', $event)"
					>
						<template #addonAfter>Руб.</template>
					</ui-input-number>

					<ui-select
						title="Выгодоприобретатель"
						:options="beneficiaryOptions"
						:value="beneficiary"
						@change="set('beneficiary', $event)"
						required
					/>
				</div>
			</div>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useFields, useStore, useError } from "~/hooks"

// Types
import type { ComputedRef, PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"
import type { AssetService, UiRadio } from "~/types"

interface Field {
	title: string
	value: ComputedRef
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const pledgeOptions: UiRadio.Options = [
	{
		value: "1",
		label: "Залог"
	},
	{
		value: "0",
		label: "Не залог"
	}
]
const beneficiaryOptions: UiRadio.Options = prepareOptions(["Банк"])

// Methods
const { numberRubFormatter, numberRubParser } = useFields()
const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getFieldPayment<T>("summary", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "summary", fieldName, value)
}

function prepareOptions(list: string[]): UiRadio.Options {
	return list.map((item: string) => {
		return {
			value: item,
			label: item
		}
	})
}

// Computed
const title = computed((): string => {
	return "Сводная информация по территориям"
})

const canDisplayAdditional = computed((): boolean => {
	return props.type === Calculator.InsurancesType.ASSET
})

const movableProperty = computed(() => getField<number>("movableProperty"))
const risks = computed(() => getField<AssetService.Risk[]>("risks"))
const beneficiary = computed(() => getField<number>("beneficiary"))
const equipments = computed(() => getField<number>("equipments"))
const buildings = computed(() => getField<number>("buildings"))
const pledgeSum = computed(() => getField<string>("pledgeSum"))
const pledge = computed(() => getField<number>("pledge"))
const lands = computed(() => getField<number>("lands"))
const tmc = computed(() => getField<number>("tmc"))

const fields = computed((): Field[] => {
	return [
		{
			title: "Здания и сооружения",
			value: buildings
		},
		{
			title: "Оборудование, машины, вкл. электронное оборудование",
			value: equipments
		},
		{
			title: "Земельные участки",
			value: lands
		},
		{
			title: "ТМЦ",
			value: tmc
		},
		{
			title: "Движимое имущество",
			value: movableProperty
		}
	]
})
</script>
