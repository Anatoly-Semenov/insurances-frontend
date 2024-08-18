<template>
	<transition name="slide-fade-top">
		<ui-alert
			class="calculator__error"
			message="Сделка в статусе 40 - ERROR"
			:type="Alert.Type.ERROR"
			showIcon
			v-if="isDealError"
		/>
	</transition>
	<div
		class="calculator"
		:class="{
			_fixedContent: isFixedInfo,
			_inversion: isInversion,
			_error: isDealError
		}"
	>
		<div class="calculator__main">
			<div class="calculator__head">
				<div class="calculator__head-main">
					<p class="calculator__head-title">
						<component :is="icon" />
						{{ title }}{{ detailTitle }}
					</p>
					<ui-tabs
						:value="tabValue"
						@change="changeTab"
						animated
						v-if="!isCustomCalculator"
					>
						<ui-tab
							v-for="{ value, label, disabled } in tabs"
							:tab="label"
							:key="value"
							:disabled="disabled"
						/>
					</ui-tabs>
				</div>
				<calculator-head-buttons :type="type" />
			</div>
			<div class="calculator__content">
				<transition name="fade-in">
					<component :is="activeTab" :key="tabValue" :type="type" />
				</transition>
				<calculator-info-buttons :type="type" v-if="isInversion" />
			</div>
		</div>
		<calculator-info :isFixed="isFixedInfo" :type="type" />
	</div>
</template>

<script setup lang="ts">
// Components
import { SecurityScanOutlined } from "@ant-design/icons-vue"
import { notification } from "ant-design-vue"

const calculatorInfo = defineAsyncComponent(
	() => import("./calculator-info.vue")
)
const calculatorTabInsurer = defineAsyncComponent(
	() => import("./calculator-tab-insurer.vue")
)
const calculatorTabPayment = defineAsyncComponent(
	() => import("./calculator-tab-payment.vue")
)
const calculatorHeadButtons = defineAsyncComponent(
	() => import("./calculator-head-buttons.vue")
)
const calculatorInfoButtons = defineAsyncComponent(
	() => import("./calculator-info-buttons.vue")
)
const calculatorTabRegistration = defineAsyncComponent(
	() => import("./calculator-tab-registration.vue")
)
const calculatorTabTerritories = defineAsyncComponent(
	() => import("./calculator-tab-territories.vue")
)

// Hooks
import { useCalculatorConfig, useStore } from "~/hooks"

// Types
import { Calculator, DealService } from "@common-repo/types/src"
import { UiRadio as Radio, UiAlert as Alert } from "~/types"
import type { Component, PropType } from "@vue/runtime-core"

const props = defineProps({
	title: {
		type: String,
		default: "Кибер-риски"
	},
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	},
	icon: {
		type: Function,
		default: SecurityScanOutlined
	}
})

// Plugins
const { $analytics } = useNuxtApp()

// Store
const { store, infoStore, settingsStore } = useStore(props.type)

// Data
const route = useRoute()
const router = useRouter()
const types = Calculator.TypeEnum
const isFixedInfo = ref<boolean>(false)
const tabValue = ref<Calculator.Tab | "territories">(Calculator.Tab.INSURER)

// Methods
const { isCustomCalculator } = useCalculatorConfig(props.type)

async function fetchDealIfNeeded(): Promise<void> {
	if (dealId.value) {
		store.setDealId(dealId.value)
		await store.fetchDeal(dealId.value)

		store.calculate()

		if (props.type === Calculator.TypeEnum.SMR) {
			if (store.getIsGo) {
				store.calculateGo()
			}

			if (store.getIsPpgo) {
				store.calculatePpgo()
			}

			if (store.getIsTerrorRisk) {
				store.calculateEmergencyRisk()
			}
		}

		$analytics.openDeal({
			calcName: store.calculatorName,
			isSuccess: true,
			value: store.getPrice
		})
	}
}

function changeTab(value: Calculator.Tab): void {
	tabValue.value = value

	router.push({
		query: {
			tab: value
		}
	})

	{
		const { $event } = useNuxtApp()

		switch (value) {
			case Calculator.Tab.INSURER:
				$event.showClient(props.type)
				break
			case Calculator.Tab.PAYMENT:
				$event.showCalculation(props.type)
				break
			case Calculator.Tab.REGISTRATION:
				$event.showFinal(props.type)
				break
			default:
				break
		}
	}
}
function setRouterTab() {
	if (routerTab.value && tabValue.value !== routerTab.value) {
		tabValue.value = routerTab.value as Calculator.Tab
	}
}

function setFixedInfo() {
	const currentYPosition: number = window.scrollY
	const currentWidth: number = window.innerWidth

	if (currentYPosition > 100 && !isFixedInfo.value && currentWidth > 1100) {
		isFixedInfo.value = true
	} else if (
		(currentYPosition < 100 && isFixedInfo.value) ||
		currentWidth < 1099
	) {
		isFixedInfo.value = false
	}
}

function scrollEvent(type: "add" | "delete" = "add"): void {
	if (type === "add") {
		document.addEventListener("scroll", setFixedInfo)
	} else {
		document.removeEventListener("scroll", setFixedInfo)
	}
}

function setFormatDisplay(value: boolean): void {
	if (props.type === Calculator.TypeEnum.AGRO) {
		settingsStore.setIsInversion(value)
	}
}

function displaySpectechNotification(isSuccess: boolean = false): void {
	if (!dealId.value) {
		const key: string = "spectechWarningKey"

		if (props.type === Calculator.TypeEnum.SPECTECH) {
			if (isSuccess) {
				notification.success({
					key,
					message: "Можно сохранять сделку",
					description: "Охрана присутствует в нерабочее время"
				})
			} else {
				notification.error({
					key,
					message: "Невозможно сохранить сделку",
					description: `Если не выбрано \"Охрана присутствует в нерабочее время\", то сохранить или расчитать сделку невозможно`,
					duration: 100000
				})
			}
		}
	}
}

function mountedAnalytics(): void {
	if (!dealId.value) {
		const { $event } = useNuxtApp()

		$event.newDeal(props.type)
	}
}

// Computed
const dealId = computed((): number => {
	return +route?.params?.id || 0
})

const detailTitle = computed((): string => {
	return dealId.value ? ` / № ${dealId.value}` : ""
})

const isDealError = computed((): boolean => {
	return store.getDealStatus === DealService.Status.ERROR
})

const tabs = computed((): Radio.Options => {
	let list: Radio.Options = [
		{
			value: Calculator.Tab.INSURER,
			label: "Страхователь",
			disabled: props.type === types.AGRO
		},
		{
			value: Calculator.Tab.PAYMENT,
			label: "Расчет",
			disabled: props.type !== types.AGRO ? !store.getIsValidInn : false
		},
		{
			value: Calculator.Tab.REGISTRATION,
			label: "Оформление",
			disabled: props.type === types.AGRO || !store.getIsValidInn
		}
	]

	if (props.type === Calculator.InsurancesType.ASSET) {
		const territoryTab: Radio.Option = {
			// Todo: add to types package
			value: "territories",
			label: "Территории",
			disabled: !store.getIsValidInn
		}

		const listA: Radio.Options = list.slice(0, 1)
		const listB: Radio.Options = list.slice(-2)

		list = [...listA, territoryTab, ...listB]
	}

	return list
})

const activeTab = computed((): Component => {
	switch (tabValue.value) {
		case Calculator.Tab.INSURER:
			return calculatorTabInsurer
		case Calculator.Tab.PAYMENT:
			return calculatorTabPayment
		case Calculator.Tab.REGISTRATION:
			return calculatorTabRegistration
		case "territories":
			return calculatorTabTerritories
		default:
			return props.type === types.AGRO
				? calculatorTabPayment
				: calculatorTabInsurer
	}
})

const routerTab = computed(() => {
	return route?.query?.tab || ""
})

const isInversion = computed((): boolean => {
	return settingsStore.getIsInversion
})

onMounted(async () => {
	infoStore.setActiveCalculatorType(props.type)

	scrollEvent("add")

	store.setCalculatorType(props.type)

	window.setTimeout(() => {
		setRouterTab()
	}, 1)

	await fetchDealIfNeeded()

	if (props.type === Calculator.TypeEnum.KASCO) {
		store.fetchPreApprove()
	} else if (props.type === types.AGRO) {
		tabValue.value = Calculator.Tab.PAYMENT
	}

	setFormatDisplay(true)

	displaySpectechNotification()

	mountedAnalytics()
})

onUnmounted(() => {
	// Reset active calculator type form info store
	infoStore.setActiveCalculatorType(null)

	// Remove event from event listener
	scrollEvent("delete")

	// Reset current calculator state data
	store.resetState()

	// Inversion calculator display logic
	setFormatDisplay(false)

	// Destroy all current notifications
	notification.destroy()
})

watchEffect(() => {
	setRouterTab()
})

if (typeof store?.getIsSecurityAssist !== "undefined") {
	watch(
		() => store.getIsSecurityAssist,
		(newValue: boolean, oldValue: boolean) => {
			if (!oldValue && newValue) {
				displaySpectechNotification(true)
			} else if (oldValue && !newValue) {
				displaySpectechNotification(false)
			}
		}
	)
}
</script>
