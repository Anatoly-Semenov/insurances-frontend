<template>
	<calculator-block
		title="Страхователь и клиентский сегмент"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<template #header>
			<transition name="fade-in">
				<ui-button
					v-if="store.getHaveCompanyType && !store.getIsSended"
					size="small"
					type="default"
					:disabled="isDisabledFetchDataByInn"
					:loading="store.isLoadingDataByInn"
					:id="Calculator.Id.Button.GET_DATA_BY_INN"
					:key="Calculator.Id.Button.GET_DATA_BY_INN"
					@click="fetchDataByInn"
				>
					Получить данные по ИНН
				</ui-button>
			</transition>
		</template>

		<div class="calculator__insurer" :class="{ _company: isCompany }">
			<ui-select
				title="Лицо"
				:options="companyTypes"
				:value="companyType"
				:error="errorEmpty(companyType)"
				:showSearch="false"
				required
				:key="Fields.Insurer.INSURED"
				:id="Fields.Insurer.INSURED"
				@change="changeCompanyType"
			/>
			<transition-group name="fade-in">
				<template v-if="store.getHaveCompanyType">
					<ui-input
						title="ИНН"
						:value="companyInn"
						:error="errorInnMessage"
						v-mask="Validation.Mask.INN_LONG"
						required
						:key="Fields.Insurer.INN"
						:id="Fields.Insurer.INN"
						@input:value="changeInn"
					/>

					<ui-input
						title="Название компании"
						:value="companyName"
						:error="errorEmpty(companyName)"
						:required="isRequiredCompanyName"
						disabled
						:key="Fields.Insurer.COMPANY_FULL_NAME"
						:id="Fields.Insurer.COMPANY_FULL_NAME"
						@input:value="set('companyName', $event)"
					/>

					<ui-input
						title="Сокращенное наименование компании"
						:value="companyShortName"
						:error="errorEmpty(companyShortName)"
						disabled
						:required="isRequiredCompanyShortName"
						:key="Fields.Insurer.COMPANY_NAME"
						:id="Fields.Insurer.COMPANY_NAME"
						@input:value="set('companyShortName', $event)"
					/>

					<template v-if="isCompany">
						<ui-input
							title="КПП"
							:value="kpp"
							:error="errorKpp(kpp)"
							v-mask="Validation.Mask.KPP"
							:required="isRequiredKpp"
							:key="Fields.Insurer.KPP"
							:id="Fields.Insurer.KPP"
							@input:value="setKpp"
						/>

						<ui-date-picker
							title="Дата регистрации"
							:value="regDate"
							:required="isRequiredRegDate"
							disabled
							:key="Fields.Insurer.REG_DATE"
							:id="Fields.Insurer.REG_DATE"
							@change="set('regDate', $event)"
						/>

						<ui-input
							title="ИФНС"
							:value="ifns"
							:error="errorEmpty(ifns)"
							:required="isRequiredIfns"
							disabled
							:key="Fields.Insurer.IFNS"
							:id="Fields.Insurer.IFNS"
							@input:value="set('ifns', $event)"
						/>

						<ui-input
							title="ОКВЭД"
							:value="okved"
							:error="errorEmpty(okved)"
							:required="isRequiredOkved"
							disabled
							:key="Fields.Insurer.OKVED"
							:id="Fields.Insurer.OKVED"
							@input:value="set('okved', $event)"
						/>
					</template>

					<ui-input
						title="ОГРН"
						:value="ogrn"
						:error="errorOgrn(ogrn)"
						:key="Fields.Insurer.OGRN"
						:id="Fields.Insurer.OGRN"
						disabled
						v-if="isDisplayOgrn"
						@input:value="set('ogrn', $event)"
					/>

					<ui-input
						title="КЛАДР"
						:value="kladr"
						:error="errorEmpty(kladr)"
						:key="Fields.Insurer.COMPANY_ADDRESS_KLADR"
						:id="Fields.Insurer.COMPANY_ADDRESS_KLADR"
						disabled
						v-if="isDisplayKladr"
						@input:value="set('kladr', $event)"
					/>

					<ui-input
						title="ОКПО"
						:value="okpo"
						:error="errorEmpty(okpo)"
						:key="Fields.Insurer.okpo"
						:id="Fields.Insurer.okpo"
						v-if="isDisplayOkpo"
						disabled
						@input:value="set('okpo', $event)"
					/>

					<ui-input
						title="ОКОНХ"
						:value="okonx"
						:error="errorEmpty(okonx)"
						:key="Fields.Insurer.OKONX"
						:id="Fields.Insurer.OKONX"
						v-if="isDisplayOkonx"
						@input:value="set('okonx', $event)"
					/>
				</template>
			</transition-group>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
import { useEventBus } from "@vueuse/core"

// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import {
	useStore,
	useError,
	useCalculatorRequired,
	useCalculatorPayment
} from "~/hooks"

// Events
import { getDataByInn } from "~/events"

// Types
import type { PropType } from "@vue/runtime-core"
import type { UiSelect } from "~/types"
import {
	Calculator,
	CalculatorFields as Fields,
	Info,
	Validation
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore, isCompany } = useStore(props.type)

// Data
const types = Calculator.TypeEnum

function getField<T = string>(fieldName: string): T {
	return store.getFieldInsurer<T>("main", fieldName)
}

// Computed
const companyType = computed(
	(): Info.CompanyType => getField<Info.CompanyType>("companyType")
)
const companyShortName = computed(() => getField<string>("companyShortName"))
const companyName = computed(() => getField<string>("companyName"))
const companyInn = computed(() => getField<string>("companyInn"))
const regDate = computed(() => getField<string>("regDate"))
const okved = computed(() => getField<string>("okved"))
const kladr = computed(() => getField<string>("kladr"))
const okonx = computed(() => getField<string>("okonx"))
const ifns = computed(() => getField<string>("ifns"))
const ogrn = computed(() => getField<string>("ogrn"))
const okpo = computed(() => getField<string>("okpo"))
const kpp = computed(() => getField<string>("kpp"))
const addressRegistrationIp = computed(() =>
	getField<string>("addressRegistrationIp")
)

const isDisplayOgrn = computed((): boolean => {
	return props.type !== types.CYBER
})

const isDisplayKladr = computed((): boolean => {
	const calculators: Calculator.Type[] = [types.ASSET, types.KASCO, types.MOTOR]

	return calculators.includes(props.type)
})

const isDisplayOkpo = computed((): boolean => {
	const calculators: Calculator.Type[] = [
		types.ASSET,
		types.KASCO,
		types.MOTOR,
		types.SMR
	]

	return calculators.includes(props.type)
})

const isDisplayOkonx = computed((): boolean => {
	const calculators: Calculator.Type[] = [types.ASSET, types.KASCO, types.SMR]

	return calculators.includes(props.type)
})

const {
	isRequiredCompanyShortName,
	isRequiredCompanyName,
	isRequiredRegDate,
	isRequiredOkved,
	isRequiredOgrn,
	isRequiredIfns,
	isRequiredKpp
} = useCalculatorRequired(props.type)

const isDisabledFetchDataByInn = computed((): boolean => {
	return !!errorInnMessage.value
})

const companyTypes = computed((): UiSelect.Options => {
	const data = infoStore.getInfo(Info.InfoTypeStatic.COMPANY_TYPES, "static")

	data.splice(2, 1)

	return data
})

const errorInnMessage = computed((): string => {
	return errorInn(companyInn.value, companyType.value)
})

// Methods
const { errorInn, errorEmpty, errorOgrn, errorKpp } = useError()
const { preparePaymentData } = useCalculatorPayment(props.type)

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.INSURER, "main", fieldName, value)
}

function setKpp(value: string) {
	set("kpp", value)
	store.setData(Calculator.Tab.REGISTRATION, "bank", "kpp", value)
}

async function fetchDataByInn(): Promise<void> {
	if (!isDisabledFetchDataByInn.value && !store.isLoadingDataByInn) {
		await store.fetchDataByInn()
	}

	preparePaymentData()
}

function changeInn(value: Info.CompanyType): void {
	store.changeInn(value)

	if (!errorInnMessage.value) fetchDataByInn()
}

function changeCompanyType(value: Info.CompanyType): void {
	set("companyType", value)
	store.changeInn("")
}

const bus = useEventBus<string>(getDataByInn)

bus.on((event) => {
	fetchDataByInn()
})

onMounted(() => {
	infoStore.fetchInfo(Info.InfoType.CLIENT_TYPES)
})
</script>
