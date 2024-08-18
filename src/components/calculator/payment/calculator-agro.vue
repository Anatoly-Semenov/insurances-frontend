<template>
	<calculator-block
		title="Общая информация"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
		class="calculator__agro-block"
	>
		<img
			class="calculator__agro-img"
			src="~/assets/img/spectech.png"
			alt="img"
		/>
		<div class="calculator__agro">
			<div class="calculator__agro-main">
				<ui-input
					title="ИНН страхователя"
					:value="inn"
					:error="errorInn(inn)"
					:disabled="isLoading"
					v-mask="Validation.Mask.INN_LONG"
					required
					:id="Fields.Insurer.INN"
					@input:value="set('inn', $event)"
				/>
				<ui-select
					title="Регион страхования"
					:options="regionOptions"
					:value="region"
					required
					:id="Fields.Placement.REGION"
					@change="setRegion"
				/>
				<div class="calculator__agro-subject">
					<ui-radio
						:options="subjectTypeOptions"
						:value="subjectType"
						:id="Fields.Placement.SUBJECT_TYPE"
						@change="set('subjectType', $event)"
					/>
				</div>
			</div>
		</div>
		<ui-alert :message="message.calculation" :type="Alert.Type.INFO" showIcon />

		<transition name="slide-fade-top">
			<ui-alert
				class="calculator__agro-alert"
				v-if="subjectType === 0"
				:message="message.subjectType"
				:type="Alert.Type.INFO"
				showIcon
			/>
		</transition>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError } from "~/hooks"

// Types
import type { UiRadio, UiSelect, UiInput } from "~/types"
import type { PropType } from "@vue/runtime-core"
import { UiAlert as Alert } from "~/types"

import {
	CalculatorFields as Fields,
	Validation,
	Calculator,
	Info
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.AGRO
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum
const isLoading = ref<boolean>(false)

const message = {
	calculation: "Расчет произведен по всей группе рисков с коэффициентом 1",
	subjectType:
		'Для получения корректного расчета по СП в риске ЧС ДВБ необходимо всегда выбирать "Субъект малого предпринимательства"'
}

// Methods
const { errorInn, errorEmpty } = useError()

function getField<T>(fieldName: string): T {
	return store.getMainField(fieldName)
}

function set(fieldName: string, value: any): void {
	store.setMainField(fieldName, value)
}

function setRegion(value: string): void {
	store.setRegion(value)

	infoStore.fetchBindingsByRegionId(value)
}

// Computed
const inn = computed(() => getField<boolean>("inn"))
const region = computed(() => getField<string>("region"))
const subjectType = computed(() => getField<number>("subjectType"))

const subjectTypeOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoTypeStatic.SUBJECT_TYPE, "static")
})
const regionOptions = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.REGIONS)
})

onMounted(() => {
	infoStore.fetchInfo(Info.InfoType.REGIONS)
})
</script>
