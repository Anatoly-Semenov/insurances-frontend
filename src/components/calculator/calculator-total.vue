<template>
	<calculator-block title="Итого">
		<template #header>
			<ui-tooltip :title="formatDisplayTooltip" placement="left">
				<button
					class="calculator__total-inversion"
					@click="settingsStore.toggleIsInversion"
				>
					<right-outlined v-if="isInversion" />
					<left-outlined v-else />
				</button>
			</ui-tooltip>
		</template>

		<div class="calculator__total">
			<transition-group
				class="calculator__total-list"
				name="slide-fade-top"
				tag="div"
			>
				<div
					class="calculator__total-row"
					v-for="({ name, value, id, isSeparate }, index) in values"
					:key="name + index"
					:class="{ _separate: isSeparate }"
				>
					<p class="calculator__total-name">{{ name }}</p>
					<p class="calculator__total-value" :id="id">{{ value }}</p>
				</div>
			</transition-group>
			<button
				class="calculator__packages-item"
				@click="toPaymentTab"
				v-if="type === Calculator.TypeEnum.CYBER"
			>
				<component :is="activePackage.icon" :height="18" :width="18" />
				{{ activePackage.name }}
			</button>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue"

// Hooks
import { useCalculatorTotal, useStore, useCalculatorPackage } from "~/hooks"

// Types
import { Calculator, CalculatorFields } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"

interface Value {
	name: string
	value: string
	id?: string
}

interface TotalList {
	name: string
	value: string
	isSeparate?: boolean
	id: CalculatorFields.Total
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, settingsStore } = useStore(props.type)

// Data
const { cv, sumInsured, price, priceRub } = useCalculatorTotal(props.type)
const { activePackage } = useCalculatorPackage()

const totalSmr = ref<number>(0)

// Computed
const cvInRub = computed((): string => {
	return Number(priceRub?.value?.toFixed(2))?.toLocaleString() || "0"
})

const cvInRubSmr = computed((): string => {
	return Number(store.getCvInRub?.toFixed(2))?.toLocaleString() || "0"
})

const getCvInRub = computed((): string => {
	switch (props.type) {
		case Calculator.TypeEnum.SMR:
			return cvInRubSmr.value
		default:
			return cvInRub.value
	}
})

const isInversion = computed((): boolean => {
	return settingsStore.getIsInversion
})

const formatDisplayTooltip = computed((): string => {
	return `Поменять отображение на: ${
		isInversion.value ? "горизонтальный" : "вертикальный"
	} формат`
})

const values = computed((): Value[] => {
	const list: TotalList[] = [
		{
			name: "Страховая cумма:",
			value: `${sumInsured.value?.toLocaleString() || 0} ₽`,
			id: CalculatorFields.Total.SUM_INSURED
		},
		{
			name: "Цена:",
			value: `${price.value?.toLocaleString() || 0} ₽`,
			id: CalculatorFields.Total.PRICE
		},
		{
			name: "КВ:",
			value: `${cv.value || 0} %`,
			id: CalculatorFields.Total.CV
		},
		{
			name: "КВ, ₽:",
			value: `${getCvInRub.value} ₽`,
			id: CalculatorFields.Total.CV_IN_RUB
		}
	]

	if (props.type === Calculator.TypeEnum.SMR) {
		const isPpgo: boolean = store.getIsPpgo
		const isGo: boolean = store.getIsGo
		const isTerrorRisk: boolean = store.getIsTerrorRisk

		const pricePpgo: number = store.pricePpgo
		const priceGo: number = store.priceGo
		const priceTerrorRisk: number = store.priceTerrorRisk

		totalSmr.value = pricePpgo + priceGo + priceTerrorRisk + price.value

		list.splice(1, 1)

		list.push({
			name: "Страховая премия СМР:",
			value: `${price.value?.toLocaleString() || 0} ₽`,
			isSeparate: true,
			id: CalculatorFields.Total.PRICE_SMR
		})

		if (isGo) {
			list.push({
				name: "Страховая премия ГО:",
				value: `${priceGo?.toLocaleString() || 0} ₽`,
				id: CalculatorFields.Total.GO
			})
		}

		if (isPpgo) {
			list.push({
				name: "Страховая премия ППГО:",
				value: `${pricePpgo?.toLocaleString() || 0} ₽`,
				id: CalculatorFields.Total.PPGO
			})
		}

		if (isTerrorRisk) {
			list.push({
				name: "Страховая премия по риску Терроризм:",
				value: `${priceTerrorRisk?.toLocaleString() || 0} ₽`,
				id: CalculatorFields.Total.TERRORRISK
			})
		}

		list.push({
			name: "Общая страховая премия:",
			value: `${totalSmr.value?.toLocaleString() || 0} ₽`,
			id: CalculatorFields.Total.PRICE
		})
	}

	return list
})

// Methods
function toPaymentTab(): void {
	if (store.getIsValidInn) {
		const router = useRouter()

		router.push({ query: { tab: "payment" } })
	}
}
</script>
