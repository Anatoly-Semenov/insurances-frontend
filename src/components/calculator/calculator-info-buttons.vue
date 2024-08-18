<template>
	<div class="calculator__info-buttons" v-if="!store.getIsDisabledFields">
		<ui-button
			:class="{ _half: isHalf }"
			v-if="canDisplayCalculate"
			:disabled="!store.getIsValidCalculation"
			:id="Calculator.Id.Button.CALCULATE"
			:loading="isLoadingCalculate"
			@click="calculate"
		>
			Рассчитать
		</ui-button>

		<ui-button
			:class="{ _half: isPaymentTab }"
			@click="store.saveDeal"
			:loading="store.getIsLoadingSave"
			:id="Calculator.Id.Button.SAVE_DEAL"
		>
			Сохранить
		</ui-button>

		<ui-button
			type="ghost"
			@click="isPreviewModal = true"
			v-if="canPreview"
			:class="{
				_long: type !== Calculator.TypeEnum.CYBER && isPaymentTab
			}"
			:id="Calculator.Id.Button.SEND_KP"
		>
			Отправить расчет
		</ui-button>

		<ui-button
			class="_long"
			type="ghost"
			@click="sendPreCalculation"
			:loading="isLoadingPreCalculation"
			:id="Calculator.Id.Button.SEND_PRE_CALCULATION"
			v-if="canPreCalculation"
		>
			Отправить предрасчет
		</ui-button>

		<ui-button
			:class="{ _half: isHalf }"
			@click="onClickCloseDeal"
			:loading="store.getIsLoadingClose"
			:disabled="!store.getCanCloseDeal"
			v-if="canCloseDeal"
			:id="Calculator.Id.Button.CLOSE_DEAL"
		>
			Оформить сделку
		</ui-button>

		<calculator-approvement
			:type="type"
			:isModal="isApprovementModal"
			@close="isApprovementModal = false"
		/>

		<calculator-preview
			:type="type"
			:isModal="isPreviewModal"
			@close="isPreviewModal = false"
		/>

		<ui-tooltip :title="validationText" placement="bottom">
			<ui-button
				:class="{ _long: isLongVerifyButton }"
				:type="store.getIsVerify ? 'primary' : 'danger'"
				:loading="isVerifyProgress"
				:disabled="!store.getCanVerify"
				:id="Calculator.Id.Button.FZ_115"
				v-if="isDisplayVerify"
				@click="checkSecurity"
			>
				{{ verifyText }}
			</ui-button>
		</ui-tooltip>

		<transition name="fade-in">
			<ui-button
				class="_long"
				type="default"
				v-if="canIssueKasco"
				:loading="isLoadingIssueKasco"
				:id="Calculator.Id.Button.ISSUE_KASCO"
				@click="issueKasco"
			>
				Выпустить проект полиса КАСКО
			</ui-button>
		</transition>

		<transition name="fade-in">
			<ui-button
				class="_long"
				type="default"
				v-if="canDraft"
				:loading="isLoadingDraft"
				:id="Calculator.Id.Button.SEND_DRAFT"
				@click="sendDraft"
			>
				Выпустить проект договора
			</ui-button>
		</transition>
	</div>
	<div class="calculator__info-buttons" v-else-if="isDraftSendedCloseButton">
		<ui-button
			:class="{ _half: isHalf }"
			@click="onClickCloseDeal"
			:loading="store.getIsLoadingClose"
			:id="Calculator.Id.Button.CLOSE_DEAL"
		>
			Оформить сделку
		</ui-button>

		<calculator-approvement
			:type="type"
			:isModal="isApprovementModal"
			v-if="!store.getIsSended"
			@close="isApprovementModal = false"
		/>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()

// Components
import { message } from "ant-design-vue"

const calculatorPreview = defineAsyncComponent(
	() => import("./calculator-preview.vue")
)
const calculatorApprovement = defineAsyncComponent(
	() => import("./calculator-approvement.vue")
)

// Hooks
import { useStore } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Data
const isLoadingPreCalculation = ref<boolean>(false)
const isLoadingIssueKasco = ref<boolean>(false)
const isApprovementModal = ref<boolean>(false)
const isLoadingCalculate = ref<boolean>(false)
const isVerifyProgress = ref<boolean>(false)
const isLoadingDraft = ref<boolean>(false)
const isPreviewModal = ref<boolean>(false)
const types = Calculator.TypeEnum

// Store
const { store } = useStore(props.type)

// Computed
const validationText = computed((): string => {
	return store.getCanVerify ? "" : "Заполните основную информацию о компании"
})

const isArchive = computed((): boolean => {
	return route.path !== `/${props.type}`
})

const isPaymentTab = computed((): boolean => {
	return route.query?.tab === "payment"
})

const isRegistration = computed((): boolean => {
	return route.query?.tab === "registration"
})

const isDraftSendedCloseButton = computed((): boolean => {
	const availableCalculators: Calculator.Type[] = [
		Calculator.TypeEnum.OSAGO_SPECTECH,
		Calculator.TypeEnum.SPECTECH
	]

	return (
		availableCalculators.includes(props.type) &&
		store?.canCloseOsago &&
		!store.getIsSended
	)
})

const canPreview = computed((): boolean => {
	const allowedCalculators: Calculator.Type[] = [types.CYBER, types.ECO]

	return (
		store.getPrice &&
		isPaymentTab.value &&
		allowedCalculators.includes(props.type)
	)
})

const canCloseDeal = computed((): boolean => {
	return isArchive.value && isRegistration.value
})

const canIssueKasco = computed((): boolean => {
	return props.type === Calculator.TypeEnum.KASCO && store.getIsSelectedKasco
})

const canDraft = computed((): boolean => {
	const calculators: Calculator.Type[] = [Calculator.TypeEnum.SMR]

	return calculators.includes(props.type) && store.getCanDraft
})

const canPreCalculation = computed((): boolean => {
	const calculators: Calculator.Type[] = [Calculator.TypeEnum.SPECTECH]

	return (
		isPaymentTab.value &&
		calculators.includes(props.type) &&
		store.getCanPreCalculation
	)
})

const verifyText = computed((): string => {
	return store.getIsVerify ? "Проверено по 115ФЗ" : "Проверить по 115ФЗ"
})

const isHalf = computed((): boolean => {
	const tabs: string[] = ["payment", "registration"]

	return isPaymentTab.value && tabs.includes(route.query?.tab as string)
})

const isLongVerifyButton = computed((): boolean => {
	const excludeCalculators: Calculator.Type[] = [
		Calculator.TypeEnum.OSAGO_SPECTECH,
		Calculator.TypeEnum.KASCO
	]

	return isPaymentTab.value && !excludeCalculators.includes(props.type)
})

const isDisplayVerify = computed((): boolean => {
	const excludeList: Calculator.Type[] = [Calculator.TypeEnum.AGRO]

	return !excludeList.includes(props.type)
})

const canDisplayCalculate = computed((): boolean => {
	const availableCalculators: Calculator.Type[] = [
		types.SPECTECH,
		types.CYBER,
		types.BREAK,
		types.CASH,
		types.ECO,
		types.SMR
	]

	return isPaymentTab.value && availableCalculators.includes(props.type)
})

// Methods
async function checkSecurity(): Promise<void> {
	if (store.getCanVerify && !isVerifyProgress.value) {
		isVerifyProgress.value = true

		{
			const { $event } = useNuxtApp()

			$event.compliance(props.type)
		}

		try {
			await store.verify()
		} catch (e) {
			message.error("Ошибка проверки по 115 ФЗ")
		}

		isVerifyProgress.value = false
	}
}
async function calculate(): Promise<void> {
	isLoadingCalculate.value = true
	await store.calculate().catch(() => {})
	isLoadingCalculate.value = false
}

function onClickCloseDeal(): void {
	const approvementCalculators: Calculator.Type[] = [
		Calculator.TypeEnum.OSAGO_SPECTECH,
		Calculator.TypeEnum.KASCO
	]

	if (approvementCalculators.includes(props.type)) {
		isApprovementModal.value = true
	} else {
		store.closeDeal()
	}
}

async function issueKasco(): Promise<void> {
	if (props.type === Calculator.TypeEnum.KASCO) {
		isLoadingIssueKasco.value = true

		await store.issueKasco("Draft").finally(() => {
			isLoadingIssueKasco.value = false
		})
	}
}

async function sendDraft(): Promise<void> {
	isLoadingDraft.value = true

	await store.sendDraft()

	isLoadingDraft.value = false
}

async function sendPreCalculation(): Promise<void> {
	isLoadingPreCalculation.value = true

	await store.sendPreCalculation()

	isLoadingPreCalculation.value = false
}
</script>
