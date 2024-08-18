<template>
	<ui-drawer
		class="calculator-cars__detail"
		:title="title"
		:width="1000"
		:value="isDisplay"
		@close="$emit('close')"
	>
		<template #extra>
			<div class="calculator-cars__detail-buttons">
				<ui-button type="default" @click="$emit('close')">Отменить</ui-button>
				<ui-button>Сохранить</ui-button>
			</div>
		</template>

		<div class="calculator-cars__detail-content">
			<calculator-block :title="subtitle">
				<div class="calculator-cars__detail-main">
					<img
						class="calculator-cars__detail-img"
						src="~/assets/img/car.png"
						alt="car"
					/>
					<div class="calculator-cars__detail-info">
						<ui-input
							title="Регистрационный знак"
							:value="car.registrationNumber"
							@input:value="
								store.setCarField('registrationNumber', $event, index)
							"
						/>
						<ui-input
							title="Идентификационный номер (VIN)"
							:value="car.vin"
							required
							@input:value="store.setCarField('vin', $event, index)"
						/>

						<ui-input
							title="Год выпуска"
							:value="car.issueYear"
							required
							@input:value="store.setCarField('issueYear', $event, index)"
						/>
						<ui-select
							title="Категория ТС"
							:value="car.category"
							:options="categoryOptions"
							required
							@change="store.setCarField('category', $event, index)"
						/>

						<ui-input
							title="Цвет кузова"
							:value="car.bodyColor"
							required
							@input:value="store.setCarField('bodyColor', $event, index)"
						/>
						<ui-input
							title="Мощность двигателя (л/с)"
							:value="car.enginePower"
							suffix="Л / С"
							required
							@input:value="store.setCarField('enginePower', $event, index)"
						/>
					</div>
				</div>
				<div class="calculator-cars__detail-list">
					<ui-input
						title="Разрешенная максмальная масса"
						:value="car.maxMass"
						required
						@input:value="store.setCarField('maxMass', $event, index)"
					/>
					<div class="calculator-cars__detail-row">
						<p class="calculator-cars__detail-subtitle">Тип руля</p>
						<ui-radio
							type="button"
							:value="steering"
							:options="steeringOptions"
							@change="steering = $event"
						/>
					</div>
					<ui-checkbox class="calculator-cars__detail-trailer" type="switch">
						ТС с прицепом
					</ui-checkbox>

					<ui-radio
						type="button"
						:value="age"
						:options="ageOptions"
						@change="age = $event"
					/>
					<ui-input
						title="Пробег"
						:value="car.mileage"
						@input:value="store.setCarField('mileage', $event, index)"
						suffix="КМ"
					/>
					<span class="calculator-cars__detail-empty" />
				</div>

				<hr />

				<p class="calculator-cars__detail-subtitle">Марка</p>
				<div class="calculator-cars__detail-list">
					<ui-select
						title="Марка ТС (согласно справочнику Страхование)"
						:value="car.markId"
						:options="markOptions"
						required
						@change="setMark($event, index)"
					/>
					<ui-select
						title="Модель ТС (согласно справочнику Страхование)"
						:value="car.modelId"
						:options="modelOptions"
						:disabled="!car.markId"
						:loading="isLoadingModel"
						required
						@change="store.setCarField('modelId', $event, index)"
					/>
					<ui-checkbox class="calculator-cars__detail-mark">
						Ввести полное название марки/модели
					</ui-checkbox>

					<ui-input
						title="Полное название марки ТС"
						:value="car.customMark"
						@input:value="store.setCarField('customMark', $event, index)"
					/>
					<ui-input
						title="Полное название модели ТС"
						:value="car.customModel"
						@input:value="store.setCarField('customModel', $event, index)"
					/>
					<span class="calculator-cars__detail-empty" />
				</div>

				<hr />

				<p class="calculator-cars__detail-subtitle">Данные СТС</p>
				<div class="calculator-cars__detail-list">
					<ui-input
						title="Серия и номер СТС"
						:value="sts.number"
						@input:value="store.setStsValue('number', $event, index)"
					/>
					<ui-date-picker
						title="Дата выдачи СТС"
						:value="sts.issueDate"
						@change="store.setStsValue('issueDate', $event, index)"
					/>
				</div>

				<hr />

				<p class="calculator-cars__detail-subtitle">Данные ПТС</p>
				<div class="calculator-cars__detail-list">
					<ui-input
						title="Серия и номер ПТС/ЭПТС"
						:value="car.ptsSeriesNumber"
						@input:value="store.setCarField('ptsSeriesNumber', $event, index)"
					/>
					<ui-date-picker
						title="Дата регистрации ПТС"
						:value="car.ptsIssueDate"
						@input:value="store.setCarField('ptsIssueDate', $event, index)"
					/>
					<span class="calculator-cars__detail-empty" />
				</div>

				<hr />

				<p class="calculator-cars__detail-subtitle">Страховые данные</p>
				<div class="calculator-cars__detail-list">
					<ui-input
						title="Полная стоимость ТС"
						:value="car.totalCost"
						@input:value="store.setCarField('totalCost', $event, index)"
						suffix="Руб."
					/>
					<ui-input
						title="Страховая сумма ТС"
						:value="car.insuranceSum"
						@input:value="store.setCarField('insuranceSum', $event, index)"
						suffix="Руб."
					/>
					<ui-select
						title="Цель использования ТС"
						:value="car.usage"
						:options="usageOptions"
						@change="store.setCarField('usage', $event, index)"
					/>

					<ui-date-picker
						title="Дата начала страхования"
						:value="car.startDate"
						@change="store.setCarField('startDate', $event, index)"
					/>
					<ui-date-picker
						title="Дата окончания страхования"
						:value="car.endDate"
						@change="store.setCarField('endDate', $event, index)"
					/>
					<span class="calculator-cars__detail-empty" />
				</div>
			</calculator-block>
		</div>
	</ui-drawer>
</template>

<script lang="ts" setup>
import { calculatorBlock } from "~/components/calculator"

// Types
import type { PropType } from "@vue/runtime-core"
import type { UiRadio } from "~/types"
import {
	Calculator,
	Info,
	InfoService,
	MotorService
} from "@common-repo/types/src"

// Hooks
import { useCalculatorCars, useFields } from "~/hooks"
import { useInfoStore } from "~/store"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	},
	isDisplay: {
		type: Boolean,
		default: false
	},
	index: {
		type: Number,
		default: 0
	}
})

// Store
const infoStore = useInfoStore()

// Methods
const { prepareOptions } = useFields()
const { getCarByIndex, store, modelOptions, markOptions } = useCalculatorCars(
	props.type
)

async function fetchModels(): Promise<void> {
	isLoadingModel.value = true

	await store.fetchInfoModels(car.value.markId)

	isLoadingModel.value = false
}

function setMark(value: string, index: number): void {
	store.setCarField("markId", value, index)
	store.setCarField("modelId", "", index)

	fetchModels()
}

// Data
const steeringOptions: UiRadio.Options = prepareOptions(["Левый", "Правый"])
const ageOptions: UiRadio.Options = prepareOptions(["Новое", "С пробегом"])

const isLoadingModel = ref<boolean>(false)

const steering = ref<string>("Левый")
const age = ref<string>("Новое")

// Computed
const title = computed((): string => {
	return `Сводная информация об автомобиле №${props.index + 1}`
})

const subtitle = computed((): string => {
	let text: string = "Основные данные автомобиля"

	if (car.value.originalName) text += ` | ${car.value.originalName}`

	return text
})

const car = computed((): MotorService.Vehicle => {
	return getCarByIndex(props.index)
})

const sts = computed(
	(): MotorService.VehiclePassport => car.value.registrationCertificate
)

const categoryOptions = computed(() => {
	return store.getInfo(MotorService.InfoType.CATEGORIES)
})
const usageOptions = computed(() => {
	return infoStore.getInfo(Info.InfoTypeStatic.USAGE_VEHICLE, "static")
})
</script>
