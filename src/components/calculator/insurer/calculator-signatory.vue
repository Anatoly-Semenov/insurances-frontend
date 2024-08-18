<template>
	<calculator-block
		title="Подписант"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__signatory">
			<template v-if="isSignatoryList">
				<div class="calculator__signatory-passport">
					<ui-select
						title="Выбрать из генеральных деректоров"
						:options="signatoryOptions"
						:value="activeSignatory"
						required
						@change="setSignatory"
					/>

					<div class="calculator__signatory-fields" v-if="isCustomSignatory">
						<ui-input
							title="ФИО"
							:value="fullName"
							:error="errorEmpty(fullName)"
							required
							:key="Fields.Signatory.SIGNING_PERSON_NAME"
							:id="Fields.Signatory.SIGNING_PERSON_NAME"
							@input:value="setFullName"
						/>
						<ui-input
							title="ИНН"
							:value="personInn"
							:error="errorInn(personInn)"
							v-mask="[Validation.Mask.INN_SHORT, Validation.Mask.INN_LONG]"
							:key="Fields.Signatory.SIGNING_PERSON_INN"
							:id="Fields.Signatory.SIGNING_PERSON_INN"
							@input:value="set('personInn', $event)"
						/>
						<ui-input
							title="Серия / Номер"
							:value="series"
							:error="errorEmpty(series)"
							v-mask="Validation.Mask.PASSPORT"
							:key="Fields.Signatory.SIGNING_PERSON_PASSPORT_SERIA_NUMBER"
							:id="Fields.Signatory.SIGNING_PERSON_PASSPORT_SERIA_NUMBER"
							@input:value="set('series', $event)"
						/>
						<ui-date-picker
							title="Дата рождения"
							:value="dob"
							:error="errorEmpty(dob)"
							:disabledDate="afterTodayDisabled"
							:key="Fields.Signatory.SIGNING_PERSON_BIRTHDAY"
							:id="Fields.Signatory.SIGNING_PERSON_BIRTHDAY"
							@change="set('dob', $event)"
						/>
						<!--			TODO: temporary hide			-->
						<ui-input
							title="Код подразделения"
							v-if="false"
							:value="code"
							:error="errorPassportCode(code)"
							v-mask="Validation.Mask.PASSPORT_CODE"
							:key="Fields.Signatory.SIGNING_PERSON_PASSPORT_DIVISION_CODE"
							:id="Fields.Signatory.SIGNING_PERSON_PASSPORT_DIVISION_CODE"
							@input:value="set('code', $event)"
						/>
						<ui-date-picker
							v-else
							title="Срок действия по"
							:value="validityPeriodEnd"
							:error="errorEmpty(validityPeriodEnd)"
							:key="Fields.Signatory.SIGNING_PERSON_PASSPORT_DATE_TO"
							:id="Fields.Signatory.SIGNING_PERSON_PASSPORT_DATE_TO"
							@change="set('validityPeriodEnd', $event)"
						/>
						<ui-date-picker
							title="Дата выдачи паспорта"
							:value="dateOfIssue"
							:error="errorEmpty(dateOfIssue)"
							:disabledDate="afterTodayDisabled"
							:key="Fields.Signatory.SIGNING_PERSON_PASSPORT_DATE"
							:id="Fields.Signatory.SIGNING_PERSON_PASSPORT_DATE"
							@change="set('dateOfIssue', $event)"
						/>
						<ui-input
							class="calculator__passport-long"
							title="Кем выдан"
							:value="passportOffice"
							:error="errorEmpty(passportOffice)"
							:key="Fields.Signatory.SIGNING_PERSON_PASSPORT_OFFICE"
							:id="Fields.Signatory.SIGNING_PERSON_PASSPORT_OFFICE"
							@input:value="set('passportOffice', $event)"
						/>
						<ui-input
							title="Место рождения"
							:value="placeOfBirth"
							:error="errorEmpty(placeOfBirth)"
							:key="Fields.Address.ADDRESS_VALUE"
							:id="Fields.Address.ADDRESS_VALUE"
							@input:value="set('placeOfBirth', $event)"
						/>
						<calculator-address :type="type" block="signatory" />
						<ui-checkbox
							@change="set('isManualAddress', $event)"
							:value="isManualAddress"
							:key="Fields.Passport.IS_FILL_BY_FIELDS"
							:id="Fields.Passport.IS_FILL_BY_FIELDS"
							type="switch"
						>
							Заполнить по полям
						</ui-checkbox>
					</div>
				</div>
			</template>
			<div
				class="calculator__signatory-additional"
				v-if="isSignatoryAdditional"
			>
				<ui-input
					title="Подписант страхователя"
					:value="signatory"
					:error="errorEmpty(signatory)"
					:required="isRequiredSignatory"
					:key="Fields.Signatory.SIGNATORY_ID_SELECTED"
					:id="Fields.Signatory.SIGNATORY_ID_SELECTED"
					@input:value="set('signatory', $event)"
				/>
				<ui-input
					class="calculator__signatory-long"
					title="Подписант страхователя в родительном падеже"
					:value="signatoryGenitive"
					:error="errorEmpty(signatoryGenitive)"
					:required="isRequiredSignatoryGenitive"
					:key="Fields.Signatory.SIGNATORY_GENITIVE"
					:id="Fields.Signatory.SIGNATORY_GENITIVE"
					@input:value="set('signatoryGenitive', $event)"
				/>
				<ui-input
					title="Должность подписанта страхователя"
					:value="position"
					:error="errorEmpty(position)"
					:required="isRequiredPosition"
					:key="Fields.Signatory.POSITION"
					:id="Fields.Signatory.POSITION"
					@input:value="set('position', $event)"
				/>
				<ui-input
					class="calculator__signatory-long"
					title="Должность подписанта страхователя в родительном падеже"
					:value="positionGenitive"
					:error="errorEmpty(positionGenitive)"
					:required="isRequiredPositionGenitive"
					:key="Fields.Signatory.POSITION_GENETIVE"
					:id="Fields.Signatory.POSITION_GENETIVE"
					@input:value="set('positionGenitive', $event)"
				/>
				<ui-select
					title="На основании"
					:options="basedOptions"
					:value="based"
					:error="errorEmpty(based)"
					:showSearch="false"
					:required="isRequiredBased"
					:key="Fields.Signatory.REASON"
					:id="Fields.Signatory.REASON"
					@change="setBased"
				/>
				<transition-group
					class="calculator__signatory-reason"
					name="slide-fade-top"
					tag="div"
				>
					<template v-if="isReasonDocument">
						<ui-input
							title="Документ основание"
							:value="reasonDocument"
							:error="errorEmpty(reasonDocument)"
							key="reasonDocument"
							:required="isRequiredReasonDocument"
							:key="Fields.Signatory.REASON_DOCUMENT"
							:id="Fields.Signatory.REASON_DOCUMENT"
							@input:value="set('reasonDocument', $event)"
						/>
						<ui-date-picker
							title="Дата выдачи"
							:value="reasonDate"
							key="reasonDate"
							:required="isRequiredReasonDate"
							:key="Fields.Signatory.REASON_DATE"
							:id="Fields.Signatory.REASON_DATE"
							@change="set('reasonDate', $event)"
						/>
					</template>
				</transition-group>
			</div>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { calculatorAddress } from "./"

// Hooks
import { useCalculatorRequired, useError, useStore, useFields } from "~/hooks"

// Types
import type { UiSelect } from "~/types"
import type { PropType } from "@vue/runtime-core"
import type { StatePassport } from "~/store/base-calculator"
import {
	CalculatorFields as Fields,
	CalculatorSignatory,
	Calculator,
	Validation,
	Info
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

function getField(fieldName: string): string {
	return store.getFieldInsurer("signatory", fieldName)
}

// Data
const activeSignatory = ref<number>(0)

// Computed
const directorsPassportName = computed((): string[] => {
	return store.getPassports.map(({ fullName }: StatePassport) => fullName)
})

const isReasonDocument = computed(() => {
	const isReasonRu: boolean =
		based.value === CalculatorSignatory.ReasonRu.POWER_OF_ATTORNEY ||
		based.value === CalculatorSignatory.ReasonRu.OTHER

	const isReasonEng: boolean =
		based.value === CalculatorSignatory.ReasonEng.POWER_OF_ATTORNEY ||
		based.value === CalculatorSignatory.ReasonEng.OTHER

	return isBasedEng.value ? isReasonEng : isReasonRu
})

const signatoryOptions = computed((): UiSelect.Options => {
	const options: UiSelect.Options = [
		{
			value: 0,
			label: "Подписант не является генеральным директором"
		}
	]

	if (directorsPassportName?.value) {
		directorsPassportName?.value.forEach((name: string, index) => {
			options.push({
				value: index + 1,
				label: name
			})
		})
	}

	return options
})

const isBasedEng = computed((): boolean => {
	const engCalculators: Calculator.Type[] = [
		Calculator.TypeEnum.KASCO,
		Calculator.TypeEnum.CASH,
		Calculator.TypeEnum.SMR,
		Calculator.TypeEnum.ECO
	]

	return engCalculators.includes(props.type)
})

const basedOptions = computed((): UiSelect.Options => {
	const optionsRus = infoStore.getInfo(Info.InfoTypeStatic.BASED, "static")
	const optionsEng = infoStore.getInfo(Info.InfoTypeStatic.BASED_ENG, "static")

	return isBasedEng.value ? optionsEng : optionsRus
})

const {
	isRequiredSignatoryGenitive,
	isRequiredPositionGenitive,
	isRequiredReasonDocument,
	isRequiredReasonDate,
	isRequiredSignatory,
	isRequiredPosition,
	isRequiredBased
} = useCalculatorRequired(props.type)

const companyType = computed((): Info.CompanyType => {
	return store.getFieldInsurer("main", "companyType")
})

const validityPeriodEnd = computed(() => getField("validityPeriodEnd"))
const signatoryGenitive = computed(() => getField("signatoryGenitive"))
const positionGenitive = computed(() => getField("positionGenitive"))
const isManualAddress = computed(() => getField("isManualAddress"))
const reasonDocument = computed(() => getField("reasonDocument"))
const passportOffice = computed(() => getField("passportOffice"))
const placeOfBirth = computed(() => getField("placeOfBirth"))
const dateOfIssue = computed(() => getField("dateOfIssue"))
const reasonDate = computed(() => getField("reasonDate"))
const personInn = computed(() => getField("personInn"))
const signatory = computed(() => getField("signatory"))
const fullName = computed(() => getField("fullName"))
const position = computed(() => getField("position"))
const series = computed(() => getField("series"))
const based = computed(() => getField("based"))
const code = computed(() => getField("code"))
const dob = computed(() => getField("dob"))

const isCustomSignatory = computed((): boolean => {
	const indexOfOption: number = signatoryOptions.value.findIndex(
		({ label }) => label === signatory.value
	)

	return indexOfOption === -1
})

const isSignatoryList = computed((): boolean => {
	return props.type !== Calculator.TypeEnum.CYBER
})

const isSignatoryAdditional = computed((): boolean => {
	const availableCalculators: Calculator.Type[] = [
		Calculator.TypeEnum.ECO,
		Calculator.TypeEnum.SMR,
		Calculator.TypeEnum.KASCO,
		Calculator.TypeEnum.CYBER,
		Calculator.TypeEnum.SPECTECH,
		Calculator.TypeEnum.OSAGO_SPECTECH
	]

	return availableCalculators.includes(props.type)
})

// Methods
const { afterTodayDisabled } = useFields()
const { errorEmpty, errorInn, errorPassportCode } = useError()

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.INSURER, "signatory", fieldName, value)
}

function resetReason() {
	set("reasonDocument", "")
	set("reasonDate", "")
}

function setBased(value: string): void {
	set("based", value)
	resetReason()
}

function setBasedByCompanyType(): void {
	const reasonName = isBasedEng.value ? "ReasonEng" : "ReasonRu"

	if (!based.value) {
		if (companyType.value === Info.CompanyType.IP) {
			set("based", CalculatorSignatory[reasonName].OTHER)
		} else {
			set("based", CalculatorSignatory[reasonName].CHARTER)
		}
	}
}

function setSignatory(value: number): void {
	activeSignatory.value = value

	const name: string = value
		? signatoryOptions.value.find((option) => option.value === value)!.label
		: ""

	store.setActiveSignatoryName(name)
}

function setActiveSignatory(): void {
	if (props.type !== Calculator.TypeEnum.CYBER) {
		if (!signatory.value) {
			activeSignatory.value = 0
		} else {
			const activeOption: UiSelect.Option = signatoryOptions.value.find(
				({ label }) => label === signatory.value
			)!

			if (activeOption) activeSignatory.value = activeOption.value as number
		}
	}
}

function setFullName(value: string): void {
	set("fullName", value)
	set("signatory", value)
}

onMounted(() => {
	setBasedByCompanyType()
})

watchEffect(() => {
	setBasedByCompanyType()

	setActiveSignatory()
})
</script>
