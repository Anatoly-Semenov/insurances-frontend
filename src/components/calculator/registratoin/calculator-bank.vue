<template>
	<calculator-block
		title="Данные страхователя"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__bank">
			<template v-if="type !== Calculator.TypeEnum.BREAK">
				<ui-input
					title="БИК"
					:value="bik"
					:error="errorBic(bik)"
					v-mask="Validation.Mask.BIK"
					required
					:key="Fields.Bank.BIK"
					:id="Fields.Bank.BIK"
					@input:value="setBik"
				/>
				<ui-input
					title="КПП"
					:value="kpp"
					disabled
					:error="errorKpp(kpp)"
					:key="Fields.Bank.KPP"
					:id="Fields.Bank.KPP"
					@input:value="set('kpp', $event)"
				/>
				<ui-input
					title="Кор счет"
					:value="corWallet"
					:error="errorEmpty(corWallet)"
					:disabled="isLoadingDataByBik"
					type="number"
					required
					:key="Fields.Bank.CORRESPONDENT_ACCOUNT"
					:id="Fields.Bank.CORRESPONDENT_ACCOUNT"
					@input:value="set('corWallet', $event)"
				/>
				<ui-input
					title="Расчетный счет"
					:value="wallet"
					:error="errorBankWallet(wallet)"
					v-mask="Validation.Mask.BANK_WALLET"
					type="number"
					required
					:key="Fields.Bank.BANK_ACCOUNT"
					:id="Fields.Bank.BANK_ACCOUNT"
					@input:value="set('wallet', $event)"
				/>
				<ui-input
					title="Наименование банка"
					:value="bankName"
					:error="errorEmpty(bankName)"
					:disabled="isLoadingDataByBik"
					required
					:key="Fields.Bank.BANK_INFO"
					:id="Fields.Bank.BANK_INFO"
					@input:value="set('bankName', $event)"
				/>
			</template>
			<ui-input
				title="Email страхователя"
				:value="email"
				:error="errorEmail(email)"
				required
				:key="Fields.Bank.EMAIL"
				:id="Fields.Bank.EMAIL"
				@input:value="set('email', $event)"
			/>
			<ui-input
				title="Телефон страхователя"
				:value="phone"
				:error="_errorPhone()"
				v-mask="maskPhone"
				required
				:key="Fields.Bank.PHONE"
				:id="Fields.Bank.PHONE"
				@input:value="set('phone', $event)"
			/>

			<ui-input
				title="Почтовый адрес"
				:value="postAddress"
				:error="errorEmpty(postAddress)"
				required
				:key="Fields.Bank.MAIL_ADDRESS"
				:id="Fields.Bank.MAIL_ADDRESS"
				v-if="type === Calculator.TypeEnum.KASCO"
				@input:value="set('postAddress', $event)"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Types
import type { PropType } from "@vue/runtime-core"
import {
	Calculator,
	CalculatorFields as Fields,
	Validation
} from "@common-repo/types/src"

// Hooks
import { useError, useStore } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store } = useStore(props.type)

// Data
const isLoadingDataByBik = ref<boolean>(false)

// Computed
const postAddress = computed((): string => getField("postAddress"))
const corWallet = computed((): string => getField("corWallet"))
const bankName = computed((): string => getField("bankName"))
const wallet = computed((): string => getField("wallet"))
const email = computed((): string => getField("email"))
const phone = computed((): string => getField("phone"))
const bik = computed((): string => getField("bik"))
const kpp = computed((): string => getField("kpp"))

const maskPhone = computed((): string => {
	const exclude: Calculator.Type[] = [
		Calculator.TypeEnum.BREAK,
		Calculator.TypeEnum.ECO
	]
	const isOld: boolean = exclude.includes(props.type)

	return isOld ? Validation.Mask.PHONE_OLD : Validation.Mask.PHONE
})

// Methods
const {
	errorBankWallet,
	errorEmail,
	errorEmpty,
	errorPhone,
	errorBic,
	errorKpp
} = useError()

function getField(fieldName: string): string {
	return store.getFieldRegistration("bank", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.REGISTRATION, "bank", fieldName, value)
}

function setBik(value: string): void {
	set("bik", value)

	fetchDataByBik(value)
}

function _errorPhone(): string {
	const oldCalculators: Calculator.Type[] = [
		Calculator.TypeEnum.BREAK,
		Calculator.TypeEnum.ECO
	]
	const isOld: boolean = oldCalculators.includes(props.type)

	return errorPhone(phone.value, isOld)
}

async function fetchDataByBik(value: string) {
	if (!errorBic(value)) {
		isLoadingDataByBik.value = true
		await store.fetchDataByBik(value)
		isLoadingDataByBik.value = false
	}
}
</script>
