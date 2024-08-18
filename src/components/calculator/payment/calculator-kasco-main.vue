<template>
	<calculator-block
		:title="title"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<template #header>
			<transition name="fade-in">
				<ui-button
					v-if="!isOsagoSpectech && !store.getIsSended"
					size="small"
					type="default"
					:loading="isLoadingDataByVin"
					:disabled="isDisabledFetchDataByVin"
					:id="Calculator.Id.Button.GET_DATA_BY_VIN"
					:key="Calculator.Id.Button.GET_DATA_BY_VIN"
					@click="fetchAutoCodeData"
				>
					Обогатить данные автокодом
				</ui-button>
			</transition>
		</template>

		<div class="calculator-kasco__main">
			<div class="calculator-kasco__main-data">
				<img
					class="calculator-kasco__main-img"
					:class="{ _spectech: isOsagoSpectech }"
					:src="img"
					v-if="width > 960"
					alt="car"
				/>
				<div class="calculator-kasco__main-info">
					<template v-if="!isOsagoSpectech">
						<div class="calculator-kasco__main-row">
							<p class="calculator-kasco__main-subtitle">Тип руля</p>
							<ui-radio
								type="button"
								:value="steering"
								:options="steeringOptions"
								@change="set('steering', $event)"
							/>
						</div>

						<div class="calculator-kasco__main-empty" />
					</template>

					<ui-input
						class="calculator-kasco__main-uppercase"
						title="Регистрационный знак"
						:value="registrationNumber"
						:mask="registrationNumberMask"
						:id="Fields.Vehicle.REG_NUMBER"
						:key="Fields.Vehicle.REG_NUMBER"
						@input:value="set('registrationNumber', $event, false)"
					/>

					<ui-input
						title="Номер кузова"
						:value="bodyNumber"
						:id="Fields.Vehicle.BODY_NUMBER"
						:key="Fields.Vehicle.BODY_NUMBER"
						@input:value="set('bodyNumber', $event)"
						v-if="isOsagoSpectech"
					/>

					<ui-input
						title="Номер шасси"
						:value="chassis"
						:id="Fields.Vehicle.CHASSIS"
						:key="Fields.Vehicle.CHASSIS"
						@input:value="set('chassis', $event)"
						v-if="isOsagoSpectech"
					/>

					<ui-input
						title="Идентификационный номер (VIN)"
						:value="vin"
						:error="isOsagoSpectech ? null : errorVin(vin)"
						:mask="isOsagoSpectech ? null : Validation.Mask.VIN"
						:required="!isOsagoSpectech"
						:id="Fields.Vehicle.VIN"
						:key="Fields.Vehicle.VIN"
						@input:value="setVin"
						v-if="isVin"
					/>
					<ui-input
						title="Номер шасси"
						:value="chassis"
						:error="
							isOsagoSpectech ? errorEmpty(chassis) : errorChassis(chassis)
						"
						:mask="chassisMask"
						:required="!isOsagoSpectech"
						:id="Fields.Vehicle.CHASSIS"
						:key="Fields.Vehicle.CHASSIS"
						v-else
						@input:value="setChassis"
					/>

					<ui-date-picker
						title="Год выпуска"
						:value="issueYear"
						:error="errorEmpty(issueYear)"
						format="YYYY"
						picker="year"
						mask="####"
						:id="Fields.Vehicle.ISSUE_YEAR"
						:key="Fields.Vehicle.ISSUE_YEAR"
						required
						@change="set('issueYear', $event)"
					/>

					<ui-select
						title="Категория ТС"
						:value="category"
						:options="categoryOptions"
						:loading="isLoadingLists"
						:error="errorEmpty(category)"
						:id="Fields.Vehicle.CATEGORY"
						:key="Fields.Vehicle.CATEGORY"
						required
						@change="set('category', $event)"
					/>

					<ui-select
						title="Подкатегория ТС"
						:value="subCategory"
						:options="subCategoryOptions"
						:loading="isLoadingLists"
						:error="errorEmpty(subCategory)"
						:id="Fields.Vehicle.SUB_CATEGORY"
						:key="Fields.Vehicle.SUB_CATEGORY"
						v-if="isOsagoSpectech"
						required
						@change="set('subCategory', $event)"
					/>

					<ui-input
						title="Цвет кузова"
						:value="bodyColor"
						:error="errorEmpty(bodyColor)"
						:id="Fields.Vehicle.COLOR"
						:key="Fields.Vehicle.COLOR"
						v-if="!isOsagoSpectech"
						@input:value="set('bodyColor', $event)"
					/>

					<ui-input
						title="Мощность двигателя (л/с)"
						:value="enginePower"
						:mask="Validation.Mask.ENGINE_POWER"
						suffix="Л / С"
						:error="errorEmpty(enginePower)"
						:required="!isOsagoSpectech"
						:id="Fields.Vehicle.ENGINE_POWER"
						:key="Fields.Vehicle.ENGINE_POWER"
						@input:value="set('enginePower', $event)"
					/>

					<transition name="slide-fade-top">
						<ui-input-number
							:title="maxMassTitle"
							:class="{ _long: !isOsagoSpectech }"
							:value="maxMass"
							suffix="КГ."
							:error="!isOsagoSpectech && errorEmpty(maxMass)"
							:required="!isOsagoSpectech"
							:id="Fields.Vehicle.MAX_MASS"
							:key="Fields.Vehicle.MAX_MASS"
							v-if="isOsagoSpectech || category === 3"
							@input:value="set('maxMass', $event)"
						/>
					</transition>

					<transition name="slide-fade-top">
						<ui-input-number
							title="Количество пассажирских мест (для ТС категории D)"
							class="_long"
							:value="passCount"
							suffix="КГ."
							:error="errorEmpty(passCount)"
							required
							:id="Fields.Vehicle.PASS_COUNT"
							:key="Fields.Vehicle.PASS_COUNT"
							v-if="category === 4"
							@input:value="set('passCount', $event)"
						/>
					</transition>
				</div>
			</div>

			<p class="calculator-kasco__main-subtitle">Марка</p>
			<div class="calculator-kasco__main-list">
				<ui-select
					title="Марка ТС (согласно справочнику Страхование)"
					:value="markId"
					:options="markOptions"
					:loading="isLoadingLists"
					:error="errorEmpty(markId)"
					:id="Fields.Vehicle.MARK"
					:key="Fields.Vehicle.MARK"
					required
					@change="setMark"
				/>

				<ui-select
					title="Модель ТС (согласно справочнику Страхование)"
					:value="modelId"
					:options="modelOptions"
					:disabled="!markId"
					:loading="isLoadingModel"
					:error="errorEmpty(modelId)"
					:id="Fields.Vehicle.MODEL"
					:key="Fields.Vehicle.MODEL"
					required
					@change="set('modelId', $event)"
				/>

				<ui-checkbox
					class="calculator-kasco__main-mark"
					:value="isCustom"
					:id="Fields.Vehicle.IS_CUSTOM"
					:key="Fields.Vehicle.IS_CUSTOM"
					@change="setDisplayCustom"
				>
					Ввести полное название марки/модели
				</ui-checkbox>

				<template v-if="isCustom">
					<ui-input
						title="Полное название марки ТС"
						:value="customMark"
						:error="errorEmpty(customMark)"
						:id="Fields.Vehicle.CUSTOM_MARK"
						:key="Fields.Vehicle.CUSTOM_MARK"
						required
						@input:value="set('customMark', $event)"
					/>

					<ui-input
						title="Полное название модели ТС"
						:value="customModel"
						:error="errorEmpty(customModel)"
						:id="Fields.Vehicle.CUSTOM_MODEL"
						:key="Fields.Vehicle.CUSTOM_MODEL"
						required
						@input:value="set('customModel', $event)"
					/>
					<span class="calculator-kasco__main-empty" />
				</template>

				<transition name="slide-fade-top">
					<p class="calculator-kasco__main-car" v-if="store.getOriginalName">
						Марка и модель ТС из Автокода:
						<ui-tag color="green">
							{{ store.getOriginalName }}
						</ui-tag>
					</p>
				</transition>
			</div>

			<hr />

			<template v-if="isOsagoSpectech">
				<p class="calculator-kasco__main-subtitle">Документы спецтехники</p>
				<div class="calculator-kasco__main-list">
					<ui-select
						title="Тип документа"
						:options="documentTypeOptions"
						:value="documentType"
						:id="Fields.Vehicle.DOCUMENT_TYPE"
						:key="Fields.Vehicle.DOCUMENT_TYPE"
						@change="set('documentType', $event, false)"
					/>
					<ui-input
						class="calculator-kasco__main-uppercase"
						title="Серия документа"
						:value="documentSeries"
						:id="Fields.Vehicle.DOCUMENT_SERIES"
						:key="Fields.Vehicle.DOCUMENT_SERIES"
						@input:value="set('documentSeries', $event, false)"
					/>
					<ui-input
						class="calculator-kasco__main-uppercase"
						title="Номер документа"
						:value="documentNumber"
						:error="errorEmpty(documentNumber)"
						:id="Fields.Vehicle.DOCUMENT_NUMBER"
						:key="Fields.Vehicle.DOCUMENT_NUMBER"
						required
						@input:value="set('documentNumber', $event, false)"
					/>

					<ui-date-picker
						title="Дата регистрации документа"
						:value="documentIssueDate"
						:error="errorEmpty(documentIssueDate)"
						:id="Fields.Vehicle.DOCUMENT_ISSUE_DATE"
						:key="Fields.Vehicle.DOCUMENT_ISSUE_DATE"
						required
						@change="set('documentIssueDate', $event, false)"
					/>
					<span class="calculator-kasco__main-empty" />
				</div>
			</template>
			<template v-else>
				<p class="calculator-kasco__main-subtitle">Данные ПТС</p>
				<div class="calculator-kasco__main-list">
					<ui-input
						class="calculator-kasco__main-uppercase"
						title="Серия и номер ПТС/ЭПТС"
						:value="ptsSeriesNumber"
						:error="errorEmpty(ptsSeriesNumber)"
						:id="Fields.Vehicle.PTS"
						:key="Fields.Vehicle.PTS"
						required
						@input:value="set('ptsSeriesNumber', $event, false)"
					/>

					<ui-date-picker
						title="Дата регистрации ПТС"
						:value="ptsIssueDate"
						:error="errorEmpty(ptsIssueDate)"
						:id="Fields.Vehicle.PTS_DATE"
						:key="Fields.Vehicle.PTS_DATE"
						required
						@change="set('ptsIssueDate', $event)"
					/>
					<span class="calculator-kasco__main-empty" />
				</div>
			</template>

			<template v-if="!isOsagoSpectech">
				<hr />

				<p class="calculator-kasco__main-subtitle">Залоговые данные</p>
				<div class="calculator-kasco__main-list">
					<ui-radio
						type="button"
						:value="pledge"
						:options="pledgeOptions"
						@change="set('pledge', $event)"
					/>

					<transition name="slide-fade-top">
						<div class="calculator-kasco__main-pledge" v-if="isPledge">
							<ui-date-picker
								title="Дата договора залога"
								:value="pledgeDate"
								:error="errorEmpty(pledgeDate)"
								:id="Fields.Vehicle.PLEDGE_DATE"
								:key="Fields.Vehicle.PLEDGE_DATE"
								required
								@change="set('pledgeDate', $event)"
							/>

							<ui-input
								title="Номер залогового документа"
								:value="pledgeDocumentNumber"
								:error="errorEmpty(pledgeDocumentNumber)"
								:id="Fields.Vehicle.PLEDGE_DOCUMENT_NUMBER"
								:key="Fields.Vehicle.PLEDGE_DOCUMENT_NUMBER"
								required
								@input:value="set('pledgeDocumentNumber', $event)"
							/>
						</div>
					</transition>
				</div>

				<transition name="slide-fade-top">
					<div class="calculator-kasco__main-block _bordered" v-if="isPledge">
						<hr />

						<p class="calculator-kasco__main-subtitle">Данные о кредите</p>
						<div class="calculator-kasco__main-list">
							<ui-input
								title="Номер кредитного договора"
								:value="creditDocumentNumber"
								:error="errorEmpty(creditDocumentNumber)"
								:id="Fields.Vehicle.CREDIT_DOCUMENT_NUMBER"
								:key="Fields.Vehicle.CREDIT_DOCUMENT_NUMBER"
								required
								@input:value="set('creditDocumentNumber', $event)"
							/>

							<ui-date-picker
								title="Дата кредитного договора"
								:value="creditDocumentDate"
								:error="errorEmpty(creditDocumentDate)"
								:id="Fields.Vehicle.CREDIT_DOCUMENT_DATE"
								:key="Fields.Vehicle.CREDIT_DOCUMENT_DATE"
								required
								@change="set('creditDocumentDate', $event)"
							/>
						</div>
					</div>
				</transition>

				<div class="calculator-kasco__main-list">
					<div class="calculator-kasco__main-pledge">
						<template v-if="isPreviousContract">
							<ui-input
								title="Название компании"
								:value="insuranceCompanyName"
								@input:value="
									setPreviousContract('insuranceCompanyName', $event)
								"
							/>

							<ui-input-number
								title="Франшиза"
								:value="contractFranchize"
								@input:value="setPreviousContract('contractFranchize', $event)"
								:formatter="numberRubFormatter"
								:parser="numberRubParser"
								isAddonAfter
							>
								<template #addonAfter>Руб.</template>
							</ui-input-number>

							<ui-input
								title="Номер полиса"
								:value="contractNumber"
								@input:value="setPreviousContract('contractNumber', $event)"
							/>

							<ui-date-picker
								title="Дата окончания"
								:value="contractEnd"
								@change="setPreviousContract('contractEnd', $event)"
							/>
						</template>

						<ui-checkbox
							class="calculator-kasco__main-mark"
							:value="isPreviousContract"
							:id="Fields.Vehicle.IS_POLIS"
							:key="Fields.Vehicle.IS_POLIS"
							@change="set('isPolis', $event)"
						>
							Наличие действующего полиса
						</ui-checkbox>
					</div>
					<ui-alert :message="pledgeMessage" :type="Alert.Type.INFO" showIcon />
				</div>
			</template>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Img
import spectechImg from "~/assets/img/spectech.png"
import carImg from "~/assets/img/car.png"

// Hooks
import { useStore, useError, useFields } from "~/hooks"
import { useConfigStore } from "~/store"

// Types
import type { PropType } from "@vue/runtime-core"
import { UiAlert as Alert, Info } from "~/types"
import type { UiRadio } from "~/types"
import {
	CalculatorFields as Fields,
	AvtocodService,
	Calculator,
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
const { store, infoStore } = useStore(props.type)

// Data
const isLoadingDataByVin = ref<boolean>(false)
const isLoadingLists = ref<boolean>(false)
const isLoadingModel = ref<boolean>(false)

const steeringOptions: UiRadio.Options = prepareOptions(["Левый", "Правый"])
const pledgeOptions: UiRadio.Options = prepareOptions(["Залог", "Не залог"])

const pledgeMessage =
	"Страхование незалога по переходу из иной СК доступно только для ВСК"

// Computed
const { width } = useWindowSize()

const ptsSeriesNumber = computed(() => getField<string>("ptsSeriesNumber"))
const isPreviousContract = computed(() => getField<string>("isPolis"))
const ptsIssueDate = computed(() => getField<string>("ptsIssueDate"))
const polisNumber = computed(() => getField<string>("polisNumber"))
const enginePower = computed(() => getField<string>("enginePower"))
const customModel = computed(() => getField<string>("customModel"))
const pledgeDate = computed(() => getField<string>("pledgeDate"))
const customMark = computed(() => getField<string>("customMark"))
const bodyNumber = computed(() => getField<string>("bodyNumber"))
const issueYear = computed(() => getField<string>("issueYear"))
const bodyColor = computed(() => getField<string>("bodyColor"))
const passCount = computed(() => getField<string>("passCount"))
const category = computed(() => getField<string>("category"))
const steering = computed(() => getField<string>("steering"))
const isCustom = computed(() => getField<string>("isCustom"))
const modelId = computed(() => getField<string>("modelId"))
const chassis = computed(() => getField<string>("chassis"))
const maxMass = computed(() => getField<string>("maxMass"))
const pledge = computed(() => getField<string>("pledge"))
const markId = computed(() => getField<string>("markId"))
const vin = computed(() => getField<string>("vin"))

const insuranceCompanyName = computed(() =>
	getPreviousContractField<string>("insuranceCompanyName")
)
const contractFranchize = computed(() =>
	getPreviousContractField<string>("contractFranchize")
)
const contractNumber = computed(() =>
	getPreviousContractField<string>("contractNumber")
)
const contractEnd = computed(() =>
	getPreviousContractField<string>("contractEnd")
)

// Osago-spectech fields
const documentIssueDate = computed((): string => {
	if (isOsagoSpectech.value) {
		return getField<string>("documentIssueDate")
	}

	return ""
})

const documentSeries = computed((): string => {
	if (isOsagoSpectech.value) {
		return getField<string>("documentSeries")
	}

	return ""
})

const documentNumber = computed((): string => {
	if (isOsagoSpectech.value) {
		return getField<string>("documentNumber")
	}

	return ""
})

const documentType = computed((): string => {
	if (isOsagoSpectech.value) {
		return getField<string>("documentType")
	}

	return ""
})

const subCategory = computed((): string => {
	if (isOsagoSpectech.value) {
		return getField<string>("subCategory")
	}

	return ""
})

const registrationNumber = computed(() =>
	getField<string>("registrationNumber")
)

const pledgeDocumentNumber = computed(() =>
	getField<string>("pledgeDocumentNumber")
)

const creditDocumentNumber = computed(() =>
	getField<string>("creditDocumentNumber")
)

const creditDocumentDate = computed(() =>
	getField<string>("creditDocumentDate")
)

const subCategoryOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.SUB_CATEGORY_TS_TYPE)
})

const documentTypeOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.CAR_DOCUMENT_TYPE)
})

const categoryOptions = computed(() => {
	if (isOsagoSpectech.value) {
		// Todo: add Info.InfoType.CATEGORY_TS_TYPE to @common-repo/types
		const dynamicOption = infoStore.getInfo(Info.InfoType.CATEGORY_TS_TYPE)

		return dynamicOption?.length
			? dynamicOption
			: [
					{
						label: "С",
						value: 1
					}
			  ]
	} else {
		return infoStore.getInfo(Info.InfoTypeKasco.CAR_TYPES)
	}
})

const modelOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.MODELS)
})

const markOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.MARKS)
})

const isVin = computed((): boolean => {
	return isOsagoSpectech.value || steering.value === "Левый"
})

const isDisabledFetchDataByVin = computed((): boolean => {
	return isVin.value ? !!errorVin(vin.value) : !!errorChassis(chassis.value)
})

const isPledge = computed((): boolean => {
	return pledge.value === "Залог"
})

const isOsagoSpectech = computed((): boolean => {
	return props.type === Calculator.TypeEnum.OSAGO_SPECTECH
})

const img = computed((): string => {
	return isOsagoSpectech.value ? spectechImg : carImg
})

const title = computed((): string => {
	return `Данные ${isOsagoSpectech.value ? "спецтехники" : "автомобиля"}`
})

const maxMassTitle = computed((): string => {
	return `Разрешенная максимальная масса, кг${
		isOsagoSpectech.value ? "" : " (для ТС категории C)"
	}`
})

const registrationNumberMask = computed((): string => {
	return osagoSpectechMask(Validation.Mask.CAR_GOS_NUMBER)
})

const chassisMask = computed((): string => {
	return osagoSpectechMask(Validation.Mask.CHASSIS)
})

// Methods
const { numberRubFormatter, numberRubParser } = useFields()
const { errorVin, errorChassis, errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getFieldPayment<T>("main", fieldName)
}

function getPreviousContractField<T = string>(fieldName: string): T {
	return store.getFieldPayment<T>("previousContract", fieldName)
}

function set(fieldName: string, value: any, isRest: boolean = true): void {
	store.setData(Calculator.Tab.PAYMENT, "main", fieldName, value)

	if (isRest) store.resetInsurancesIfExist({})
}

function setPreviousContract(
	fieldName: string,
	value: any,
	isRest: boolean = true
): void {
	store.setData(Calculator.Tab.PAYMENT, "previousContract", fieldName, value)

	if (isRest) store.resetInsurancesIfExist({})
}

function prepareOptions(list: string[]): UiRadio.Options {
	return list.map((item: string) => {
		return {
			value: item,
			label: item
		}
	})
}

function setDisplayCustom(value: string): void {
	set("isCustom", value)

	if (!value) {
		set("customModel", "")
		set("customMark", "")
	}
}

function setVin(value: string): void {
	set("vin", value)

	if (!isOsagoSpectech.value) fetchDataByVin()
}

function setChassis(value: string): void {
	set("chassis", value)

	if (!isOsagoSpectech.value) fetchDataByChassis(value)
}

async function fetchAutoCodeData(): Promise<void> {
	if (props.type === Calculator.TypeEnum.KASCO && isVin.value) {
		fetchDataByVin()
	} else {
		fetchDataByChassis(chassis.value)
	}
}

async function fetchDataByVin(): Promise<void> {
	if (!isDisabledFetchDataByVin.value) {
		isLoadingDataByVin.value = true
		await store.fetchDataByVin()
		isLoadingDataByVin.value = false
	}
}

async function fetchDataByChassis(value: string): Promise<void> {
	if (
		!isDisabledFetchDataByVin.value ||
		props.type === Calculator.TypeEnum.OSAGO_SPECTECH
	) {
		isLoadingDataByVin.value = true
		await store.fetchAvtocodeData(value, AvtocodService.Identifier.CHASSIS)
		isLoadingDataByVin.value = false
	}
}

function setMark(value: string): void {
	set("markId", value)
	set("modelId", "")

	fetchModelsByMarkId()
}

async function fetchLists(): Promise<void> {
	isLoadingLists.value = true

	let promises: Promise<void>[] = []

	if (props.type === Calculator.TypeEnum.KASCO) {
		promises.push(
			infoStore.fetchKascoInfo(Info.InfoTypeKasco.SBS_DOCUMENT_TYPES),
			infoStore.fetchKascoInfo(Info.InfoTypeKasco.CAR_TYPES),
			infoStore.fetchKascoInfo(Info.InfoTypeKasco.OPS_LIST),
			infoStore.fetchMarks(props.type)
		)
	} else if (props.type === Calculator.TypeEnum.OSAGO_SPECTECH) {
		promises.push(
			infoStore.fetchInsuranceOpfs(props.type, store.getOpfCode),
			infoStore.fetchSubcategoryTsType(props.type),
			infoStore.fetchInsuranceDocumentsTypes(props.type),
			infoStore.fetchCarDocumentType(props.type),
			infoStore.fetchCategoryTsType(props.type),
			infoStore.fetchMarks(props.type)
		)
	}

	await Promise.all(promises).catch(() => {})

	isLoadingLists.value = false
}

function setDefaultValuesIfNotExist(): void {
	if (!pledgeDate.value) {
		const configStore = useConfigStore()
		const { $dayjs } = useNuxtApp()

		set("pledgeDate", $dayjs().format(configStore.getFormatDates), false)
	}
}

async function fetchModelsByMarkId(): Promise<void> {
	isLoadingModel.value = true
	if (markId.value) await infoStore.fetchModels(markId.value, props.type)
	isLoadingModel.value = false
}

function osagoSpectechMask(mask: string): string {
	return isOsagoSpectech.value ? "" : mask
}

onMounted(() => {
	fetchLists()
	fetchModelsByMarkId()
	setDefaultValuesIfNotExist()
})
</script>
