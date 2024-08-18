<template>
	<calculator-block
		:title="title"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<template #header>
			<!--		Todo: temporary hide	-->
			<ui-checkbox
				v-if="
					false &&
					(type === types.BREAK ||
						type === types.KASCO ||
						type === types.SPECTECH ||
						type === types.ASSET)
				"
				@change="set('isProlongation', $event)"
				:value="isProlongation"
				type="checkbox"
			>
				Пролонгация
			</ui-checkbox>
		</template>

		<div class="calculator__price">
			<ui-input
				v-if="type === types.BREAK"
				title="Адрес имущества"
				:value="address"
				:error="errorEmpty(address)"
				:key="Fields.Address.ADDRESS_VALUE"
				:id="Fields.Address.ADDRESS_VALUE"
				required
				@input:value="set('assetAddress', $event)"
			/>

			<div class="calculator__price-row" v-if="isProlongation">
				<ui-input
					title="Номер договора"
					:value="prolongationDocNumber"
					:error="errorEmpty(prolongationDocNumber)"
					type="number"
					required
					@input:value="set('prolongationDocNumber', $event)"
				/>

				<ui-radio
					:value="sumInsured"
					:options="sumInsureds"
					@change="set('sumInsured', $event)"
				/>
			</div>
			<template v-else>
				<ui-input-number
					v-if="type === types.SMR"
					title="Стоимость сметных работ (стоимость строительства)"
					:value="buildingCost"
					isAddonAfter
					:formatter="numberRubFormatter"
					:parser="numberRubParser"
					:error="errorEmpty(buildingCost)"
					type="number"
					:min="0"
					:key="Fields.Payment.BUILDING_COST"
					:id="Fields.Payment.BUILDING_COST"
					required
					@input:value="set('buildingCost', $event)"
				>
					<template #addonAfter>Руб.</template>
				</ui-input-number>

				<ui-input-number
					v-if="type !== types.SPECTECH"
					title="Страховая сумма"
					:value="sumInsured"
					:error="sunInsuredErrorFabric"
					isAddonAfter
					:formatter="numberRubFormatter"
					:parser="numberRubParser"
					:info="sumInsuredInfo"
					type="number"
					:min="0"
					required
					:key="Fields.Payment.SUM_INSURED"
					:id="Fields.Payment.SUM_INSURED"
					@input:value="setSumInsured"
					@focusout="onFocusoutSumInsured"
				>
					<template #addonAfter>Руб.</template>
				</ui-input-number>
			</template>

			<ui-select
				title="Франшиза"
				:value="franchise"
				:options="franchiseOptions"
				required
				:key="Fields.Payment.FRANCHISE"
				:id="Fields.Payment.FRANCHISE"
				v-if="isFranchiseList"
				@change="setFranchiseValue"
			/>
			<ui-input-number
				title="Франшиза"
				:value="franchise"
				:parser="numberRubParser"
				:formatter="numberRubFormatter"
				isReadOnly
				:key="Fields.Payment.FRANCHISE"
				:id="Fields.Payment.FRANCHISE"
				v-else-if="isFranchise"
				@input:value="set('franchise', $event)"
			/>

			<template v-if="type === types.SPECTECH">
				<ui-input-number
					title="Безусловная франшиза"
					:value="franchise"
					:parser="numberRubParser"
					:formatter="numberRubFormatter"
					:key="Fields.Payment.FRANCHISE"
					:id="Fields.Payment.FRANCHISE"
					@input:value="set('franchise', $event)"
				/>
				<ui-input-number
					title="Сумма залога"
					:value="plegeSum"
					isAddonAfter
					:formatter="numberRubFormatter"
					:parser="numberRubParser"
					type="number"
					:min="0"
					:id="Fields.Payment.PLEDGE_SUM"
					@input:value="set('plegeSum', $event)"
				>
					<template #addonAfter>Руб.</template>
				</ui-input-number>
				<ui-input-number
					title="Общая страховая сумма"
					:value="sumInsured"
					:error="sunInsuredErrorFabric"
					isAddonAfter
					:formatter="numberRubFormatter"
					:parser="numberRubParser"
					:info="sumInsuredInfo"
					type="number"
					:min="0"
					isReadOnly
					required
					:key="Fields.Payment.SUM_INSURED"
					:id="Fields.Payment.SUM_INSURED"
				>
					<template #addonAfter>Руб.</template>
				</ui-input-number>
				<ui-input-number
					title="Страховая премия"
					:value="premium"
					:error="sunInsuredErrorFabric"
					isAddonAfter
					:formatter="numberRubFormatter"
					:parser="numberRubParser"
					type="number"
					:min="0"
					isReadOnly
					required
					:key="Fields.Payment.INSURED_PREMIUM"
					:id="Fields.Payment.INSURED_PREMIUM"
				>
					<template #addonAfter>Руб.</template>
				</ui-input-number>
			</template>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
import _debounce from "lodash/debounce"

// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import {
	useCalculatorPackage,
	useSumInsured,
	useFields,
	useStore,
	useError
} from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import { CalculatorPackage } from "~/types"
import type { UiRadio } from "~/types"
import {
	Info,
	Calculator,
	CalculatorFields as Fields
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore } = useStore(props.type)

const radioOptionsFactory = (array: number[]) => {
	return array.map((value) => {
		return {
			value,
			label: value.toLocaleString()
		}
	})
}

const { errorEmpty, errorSumInsured } = useError()

// Data
const types = Calculator.TypeEnum

const { activePackageName } = useCalculatorPackage()

const isProlongation = computed(() => getField<boolean>("isProlongation"))
const buildingCost = computed(() => getField<string>("buildingCost"))
const sumInsured = computed(() => getField<number>("sumInsured"))
const address = computed(() => getField<string>("assetAddress"))
const plegeSum = computed(() => getField<number>("plegeSum"))
const premium = computed(() => getField<number>("premium"))

const prolongationDocNumber = computed(() =>
	getField<string>("prolongationDocNumber")
)

const franchise = computed((): number => {
	const value: number = +getField<string>("franchise")

	return isFranchiseList.value ? value + 1 : value
})

const sumInsureds = computed((): UiRadio.Options => {
	switch (activePackageName.value) {
		case CalculatorPackage.SlugEnum.COMPLEX:
			return radioOptionsFactory([1000000, 3000000, 5000000, 8000000])
		case CalculatorPackage.SlugEnum.BASE:
			return radioOptionsFactory([1000000, 3000000, 5000000, 8000000])
		case CalculatorPackage.SlugEnum.INFORMATION:
			return radioOptionsFactory([1000000, 2000000, 3000000])
		case CalculatorPackage.SlugEnum.WALLET:
			return radioOptionsFactory([500000, 1000000, 1500000])
		case CalculatorPackage.SlugEnum.DDOS:
			return radioOptionsFactory([1000000, 1500000, 3000000, 4500000])
		default:
			return radioOptionsFactory([500000, 1000000, 1500000])
	}
})
const { fromString, toString } = useSumInsured(props.type)

// Computed
const franchiseOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.DYNAMIC_FRANCHISE).map((item) => {
		item.value = (item.value as number) + 1

		return item
	})
})

const title = computed((): string => {
	switch (props.type) {
		case types.BREAK:
			return "Страховые данные"
		default:
			return "Страховая сумма"
	}
})

const calculate = computed(() => {
	return _debounce(
		() => {
			store.calculate()
		},
		250,
		{
			maxWait: 1000
		}
	)
})

const sumInsuredInfo = computed((): string => {
	switch (props.type) {
		case Calculator.TypeEnum.BREAK:
			return "Допустимые значения: от 1 млн. до 10 млн. с шагом 100 тыс. руб."
		case Calculator.TypeEnum.ECO:
			return "Допустимые значения: от 250 тыс. до 30 млн. руб."
		default:
			return ""
	}
})

const sunInsuredErrorFabric = computed((): string | undefined => {
	switch (props.type) {
		case Calculator.TypeEnum.BREAK:
			return sumInsuredErrorBreak()
		case Calculator.TypeEnum.ECO:
			return sumInsuredErrorEco()
		case Calculator.TypeEnum.SMR:
			return sumInsuredErrorSmr()
		case Calculator.TypeEnum.CYBER:
			return sumInsuredErrorCyber()
		default:
			sumInsuredError(sumInsured.value)
	}
})

const isFranchise = computed((): boolean => {
	const list: Calculator.Type[] = [types.ASSET, types.ECO, types.SMR]

	return list.includes(props.type)
})

const isFranchiseList = computed((): boolean => {
	const list: Calculator.Type[] = [types.SMR]

	return list.includes(props.type)
})

// Methods
const { numberRubFormatter, numberRubParser } = useFields()

function sumInsuredFormatter(value: string | number): string {
	return `₽ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function sumInsuredParser(value: string): string {
	return value.replace(/\₽\s?|( *)/g, "")
}

function setSumInsured(value: number): void {
	set("sumInsured", value)

	const setFranchiseCalculators: Calculator.Type[] = [types.ECO]

	if (isFranchise.value && setFranchiseCalculators.includes(props.type)) {
		setFranchise(value)
	}

	if (props.type === types.SMR) {
		store.setInsuranceSumPpgo(value)
	}
}

function onFocusoutSumInsured(): void {
	const canFormat: boolean = props.type === Calculator.TypeEnum.BREAK

	if (canFormat) {
		formatSumInsured()
	}
}

function formatSumInsured(formatBy: number = 100000): void {
	let value: number = +sumInsured.value

	const remainder: number = value % formatBy
	const addition: number = formatBy - remainder

	if (remainder >= 50000) {
		value += addition
	} else {
		value -= remainder
	}

	setSumInsured(value)
}

function sumInsuredError(value: number): string {
	let fromValue: string = fromString

	if (store.getActivePackage === 4) {
		fromValue = "500 000"
	}

	return errorSumInsured(value, fromValue, toString, props.type)
}

function sumInsuredErrorBreak(): string {
	const isValid: boolean =
		sumInsured.value % 100000 === 0 &&
		sumInsured.value <= 10000000 &&
		sumInsured.value >= 1000000

	return isValid
		? ""
		: "Допустимые значения: от 1 млн. до 10 млн. с шагом 100 тыс. руб."
}

function sumInsuredErrorEco(): string {
	return sumInsured.value <= 30000000 && sumInsured.value >= 250000
		? ""
		: "Допустимые значения: от 250 тыс. до 30 млн. руб."
}

function sumInsuredErrorSmr(): string {
	if (+sumInsured.value > +buildingCost.value) {
		return "не может быть больше стоимости сметных работ"
	} else if (+sumInsured.value < +buildingCost.value * 0.7) {
		return "не может быть менее 70% стоимости сметных работ"
	} else if (+sumInsured.value > 465000000) {
		return "не может быть более 465 млн."
	}

	return ""
}

function sumInsuredErrorCyber(): string {
	return sumInsured.value <= 10000000 && sumInsured.value >= 1000000
		? ""
		: "Допустимые значения: от 1 млн. до 10 млн. руб."
}

function getField<T>(fieldName: string): T {
	return store.getFieldPayment("price", fieldName)
}

function setFranchiseValue(value: number): void {
	set("franchise", isFranchiseList.value ? value - 1 : value)
}

function setFranchise(sumInsured: string | number): void {
	sumInsured = Number(sumInsured)

	if (sumInsured >= 250000 && sumInsured <= 15000000) {
		set("franchise", 50000)
	} else if (sumInsured > 15000000 && sumInsured <= 30000000) {
		set("franchise", 100000)
	} else {
		set("franchise", "")
	}
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "price", fieldName, value)

	if (!errorSumInsured(value)) {
		calculate.value()
	}
}
</script>
