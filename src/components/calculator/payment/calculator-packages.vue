<template>
	<calculator-block title="Страховой пакет" :loading="store.getIsLoading">
		<template #header>
			<button
				class="calculator__block-toggle"
				:class="{ _open: isDetails }"
				@click="isDetails = !isDetails"
			>
				<down-outlined />
			</button>
		</template>

		<div
			class="calculator__packages"
			:class="{ _disabled: store.getIsLoading || store.getIsSended }"
		>
			<div class="calculator__packages-list">
				<button
					class="calculator__packages-item"
					v-for="{ name, icon, slug, id } in packages"
					:class="{ _active: activePackageId === id }"
					:key="`program-${id}`"
					:id="`program-${id}`"
					@click="set('activePackage', id), calculate"
				>
					<component :is="icon" :height="18" :width="18" />
					{{ name }}
				</button>
			</div>
			<transition name="slide-fade-top">
				<div class="calculator__packages-risks" v-if="isDetails">
					<p class="calculator__packages-subtitle">
						Риски, которые входят в программу
					</p>
					<ul class="calculator__packages-risks-list">
						<li
							class="calculator__packages-risk"
							v-for="(risk, index) in activeRisks"
							:key="index"
						>
							{{ risk }}
						</li>
					</ul>
				</div>
			</transition>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
import _debounce from "lodash/debounce"

// Components
import { calculatorBlock } from "~/components/calculator"
import { DownOutlined } from "@ant-design/icons-vue"

// Hooks
import { useCalculatorPackage, useStore } from "~/hooks"

// Types
import type { Component } from "@vue/runtime-core"
import type { PropType } from "vue-types/src/types"
import { Calculator } from "@common-repo/types/src"
import { CalculatorPackage } from "~/types"

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
const isDetails = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const { packages, activePackageId } = useCalculatorPackage()

// Computed
const activeRisks = computed((): CalculatorPackage.Package["risks"] => {
	const index: number = packages.findIndex(
		({ id }) => id === activePackageId.value
	)

	return packages[index].risks
})
const calculate = computed(() => {
	return _debounce(
		() => {
			store.calculate()
		},
		250,
		{
			maxWait: 1000
		}
	)
})

// Methods
function getField(fieldName: string): string {
	return store.getFieldPayment("packages", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData("payment", "packages", fieldName, value)
	calculate.value()
}

onMounted(async () => {
	isLoading.value = true
	await store.fetchPackages()
	isLoading.value = false
})
</script>
