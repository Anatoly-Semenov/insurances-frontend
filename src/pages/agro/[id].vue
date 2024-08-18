<template>
	<calculator
		title="Агро"
		:icon="CloudOutlined"
		:type="Calculator.TypeEnum.AGRO"
	/>
</template>

<script setup lang="ts">
// Types
import { Calculator } from "@common-repo/types/src"

// Components
import { calculator } from "~/components/calculator"
import { CloudOutlined } from "@ant-design/icons-vue"

definePageMeta({
	middleware: ["auth"]
})
</script>
