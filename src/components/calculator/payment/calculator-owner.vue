<template>
	<calculator-block
		title="Собственник"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<template #header>
			<ui-button
				size="small"
				type="link"
				@click="$toLink(intelligence.link)"
				:id="Calculator.Id.Button.EGRUL"
			>
				{{ intelligence.text }}
			</ui-button>
		</template>

		<div class="calculator__owner" v-if="isDisplayFields">
			<ui-checkbox
				type="checkbox"
				class="calculator__owner-switch"
				:value="isDifferent"
				:id="Fields.Owner.IS_DIFFERENT"
				:key="Fields.Owner.IS_DIFFERENT"
				@change="set('isDifferent', $event)"
			>
				Собственник отличается от Страхователя (только для Страхование)
			</ui-checkbox>
			<transition name="fade-in">
				<div class="calculator__owner-wrap" v-if="isDifferent">
					<ui-select
						title="Собственник"
						:options="companyTypeOptions"
						:value="companyType"
						:id="Fields.Owner.COMPANY_TYPE"
						:key="Fields.Owner.COMPANY_TYPE"
						required
						@change="set('companyType', $event)"
					/>
					<ui-select
						title="Документ собственника"
						:options="documentTypeOptions"
						:value="documentType"
						:id="Fields.Owner.DOCUMENT_TYPE"
						:key="Fields.Owner.DOCUMENT_TYPE"
						required
						@change="set('documentType', $event)"
					/>
					<ui-input
						title="ИНН Собственника"
						:value="inn"
						:error="errorEmpty(inn)"
						:loading="isLoadingFields"
						v-mask="[Validation.Mask.INN_SHORT, Validation.Mask.INN_LONG]"
						:id="Fields.Owner.INN"
						:key="Fields.Owner.INN"
						required
						@input:value="setInn"
					/>
					<ui-input
						title="Номер документа Собственника"
						:value="documentNumber"
						:error="errorEmpty(documentNumber)"
						:loading="isLoadingFields"
						:id="Fields.Owner.DOCUMENT_NUMBER"
						:key="Fields.Owner.DOCUMENT_NUMBER"
						required
						@input:value="set('documentNumber', $event)"
					/>
					<ui-input
						title="Название компании-собственника"
						:value="companyName"
						:error="errorEmpty(companyName)"
						:loading="isLoadingFields"
						:id="Fields.Owner.COMPANY_NAME"
						:key="Fields.Owner.COMPANY_NAME"
						required
						disabled
						@input:value="set('companyName', $event)"
					/>
					<ui-date-picker
						title="Дата выдачи документа Собственника"
						:value="documentIssueDate"
						:error="errorEmpty(documentIssueDate)"
						:disabledDate="afterTodayDisabled"
						required
						:id="Fields.Owner.DOCUMENT_ISSUE_DATE"
						:key="Fields.Owner.DOCUMENT_ISSUE_DATE"
						@change="set('documentIssueDate', $event)"
					/>
				</div>
			</transition>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError, useFields } from "~/hooks"

// Types
import { PropType } from "@vue/runtime-core"
import type { UiSelect } from "~/types"
import {
	CalculatorFields as Fields,
	Calculator,
	Validation,
	Info
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.KASCO
	}
})

// Store
const { store } = useStore(props.type)

// Computed
const isDisplayFields = computed((): boolean => {
	return props.type === types.KASCO || props.type === types.OSAGO_SPECTECH
})

const isOsagoSpectech = computed((): boolean => {
	return props.type === Calculator.TypeEnum.OSAGO_SPECTECH
})

const documentIssueDate = computed(() => getField<string>("documentIssueDate"))
const companyType = computed(() => getField<Info.CompanyType>("companyType"))
const documentNumber = computed(() => getField<string>("documentNumber"))
const isDifferent = computed(() => getField<boolean>("isDifferent"))
const companyName = computed(() => getField<string>("companyName"))
const inn = computed(() => getField<string>("inn"))
const documentType = computed(() => {
	const value = getField<string>("documentType")

	return isOsagoSpectech.value ? +value : value
})

const isDisabledFetchDataByInn = computed((): boolean => {
	return !!errorInn(inn.value, Info.CompanyType.COMPANY)
})

// Data
const types = Calculator.TypeEnum

const isLoadingFields = ref<boolean>(false)

const companyTypeOptions: UiSelect.Option[] = [
	{
		label: "Юридическое лицо",
		value: Info.CompanyType.COMPANY
	}
]

const documentTypeOptions: UiSelect.Option[] = [
	{
		label:
			"Выписка из единого государственного реестра юридических лиц (ЕГРЮЛ)",
		value: isOsagoSpectech.value
			? 4
			: "Выписка из единого государственного реестра юридических лиц (ЕГРЮЛ)"
	}
]

const intelligence = {
	text: "Сведения из ЕГРЮЛ/ЕГРИП в электронном виде",
	link: "https://egrul.nalog.ru/index.html"
}

// Methods
const { $toLink } = useNuxtApp()
const { afterTodayDisabled } = useFields()
const { errorEmpty, errorInn } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "owner", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "owner", fieldName, value)
}

function setInn(value: string): void {
	const error = errorInn(value, companyType.value)

	set("inn", value)

	if (!error) fetchDataByInn(value)
}

async function fetchDataByInn(value: string): Promise<void> {
	if (!isDisabledFetchDataByInn.value && !isLoadingFields.value) {
		isLoadingFields.value = true
		await store.fetchOwnerByInn(value)
		isLoadingFields.value = false
	}
}

watch(
	() => isDifferent.value,
	(newValue: boolean, oldValue: boolean) => {
		if (!oldValue && newValue) {
			setInn(inn.value)
		}
	}
)
</script>
