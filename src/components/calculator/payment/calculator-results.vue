<template>
	<calculator-block
		title="Результаты расчета"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__results">
			<div class="calculator__results-item" v-if="isKasco">
				<p class="calculator__results-title">КАСКО</p>
				<ui-button
					class="calculator__results-link"
					type="link"
					@click="store.resetSelectInsurances"
				>
					Сбросить выбор страховой компании
				</ui-button>

				<div class="calculator__results-list">
					<calculator-results-block
						v-for="(
							{ insuranceCompany, isCvDisabled, minCv, maxCv, logo }, index
						) in kascoList"
						:key="index"
						:insuranceType="KascoService.InsuranceType.KASCO"
						:insuranceCompany="insuranceCompany"
						:isCvDisabled="isCvDisabled"
						:minCv="minCv"
						:maxCv="maxCv"
						:logo="logo"
						:type="type"
					/>
					<transition name="fade-in">
						<ui-alert
							message="Страхование предодобренного ИНН"
							:type="Alert.Type.INFO"
							showIcon
							v-if="isPreApprovement"
						/>
					</transition>
				</div>
			</div>

			<div class="calculator__results-item" v-if="isKasco || isOsagoSpectech">
				<p class="calculator__results-title">ОСАГО</p>
				<div class="calculator__results-list _long">
					<calculator-results-block
						v-for="(
							{ insuranceCompany, isCvDisabled, minCv, maxCv, logo, defaultCv },
							index
						) in osagoList"
						:key="index"
						:insuranceType="KascoService.InsuranceType.OSAGO"
						:insuranceCompany="insuranceCompany"
						:isCvDisabled="isCvDisabled"
						:defaultCv="defaultCv"
						:minCv="minCv"
						:maxCv="maxCv"
						:logo="logo"
						:type="type"
					/>
				</div>
			</div>

			<template v-if="isAsset">
				<div
					class="calculator__results-item"
					v-for="({ title, list }, index) in assetLists"
					:key="title + index"
				>
					<p class="calculator__results-title">{{ title }}</p>
					<div class="calculator__results-list">
						<calculator-results-block
							v-for="(
								{
									insuranceCompany,
									isCvDisabled,
									minCv,
									maxCv,
									logo,
									defaultCv
								},
								index
							) in list"
							:key="index"
							:insuranceCompany="insuranceCompany"
							:isCvDisabled="isCvDisabled"
							:defaultCv="defaultCv"
							:minCv="minCv"
							:maxCv="maxCv"
							:logo="logo"
							:type="type"
						/>
					</div>
				</div>
			</template>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { calculatorResultsBlock } from "./"

// Img
import logoInsurance from "~/assets/img/Insurance-logo.jpg"
import logoSogaz from "~/assets/img/sogaz-logo.png"

// Hooks
import { useStore, useCalculatorKasco } from "~/hooks"

// Types
import { Calculator, KascoService } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"
import { UiAlert as Alert, AssetService } from "~/types"

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
const isOsagoSpectech = computed((): boolean => {
	return props.type === Calculator.TypeEnum.OSAGO_SPECTECH
})

const isKasco = computed((): boolean => {
	return props.type === Calculator.TypeEnum.KASCO
})

const isAsset = computed((): boolean => {
	return props.type === Calculator.TypeEnum.ASSET
})

const isPreApprovement = computed((): boolean => {
	return (
		props.type === Calculator.TypeEnum.KASCO && !!store?.getIsPreApprovement
	)
})

// Data
const { kascoList, osagoList } = useCalculatorKasco(props.type)
const cv = ref("")

const assetLists = [
	{
		title: "Страхование",
		list: [
			{
				logo: logoInsurance,
				minCv: 5,
				maxCv: 35,
				isCvDisabled: false,
				insuranceCompany: AssetService.InsuranceCompany.SBS
			}
		]
	},
	{
		title: "Согаз",
		list: [
			{
				logo: logoSogaz,
				minCv: 5,
				maxCv: 35,
				isCvDisabled: false,
				insuranceCompany: AssetService.InsuranceCompany.SOGAZ
			}
		]
	}
]
</script>
