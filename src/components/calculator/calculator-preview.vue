<template>
	<ui-modal
		title="Отправить расчет"
		:visible="isModal"
		@cancel:visible="$emit('close')"
		@ok:visible="sendEmail"
		:confirmLoading="isLoading"
		:okDisabled="isDisabled"
		:okId="Calculator.Id.Button.SEND_KP_SUBMIT"
		okText="Отправить"
		cancelText="Отменить"
		:width="500"
	>
		<div class="calculator__preview">
			<div class="calculator__preview-container">
				<ui-input
					title="Электронная почта"
					:value="email"
					:disabled="isLoading"
					:error="errorEmail(email)"
					:id="Calculator.Id.Field.SEND_KP_EMAIL"
					@input:value="setEmail($event)"
				/>
				<ui-input
					title="ИНН клиента"
					:value="inn"
					:error="errorInn(inn)"
					:disabled="isLoading"
					:id="Calculator.Id.Field.SEND_KP_INN"
					v-if="canDisplayInn"
					@input:value="inn = $event"
				/>
			</div>
		</div>
	</ui-modal>
</template>

<script setup lang="ts">
// Components
import { message } from "ant-design-vue"

// Hooks
import { useError, useStore } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"

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

// Data
const email = ref<string>("")
const inn = ref<string>("")
const isLoading = ref<boolean>(false)

// Store
const { store } = useStore(props.type)

// Plugins
const { $analytics, $cyberApi } = useNuxtApp()

// Events
const emit = defineEmits(["close"])

// Methods
const { errorInn, errorEmail } = useError()

function setEmail(value: string) {
	email.value = value
	store.setPolicyholderEmail(value)
}
function setDataFromStore() {
	inn.value = store.getInn
	email.value = store.getPolicyholderEmail
}
function resetData() {
	setDataFromStore()
	isLoading.value = false
}

function generateApi(): any {
	switch (props.type) {
		case Calculator.TypeEnum.CYBER:
			return $cyberApi
		default:
			return null
	}
}

async function generatePreCalculate(): Promise<void> {
	const $api = generateApi()

	if ($api) {
		await $api.generatePreCalculate(store.getDealId, email.value)
	} else if (props.type === Calculator.TypeEnum.ECO) {
		await store.sendCommercialOffer(email.value)
	} else {
		message.error("Ошибка создания запроса на отправку расчета")
	}
}

async function sendEmail(): Promise<void> {
	isLoading.value = true

	try {
		await store.saveDeal()

		if (store.getDealId) {
			await generatePreCalculate()
		}

		$analytics.sendCalculation({
			calcName: store.calculatorName,
			isSuccess: true,
			value: store.getPrice
		})

		resetData()
		emit("close")
	} catch (e) {
		$analytics.sendCalculation({
			calcName: store.calculatorName,
			isSuccess: false,
			value: store.getPrice
		})
	}
}

// Computed
const isDisabled = computed((): boolean => {
	return !!(errorEmail(email.value) || errorInn(inn.value))
})

const canDisplayInn = computed((): boolean => {
	return props.type === Calculator.TypeEnum.CYBER
})

watchEffect(() => {
	setDataFromStore()
})
</script>
