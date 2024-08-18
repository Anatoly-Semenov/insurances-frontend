<template>
	<div class="calculator__tab-registration">
		<template v-if="standardCalculators.includes(type)">
			<calculator-contract :type="type" />
			<calculator-placement :type="type" />
			<calculator-bank :type="type" />
		</template>

		<template v-if="standardCalculatorsWithParent.includes(type)">
			<calculator-contract :type="type" />
			<calculator-placement :type="type" />
			<calculator-bank :type="type" />
			<calculator-parent :type="type" />
		</template>

		<template v-if="type === types.SPECTECH">
			<calculator-contract :type="type" />
			<calculator-placement :type="type" />
			<calculator-bank :type="type" />
			<calculator-registration-additional :type="type" />
			<calculator-beneficiary :type="type" />
			<calculator-parent :type="type" />
		</template>

		<template v-if="type === types.SMR">
			<calculator-contract :type="type" />
			<calculator-placement :type="type" />
			<calculator-bank :type="type" />
			<calculator-beneficiary :type="type" />
		</template>
	</div>
</template>

<script setup lang="ts">
// Components
import {
	calculatorRegistrationAdditional,
	calculatorBeneficiary,
	calculatorPlacement,
	calculatorContract,
	calculatorParent,
	calculatorBank
} from "./registratoin"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"

// Hooks
import { useStore, useDeal } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store } = useStore(props.type)

// Data
const types = Calculator.TypeEnum
const { isDetail } = useDeal()

const standardCalculators: Calculator.Type[] = [
	types.MOTOR,
	types.CYBER,
	types.BREAK,
	types.CASH,
	types.ECO
]

const standardCalculatorsWithParent: Calculator.Type[] = [
	types.OSAGO_SPECTECH,
	types.ASSET,
	types.KASCO
]

// Methods
function redirectIfNotExistInn(): void {
	if (!store.getInn) {
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
		store.setRegistrationDataFromProfile()
		redirectIfNotExistInn()
	}
})
</script>
