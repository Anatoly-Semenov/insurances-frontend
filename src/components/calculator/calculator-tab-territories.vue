<template>
	<div class="calculator__tab-payment">
		<template v-if="type === types.ASSET">
			<calculator-assets :type="type" />
		</template>
	</div>
</template>

<script setup lang="ts">
// Components
import { calculatorAssets } from "./payment"

// Hooks
import { useStore, useDeal } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator, AgroService } from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.ASSET
	}
})

// Data
const types = Calculator.TypeEnum
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
