<template>
	<div class="calculator__tab-insurer">
		<template v-if="standardCalculators.includes(type)">
			<calculator-insurer :type="type" />
			<transition-group
				class="calculator__block-list"
				name="slide-fade-top"
				v-if="store.getHaveCompanyType"
				tag="div"
			>
				<calculator-company-address :type="type" key="calculator-address" />
				<calculator-passport :type="type" key="calculator-passport" />
				<calculator-signatory :type="type" key="calculator-signatory" />
			</transition-group>
		</template>

		<template v-if="type === types.SMR">
			<calculator-insurer :type="type" />
			<transition-group
				class="calculator__block-list"
				name="slide-fade-top"
				v-if="store.getHaveCompanyType"
				tag="div"
			>
				<calculator-company-address :type="type" key="calculator-address" />
				<calculator-passport :type="type" key="calculator-passport" />
			</transition-group>
		</template>

		<template v-if="type === types.SPECTECH">
			<calculator-insurer :type="type" />
			<transition-group
				class="calculator__block-list"
				name="slide-fade-top"
				v-if="store.getHaveCompanyType"
				tag="div"
			>
				<calculator-passport :type="type" key="calculator-passport" />
				<calculator-signatory :type="type" key="calculator-signatory" />
			</transition-group>
		</template>
	</div>
</template>

<script setup lang="ts">
// Components
import {
	calculatorInsurer,
	calculatorPassport,
	calculatorSignatory,
	calculatorCompanyAddress
} from "./insurer"

// Hooks
import { useStore } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"

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

const standardCalculators: Calculator.Type[] = [
	types.OSAGO_SPECTECH,
	types.ASSET,
	types.KASCO,
	types.MOTOR,
	types.CYBER,
	types.BREAK,
	types.CASH,
	types.ECO
]
</script>
