<template>
	<calculator-block
		title="Описание объекта страхования"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator-description-object">
			<img
				class="calculator-description-object__img"
				src="~/assets/img/smr.png"
				alt="car"
			/>

			<div class="calculator-description-object__checkboxes">
				<div
					v-for="({ value, label }, index) in checkboxesWithErrorMessages"
					:key="index + value"
				>
					<ui-alert
						v-if="label"
						:message="value"
						:type="Alert.Type.ERROR"
						showIcon
					/>
				</div>

				<ui-checkbox
					v-for="({ title, value, setKey, id }, index) in checkboxes"
					:key="index + title"
					:id="id"
					@change="set(setKey, $event)"
					:value="value"
					type="checkbox"
				>
					{{ title }}
				</ui-checkbox>

				<transition name="slide-fade-top">
					<ui-radio
						class="calculator-description-object__checkboxes-radio"
						type="button"
						:options="installmentOptions"
						:disabled="store.getIsLoading || store.getIsSended"
						:value="installmentType"
						:id="Fields.DescriptionObject.INSTALLMENT_TYPE"
						v-if="isInstallment"
						@change="set('installmentType', $event)"
					/>
				</transition>
			</div>
			<div class="calculator-description-object__fields">
				<component
					v-for="(
						{ title, options, value, setKey, component, info, mode, id }, index
					) in fields"
					:key="index + title"
					:id="id"
					:is="component"
					:displayInfoByFocus="!!info"
					:loading="isLoadingFields"
					:options="options"
					:title="title"
					:mode="mode"
					:info="info"
					:value="value"
					:error="errorField(value.value, setKey)"
					required
					@input:value="component === 'ui-input' && set(setKey, $event)"
					@change="component === 'ui-select' && set(setKey, $event)"
				/>
			</div>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError } from "~/hooks"

// Types
import { UiSelect as IUiSelect, UiAlert as Alert } from "~/types"
import { ComputedRef, PropType } from "@vue/runtime-core"
import type { UiRadio } from "~/types"
import {
	CalculatorFields as Fields,
	Calculator,
	Info
} from "@common-repo/types/src"

interface Field {
	title: string
	component?: string
	info?: string
	options?: ComputedRef<IUiSelect.Options>
	mode?: IUiSelect.Mode
	value: any
	setKey: string
	id: Fields.DescriptionObject
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum
const isLoadingFields = ref<boolean>(false)

const installmentOptions: UiRadio.Options = [
	{
		value: 1,
		label: "Платеж 50/50"
	},
	{
		value: 2,
		label: "Платеж 10/90"
	}
]

// Methods
const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "object", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "object", fieldName, value)
}

async function fetchInfoLists() {
	const infoList: Array<keyof typeof Info.InfoType> = [
		"LOAN_AGREEMENT_CATALOG",
		"CONTRACTOR_EXPERIENCE",
		"DYNAMIC_FRANCHISE",
		"GO_INSURANCE_SUM",
		"BANK_FINANCE",
		"WORK_TYPE",
		"REGIONS"
	]

	const promises: Promise<void>[] = []

	for (const info of infoList) {
		promises.push(infoStore.fetchInfo(Info.InfoType[info]))
	}

	await Promise.all(promises)
}

function errorField(value: string | number, fieldName: string): string {
	if (
		fieldName === "contractorExperience" &&
		store.getIsExpLessOneYear &&
		value === 1
	) {
		return "данный вариант не доступен"
	}

	return errorEmpty(value)
}

// Computed
const objectClientName = computed(() => getField<string>("objectClientName"))
const builderDocument = computed(() => getField<string>("builderDocument"))
const installmentType = computed(() => getField<string>("installmentType"))
const isInstallment = computed(() => getField<string>("isInstallment"))
const objectAddress = computed(() => getField<string>("objectAddress"))
const objectRegion = computed(() => getField<string>("objectRegion"))
const builderName = computed(() => getField<string>("builderName"))
const isWaterNear = computed(() => getField<string>("isWaterNear"))
const objectName = computed(() => getField<string>("objectName"))
const workTypes = computed(() => getField<string>("workTypes"))
const contractorExperience = computed(() =>
	getField<string>("contractorExperience")
)
const isBuildingAlmostDone = computed(() =>
	getField<boolean>("isBuildingAlmostDone")
)
const isExpLessOneYear = computed(() => getField<boolean>("isExpLessOneYear"))

const contractorExperienceOptions = computed((): IUiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.CONTRACTOR_EXPERIENCE)
})

const workTypeOptions = computed((): IUiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.WORK_TYPE)
})

const regionOptions = computed((): IUiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.REGIONS)
})

const checkboxesWithErrorMessages = computed((): IUiSelect.Options => {
	return [
		{
			label: isWaterNear.value,
			value:
				"Расчет недоступен для объектов с расстоянием до водоема менее 150м"
		},
		{
			label: isBuildingAlmostDone.value,
			value: "Расчет недоступен для объектов со степенью готовности более 70%"
		}
	]
})

const fields = computed((): Field[] => {
	return [
		{
			title:
				"Наименование объекта строительства в соответствии с договором подряда",
			component: "ui-input",
			value: objectName,
			setKey: "objectName",
			id: Fields.DescriptionObject.OBJECT_NAME
		},
		{
			title: "Наименование Заказчика",
			component: "ui-input",
			value: objectClientName,
			setKey: "objectClientName",
			id: Fields.DescriptionObject.OBJECT_CLIENT_NAME
		},
		{
			title: "Стаж осуществления СМР работ Подрядчиком/Генподрядчиком",
			component: "ui-select",
			options: contractorExperienceOptions,
			value: contractorExperience,
			setKey: "contractorExperience",
			id: Fields.DescriptionObject.CONTRACTOR_EXPERIE
		},
		{
			title: "Вид строительно-монтажных работ по строительству",
			component: "ui-select",
			options: workTypeOptions,
			mode: IUiSelect.Mode.MULTIPLE,
			value: workTypes,
			setKey: "workTypes",
			id: Fields.DescriptionObject.WORK_TYPES
		},
		{
			title: "Наименование Подрядчика/Генподрядчика",
			component: "ui-input",
			value: builderName,
			setKey: "builderName",
			id: Fields.DescriptionObject.BUILDER_NAME
		},
		{
			title: "Наименование, номер и дата договора Подрядчика/Генподрядчика",
			info: "Необходимо внести точное наименование документа в формате 'Договором подряда N°XX от DD.MM.YYYY",
			component: "ui-input",
			value: builderDocument,
			setKey: "builderDocument",
			id: Fields.DescriptionObject.BUILDER_DOCUMENT
		},
		{
			title: "Субъект Российской Федерации",
			component: "ui-select",
			options: regionOptions,
			value: objectRegion,
			setKey: "objectRegion",
			id: Fields.DescriptionObject.OBJECT_REGION
		},
		{
			title: "Населенный пункт, улица, кадастровый номер, GPS координаты",
			component: "ui-input",
			value: objectAddress,
			setKey: "objectAddress",
			id: Fields.DescriptionObject.OBJECT_ADDRESS
		}
	]
})

const checkboxes = computed((): Field[] => {
	return [
		{
			title: "Расстояние до водоема менее 150м",
			value: isWaterNear,
			setKey: "isWaterNear",
			id: Fields.DescriptionObject.IS_WATER_NEAR
		},
		{
			title: "Степень готовности объекта более 70%",
			value: isBuildingAlmostDone,
			setKey: "isBuildingAlmostDone",
			id: Fields.DescriptionObject.IS_BUILDING_ALMOST_DONE
		},
		{
			title:
				"Доступно страхование, если cтаж SPV-компании менее года, но при этом стаж подрядчика более года",
			value: isExpLessOneYear,
			setKey: "isExpLessOneYear",
			id: Fields.DescriptionObject.IS_EXP_LESS_ONE_YEAR
		},
		{
			title: "Рассрочка на 2 платежа",
			value: isInstallment,
			setKey: "isInstallment",
			id: Fields.DescriptionObject.IS_INSTALLMENT
		}
	]
})

onMounted(() => {
	fetchInfoLists()
})
</script>
