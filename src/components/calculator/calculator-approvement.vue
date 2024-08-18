<template>
	<ui-modal
		class="calculator__approvement-modal"
		:class="{
			_disabled: store.getIsSended,
			_loading: isLoading || isLoadingOsagoDeal
		}"
		title="Информация о сделке"
		:visible="isModal"
		@cancel:visible="$emit('close')"
		@ok:visible="closeDeal"
		:confirmLoading="isLoading"
		:okDisabled="isDisabledCloseDeal"
		:okId="Calculator.Id.Button.CLOSE_DEAL_FROM_MODAL"
		okText="Оформить"
		cancelText="Отмена"
		:width="600"
	>
		<div class="calculator__approvement">
			<div
				class="calculator__approvement-insurance"
				v-for="({ title, list, insuranceType }, index) in activeInsurances"
				:key="title + index"
			>
				<p class="calculator__approvement-subtitle">{{ title }}:</p>
				<calculator-results-block
					v-for="(
						{ insuranceCompany, isCvDisabled, minCv, maxCv, logo }, index
					) in list"
					:key="index"
					:insuranceType="insuranceType"
					:insuranceCompany="insuranceCompany"
					:isCvDisabled="isCvDisabled"
					:minCv="minCv"
					:maxCv="maxCv"
					:logo="logo"
					:type="type"
				/>
			</div>
			<transition name="fade-in">
				<ui-alert
					message="Страхование предодобренного ИНН"
					:type="Alert.Type.INFO"
					showIcon
					v-if="isPreApprovement"
				/>
			</transition>

			<div class="calculator__approvement-buttons">
				<template v-if="isVsk">
					<ui-button
						@click="sendVskScoring"
						:loading="isLoadingScorringVsk"
						:disabled="store.getIsLoading"
						v-if="!store.getIsVskScoringSuccess"
					>
						Провести скоринг ВСК
					</ui-button>
					<transition name="slide-fade-top">
						<ui-alert
							message="Скоринг ВСК успешно проведен!"
							:type="Alert.Type.INFO"
							showIcon
							v-if="store.getIsVskScoringSuccess"
						/>
					</transition>
				</template>
			</div>

			<template v-if="activeInsurances.length && store.canCloseOsagoInsurance">
				<div class="calculator__approvement-fields" v-if="isPaymentDocument">
					<ui-input
						title="Номер платежного документа"
						:value="paymentNumber"
						isReadOnly
						:key="Fields.Payment.PAYMENT_DOCUMENT_NUMBER"
						:id="Fields.Payment.PAYMENT_DOCUMENT_NUMBER"
					/>
					<ui-input
						title="Дата платежного документа"
						:value="paymentDate"
						isReadOnly
						:key="Fields.Payment.PAYMENT_DOCUMENT_DATE"
						:id="Fields.Payment.PAYMENT_DOCUMENT_DATE"
					/>
				</div>

				<ui-button
					class="calculator__approvement-close"
					@click="closeOsagoDeal"
					:loading="isLoadingOsagoDeal"
				>
					Подтвердить оплату и получить оригиналы документов ОСАГО
				</ui-button>
			</template>

			<p class="calculator__approvement-empty" v-if="!activeInsurances.length">
				Не выбран ни один тип страхования
			</p>

			<ui-alert
				message="Сделка закрыта"
				:type="Alert.Type.Success"
				showIcon
				v-if="isClosedDeal"
			/>
		</div>
	</ui-modal>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue"

// Components
import { calculatorResultsBlock } from "./payment"

// Hooks
import { useStore, KascoInsurance, useCalculatorKasco } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import {
	CalculatorFields as Fields,
	KascoService,
	Calculator
} from "@common-repo/types/src"

import { UiAlert as Alert } from "~/types"

interface InsuranceData {
	insuranceType: KascoService.InsuranceType
	listInsurance: KascoInsurance[]
	isSelected: boolean
	title: string
	key: string
}

const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	},
	isModal: {
		type: Boolean,
		default: false
	}
})

// Emits
const emit = defineEmits(["close"])

// Store
const { store, configStore } = useStore(props.type)

// Data
const { kascoList, osagoList } = useCalculatorKasco(props.type)

const isLoading = ref<boolean>(false)
const isLoadingOsagoDeal = ref<boolean>(false)
const isLoadingScorringVsk = ref<boolean>(false)

const activeInsurances = computed(() => {
	const insurances: any[] = []

	const data: InsuranceData[] = [
		{
			title: "КАСКО",
			listInsurance: kascoList,
			key: "kasco",
			isSelected: store.getIsSelectedKasco,
			insuranceType: KascoService.InsuranceType.KASCO
		},
		{
			title: "ОСАГО",
			listInsurance: osagoList,
			key: "osago",
			isSelected: store.getIsSelectedOsago,
			insuranceType: KascoService.InsuranceType.OSAGO
		}
	]

	data.forEach(
		({
			key,
			title,
			isSelected,
			listInsurance,
			insuranceType
		}: InsuranceData) => {
			if (isSelected) {
				const list = listInsurance.filter(
					({ insuranceCompany }: KascoInsurance) => {
						return store.payment[key][insuranceCompany].isSelected
					}
				)

				if (list.length) {
					insurances.push({
						insuranceType,
						title,
						list
					})
				}
			}
		}
	)

	return insurances
})

// Computed
const isDisabledCloseDeal = computed((): boolean => {
	return (
		(!store.getCanCloseDeal && !store.getCanCloseOsagoInsurance) ||
		(isVsk.value ? !store.getIsVskScoringSuccess : false)
	)
})

const isPaymentDocument = computed((): boolean => {
	return !!(
		store?.getPaymentDocument?.number || store?.getPaymentDocument?.date
	)
})

const isClosedDeal = computed((): boolean => {
	if (!store.getIsSelectedOsago) {
		return store.getIsSended
	}

	return store.getIsSended && store.getCanCloseOsagoInsurance
})

const isVsk = computed((): boolean => {
	for (const insurance of activeInsurances.value) {
		if (insurance.insuranceType) {
			for (const insuranceItem of insurance.list) {
				if (
					insuranceItem.insuranceCompany === KascoService.InsuranceCompany.VSK
				) {
					return true
				}
			}
		}
	}

	return false
})

const canCloseDeal = computed((): boolean => {
	return store?.canCloseOsago || store.getCanCloseDeal
})

const paymentDate = computed((): string => {
	let date = store?.getPaymentDocument?.date || ""

	if (date) {
		const { $dayjs } = useNuxtApp()

		return $dayjs(date, configStore.getFormatDatesInsurance).format(
			configStore.getFormatDates
		)
	}

	return date
})

const paymentNumber = computed((): string => {
	return store.getPaymentDocument.number
})

// Methods
async function closeDeal(): Promise<void> {
	if (canCloseDeal.value) {
		isLoading.value = true

		await store.closeInsurances()

		isLoading.value = false
	}
}

async function closeOsagoDeal(): Promise<void> {
	if (canCloseDeal.value) {
		isLoadingOsagoDeal.value = true

		await store.closeOsagoDeal()

		isLoadingOsagoDeal.value = false
	}
}

async function preSaveDeal(): Promise<void> {
	const messageKey: string = "loading"

	message.loading({
		content: "Подготавливаем сделку к оформлению",
		key: messageKey,
		duration: 10000
	})

	isLoadingOsagoDeal.value = true
	await store.saveDeal()
	isLoadingOsagoDeal.value = false

	// Destroy all messages in app
	message.destroy()

	message.success({
		content: "Сделка готова к оформлению",
		key: messageKey
	})
}

async function sendVskScoring(): Promise<void> {
	isLoadingScorringVsk.value = true
	await store.sendVskScoring()
	isLoadingScorringVsk.value = false
}

onMounted(() => {
	if (store?.canCloseOsago) {
		store.resetSelectInsurances(true)
	}
})

watch(
	() => props.isModal,
	(newValue: boolean, oldValue: boolean) => {
		if (!oldValue && newValue && activeInsurances.value?.length) {
			preSaveDeal()
		}
	}
)
</script>
