<template>
	<calculator
		title="СМР"
		:icon="FormatPainterOutlined"
		:type="Calculator.TypeEnum.SMR"
	/>
</template>

<script setup lang="ts">
// Types
import { Calculator } from "@common-repo/types/src"

// Components
import { calculator } from "~/components/calculator"
import { FormatPainterOutlined } from "@ant-design/icons-vue"

definePageMeta({
	middleware: ["auth"]
})
</script>
