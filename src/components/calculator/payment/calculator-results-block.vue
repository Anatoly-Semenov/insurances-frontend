<template>
	<ui-tooltip :title="tooltip">
		<div
			class="calculator__results-block"
			:class="{
				_selected: isSelected,
				_calculated: insurancePremium,
				_disabled: !insurancePremium
			}"
		>
			<ui-checkbox
				:value="isSelected"
				@change="setSelected"
				:id="`${insuranceType}-${insuranceCompany}-select`"
			/>

			<div class="calculator__results-intro">
				<img class="calculator__results-logo" :src="logo" alt="logo" />
				<div class="calculator__results-info">
					<ui-input-number
						title="Страховая премия"
						:value="insurancePremium"
						:formatter="numberRubFormatter"
						:parser="numberRubParser"
						:error="errorEmpty(insurancePremium)"
						isReadOnly
						:loading="isLoadingFields"
						:id="`${insuranceType}-${insuranceCompany}-insurance_premium`"
						required
						@input:value="setSumInsurance"
					/>
					<ui-slider
						title="КВ"
						:isDisabled="isCvDisabled"
						:value="cv"
						:min="minCv"
						:max="maxCv"
						:id="`${insuranceType}-${insuranceCompany}-cv`"
						@change="setCv"
					/>
				</div>
			</div>
		</div>
	</ui-tooltip>
</template>

<script setup lang="ts">
// Hooks
import { useStore, useFields, useError } from "~/hooks"

// Types
import { PropType } from "@vue/runtime-core"
import { Calculator, KascoService } from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	},
	insuranceType: {
		type: String as PropType<KascoService.InsuranceType>,
		default: KascoService.InsuranceType.KASCO
	},
	insuranceCompany: {
		type: String as PropType<KascoService.InsuranceCompany>,
		default: KascoService.InsuranceCompany.SBS
	},
	logo: {
		type: String,
		default: ""
	},
	minCv: {
		type: Number,
		default: 5
	},
	defaultCv: Number,
	maxCv: {
		type: Number,
		default: 50
	},
	isCvDisabled: {
		type: Boolean,
		default: false
	}
})

// Store
const { store } = useStore(props.type)

// Data
const isLoadingFields = ref<boolean>(false)

// Computed
const isSelected = computed((): string => {
	return getMethodFabric("isSelected")
})

const insurancePremium = computed((): string => {
	return getMethodFabric("insurancePremium")
})

const cv = computed((): string => {
	return getMethodFabric("cv")
})

const tooltip = computed((): string | false => {
	return !insurancePremium.value
		? "Для выбора страховой компании необходимо сделать расчет"
		: false
})

// Methods
const { numberRubFormatter, numberRubParser } = useFields()

const { errorEmpty } = useError()

function getMethodFabric(key: KascoService.InsuranceKey): string {
	return store.getInsuranceData({
		type: props.insuranceType,
		company: props.insuranceCompany,
		key
	})
}

function setMethodFabric(
	key: KascoService.InsuranceKey,
	value: string | boolean
) {
	store.setInsuranceData({
		company: props.insuranceCompany,
		type: props.insuranceType,
		value,
		key
	})
}

function setSumInsurance(value: string): void {
	setMethodFabric("insurancePremium", value)
}

function setSelected(value: boolean): void {
	setMethodFabric("isSelected", value)
}

function setCv(value: string): void {
	setMethodFabric("cv", value)

	store.resetInsurancePremium(props.insuranceCompany, props.insuranceType)

	if (props.type === Calculator.TypeEnum.OSAGO_SPECTECH) {
		store.setData(Calculator.Tab.PAYMENT, "main", "cv", value)
	}
}

onMounted(() => {
	if (!cv.value && props.defaultCv) {
		setCv(props.defaultCv + "")
	}
})
</script>
