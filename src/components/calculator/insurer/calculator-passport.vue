<template>
	<transition-group name="slide-fade-top">
		<calculator-block
			v-for="index in store.getPassportsLength"
			:key="`passport-${index}`"
			title="Паспортные данные"
			:description="description(index)"
			:loading="store.getIsLoading"
			:disabled="store.getIsDisabledFields"
			:isContent="isDetails(index)"
		>
			<template #header>
				<div class="calculator__passport-head">
					<transition name="fade-in-reverse">
						<ui-checkbox
							@change="setIsForeignValue($event, index)"
							:value="isForeign(index)"
							type="checkbox"
							v-if="isDetails(index)"
							:key="Fields.Passport.IS_FOREIGN"
							:id="Fields.Passport.IS_FOREIGN"
						>
							Иностранный гражданин
						</ui-checkbox>
					</transition>

					<button
						class="calculator__passport-delete"
						v-if="store.getPassportsLength > 1"
						:key="Fields.Passport.DELETE_PASSPORT"
						:id="Fields.Passport.DELETE_PASSPORT"
						@click="store.deletePassportByIndex(index - 1)"
					>
						<delete-outlined />
					</button>

					<button
						class="calculator__block-toggle"
						:class="{ _open: isDetails(index) }"
						@click="setOpenPassport(index)"
					>
						<down-outlined />
					</button>
				</div>
			</template>

			<transition name="slide-fade-top">
				<div class="calculator__passport" v-if="isDetails(index)">
					<ui-input
						title="ФИО"
						:value="fullName(index)"
						:error="errorEmpty(fullName(index))"
						:required="isRequiredPassportFullName"
						:key="Fields.Passport.PERSON_NAME"
						:id="Fields.Passport.PERSON_NAME"
						@input:value="set('fullName', $event, index)"
					/>
					<ui-input
						title="ИНН"
						:value="personInn(index)"
						:error="errorInn(personInn(index))"
						v-mask="[Validation.Mask.INN_SHORT, Validation.Mask.INN_LONG]"
						:key="Fields.Passport.PERSON_INN"
						:id="Fields.Passport.PERSON_INN"
						@input:value="set('personInn', $event, index)"
					/>
					<ui-input
						title="Серия / Номер"
						:value="series(index)"
						:error="errorEmpty(series(index))"
						:required="isRequiredPassportSeries"
						v-mask="Validation.Mask.PASSPORT"
						:key="Fields.Passport.PERSON_PASSPORT_SERIA_NUMBER"
						:id="Fields.Passport.PERSON_PASSPORT_SERIA_NUMBER"
						@input:value="set('series', $event, index)"
					/>
					<ui-date-picker
						title="Дата рождения"
						:value="dob(index)"
						:error="errorEmpty(dob(index))"
						:required="isRequiredPassportDob"
						:disabledDate="afterTodayDisabled"
						:key="Fields.Passport.PERSON_BIRTHDAY"
						:id="Fields.Passport.PERSON_BIRTHDAY"
						@change="set('dob', $event, index)"
					/>
					<ui-input
						title="Код подразделения"
						v-if="!isForeign(index)"
						:value="code(index)"
						:error="errorPassportCode(code(index))"
						v-mask="Validation.Mask.PASSPORT_CODE"
						:key="Fields.Passport.PERSON_PASSPORT_DIVISION_CODE"
						:id="Fields.Passport.PERSON_PASSPORT_DIVISION_CODE"
						@input:value="set('code', $event, index)"
					/>
					<ui-date-picker
						v-else
						title="Срок действия по"
						:value="foreignPersonPassportDateTo(index)"
						:error="errorEmpty(foreignPersonPassportDateTo(index))"
						:key="Fields.Signatory.SIGNING_PERSON_PASSPORT_DATE_TO"
						:id="Fields.Signatory.SIGNING_PERSON_PASSPORT_DATE_TO"
						:required="isRequiredPersonPassportDateTo"
						@change="set('foreignPersonPassportDateTo', $event, index)"
					/>
					<ui-date-picker
						title="Дата выдачи паспорта"
						:value="dateOfIssue(index)"
						:error="errorEmpty(dateOfIssue(index))"
						:required="isRequiredPassportDateOfIssue"
						:disabledDate="afterTodayDisabled"
						:key="Fields.Passport.PERSON_PASSPORT_DATE"
						:id="Fields.Passport.PERSON_PASSPORT_DATE"
						@change="set('dateOfIssue', $event, index)"
					/>
					<ui-input
						class="calculator__passport-long"
						title="Кем выдан"
						:value="passportOffice(index)"
						:error="errorEmpty(passportOffice(index))"
						:required="!isForeign(index) && isRequiredPassportOffice"
						:key="Fields.Passport.PERSON_PASSPORT_OFFICE"
						:id="Fields.Passport.PERSON_PASSPORT_OFFICE"
						@input:value="set('passportOffice', $event, index)"
					/>
					<ui-input
						title="Место рождения"
						:value="placeOfBirth(index)"
						:error="errorEmpty(placeOfBirth(index))"
						:key="Fields.Passport.ADDRESS_VALUE"
						:id="Fields.Passport.ADDRESS_VALUE"
						@input:value="set('placeOfBirth', $event, index)"
					/>
					<transition name="slide-fade-top">
						<ui-input
							title="Гражданство"
							v-if="isForeign(index) && !citizenshipOptions.length"
							:value="store.getFieldForeigner('citizenship')"
							:error="errorEmpty(store.getFieldForeigner('citizenship'))"
							:key="Fields.Passport.CITIZENSHIP"
							:id="Fields.Passport.CITIZENSHIP"
							:required="isRequiredCitizenship"
							@input:value="
								store.setForeignerData('citizenship', $event, index - 1)
							"
						/>
					</transition>
					<transition name="slide-fade-top">
						<ui-select
							title="Гражданство"
							v-if="isForeign(index) && citizenshipOptions.length"
							:options="citizenshipOptions"
							:value="store.getFieldForeigner('citizenship')"
							:error="errorEmpty(store.getFieldForeigner('citizenship'))"
							:key="Fields.Passport.CITIZENSHIP"
							:id="Fields.Passport.CITIZENSHIP"
							:required="isRequiredCitizenship"
							@change="store.setForeignerData('citizenship', $event, index)"
						/>
					</transition>
				</div>
			</transition>

			<transition name="slide-fade-top">
				<calculator-foreigner
					v-if="isForeign(index)"
					:type="type"
					:index="index"
				/>
			</transition>
		</calculator-block>
	</transition-group>
	<button
		class="calculator__passport-add"
		v-if="canAddPassport"
		:key="Fields.Passport.ADD_PASSPORT"
		:id="Fields.Passport.ADD_PASSPORT"
		@click="store.addPassport"
	>
		<plus-circle-two-tone twoToneColor="#00A421" />
		<span>Добавить генерального директора</span>
	</button>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { calculatorAddress, calculatorForeigner } from "./"
import {
	PlusCircleTwoTone,
	DownOutlined,
	DeleteOutlined
} from "@ant-design/icons-vue"

// Types
import type { PropType } from "@vue/runtime-core"
import type { UiSelect } from "~/types"
import {
	CalculatorFields as Fields,
	Calculator,
	Validation,
	Info
} from "@common-repo/types/src"

// Hooks
import { useCalculatorRequired, useStore, useError, useFields } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Data
const openPassports = reactive<number[]>([1])

// Store
const { store, infoStore, isCompany } = useStore(props.type)

// Methods
const { errorEmpty, errorInn, errorPassportCode } = useError()
const { afterTodayDisabled } = useFields()

function getField<T = string>(fieldName: string, index: number = 1): T {
	return store.getFieldPassport(fieldName, index - 1)
}

function setOpenPassport(index: number): void {
	const indexOfOpenArray = openPassports.findIndex(
		(item: number) => item === index
	)

	if (indexOfOpenArray > -1) {
		openPassports.splice(indexOfOpenArray, 1)
	} else {
		openPassports.push(index)
	}
}

function isDetails(index: number): boolean {
	return openPassports.includes(index)
}

function set(fieldName: string, value: any, index: number = 0): void {
	store.setPassportData(fieldName, value, index - 1)
}

function description(index: number): string {
	const companyTitle =
		store.getPassportsLength > 1
			? `Данные о генеральном директоре №${index}`
			: "Данные о генеральном директоре"

	return isCompany.value ? companyTitle : ""
}

function setIsForeignValue(value: boolean, index: number): void {
	set("isForeign", value, index)

	if (!value) {
		store.resetForeignerData(index - 1)
	}
}

// Computed
const {
	isRequiredPersonPassportDateTo,
	isRequiredPassportDateOfIssue,
	isRequiredPassportFullName,
	isRequiredPassportOffice,
	isRequiredPassportSeries,
	isRequiredPassportDob,
	isRequiredCitizenship
} = useCalculatorRequired(props.type)

const citizenshipOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.COUNTRY_CATALOG)
})

const canAddPassport = computed(() => {
	return isCompany.value && !store.getIsSended
})

const isForeign = (index: number) => getField<boolean>("isForeign", index)
const fullName = (index: number) => getField("fullName", index)
const personInn = (index: number) => getField("personInn", index)
const series = (index: number) => getField("series", index)
const dob = (index: number) => getField("dob", index)
const code = (index: number) => getField("code", index)
const dateOfIssue = (index: number) => getField("dateOfIssue", index)
const passportOffice = (index: number) => getField("passportOffice", index)
const placeOfBirth = (index: number) => getField("placeOfBirth", index)
const foreignPersonPassportDateTo = (index: number) =>
	getField("foreignPersonPassportDateTo", index)

onMounted(() => {
	if (props.type === Calculator.TypeEnum.CYBER) {
		infoStore.fetchCountryCatalog(props.type)
	}
})
</script>
