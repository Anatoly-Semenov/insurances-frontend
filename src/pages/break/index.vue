<template>
	<calculator
		title="Перерыв"
		:icon="ClockCircleOutlined"
		:type="Calculator.TypeEnum.BREAK"
	/>
</template>

<script setup lang="ts">
// Types
import { Calculator } from "@common-repo/types/src"

// Components
import { calculator } from "~/components/calculator"
import { ClockCircleOutlined } from "@ant-design/icons-vue"

definePageMeta({
	middleware: ["auth"]
})
</script>
