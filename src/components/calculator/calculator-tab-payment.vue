<template>
	<div class="calculator__tab-payment">
		<template v-if="type === types.ASSET">
			<calculator-payment :type="type" />
			<calculator-summary :type="type" />
			<calculator-results :type="type" />
		</template>

		<template v-if="type === types.SPECTECH">
			<calculator-territories :type="type" />
			<calculator-payment :type="type" />
			<calculator-price :type="type" />
		</template>

		<template v-if="type === types.OSAGO_SPECTECH">
			<calculator-owner :type="type" />
			<calculator-kasco-main :type="type" />
			<calculator-policyholder :type="type" />
			<calculator-osago :type="type" />
			<calculator-results :type="type" />
		</template>

		<template v-if="type === types.CYBER">
			<calculator-price :type="type" />
			<calculator-payment :type="type" />
			<calculator-packages :type="type" />
		</template>

		<template v-if="type === types.KASCO">
			<calculator-owner :type="type" />
			<calculator-kasco-main :type="type" />
			<calculator-policyholder :type="type" />
			<calculator-kasco :type="type" />
			<calculator-osago :type="type" />
			<calculator-results :type="type" />
		</template>

		<template v-if="type === types.SMR">
			<calculator-description-object :type="type" />
			<calculator-payment :type="type" />
			<calculator-price :type="type" />
			<calculator-responsibility :type="type" />
			<calculator-files :type="type" />
		</template>

		<template v-if="type === types.BREAK">
			<calculator-price :type="type" />
			<calculator-payment :type="type" />
			<calculator-markdown :content="markdown" />
		</template>

		<template v-if="type === types.CASH">
			<calculator-locations :type="type" />
		</template>

		<template v-if="type === types.ECO">
			<calculator-price :type="type" />
			<calculator-payment :type="type" />
			<calculator-object :type="type" />
			<calculator-markdown :content="markdown" />
		</template>

		<template v-if="type === types.MOTOR">
			<calculator-motor :type="type" />
			<calculator-cars :type="type" />
		</template>

		<template v-if="type === types.AGRO">
			<calculator-agro :type="type" />
			<calculator-fertility
				:type="type"
				:componentType="AgroService.FertilityComponentType.FERTILITY"
			/>
			<calculator-fertility
				:type="type"
				:componentType="AgroService.FertilityComponentType.DETAILS"
			/>
			<calculator-fertility
				:type="type"
				:componentType="AgroService.FertilityComponentType.EMERGENCY"
			/>
			<calculator-risk :type="type" />
			<calculator-agro-files :type="type" />
		</template>
	</div>
</template>

<script setup lang="ts">
// Components
import {
	calculatorDescriptionObject,
	calculatorResponsibility,
	calculatorPolicyholder,
	calculatorTerritories,
	calculatorAgroFiles,
	calculatorLocations,
	calculatorKascoMain,
	calculatorFertility,
	calculatorSummary,
	calculatorPackages,
	calculatorPayment,
	calculatorResults,
	calculatorAssets,
	calculatorObject,
	calculatorFiles,
	calculatorPrice,
	calculatorMotor,
	calculatorKasco,
	calculatorOsago,
	calculatorOwner,
	calculatorCars,
	calculatorAgro,
	calculatorRisk
} from "./payment"
import calculatorMarkdown from "./calculator-markdown.vue"

// Hooks
import { useCalculatorMarkdown, useStore, useDeal } from "~/hooks"

// Types
import { Calculator, AgroService } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Data
const types = Calculator.TypeEnum
const markdown = useCalculatorMarkdown(props.type)
const { isDetail } = useDeal()

// Store
const { store } = useStore(props.type)

// Methods
function redirectIfNotExistInn(): void {
	if (props.type !== types.AGRO && !store.getInn) {
		const router = useRouter()

		router.push({
			query: {
				tab: "insurer"
			}
		})
	}
}

onMounted(() => {
	if (!isDetail.value) {
		redirectIfNotExistInn()
	}
})
</script>
