<template>
	<calculator-block :title="title" :isContent="isDetails">
		<template #header>
			<button
				class="calculator__markdown-toggle"
				:class="{ _open: isDetails }"
				@click="isDetails = !isDetails"
			>
				<down-outlined />
			</button>
		</template>
		<transition class="calculator__markdown" name="slide-fade-top" tag="div">
			<ui-markdown :content="content" v-if="isDetails" />
		</transition>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { DownOutlined } from "@ant-design/icons-vue"

const props = defineProps({
	title: {
		type: String,
		default: "Информация о продукте"
	},
	content: {
		type: String,
		default: ""
	}
})

// Data
const isDetails = ref<boolean>(true)
</script>
