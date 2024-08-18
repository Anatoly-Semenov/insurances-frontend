<template>
	<calculator
		title="Мотор-помощник"
		:icon="CarOutlined"
		:type="Calculator.TypeEnum.MOTOR"
	/>
</template>

<script setup lang="ts">
// Types
import { Calculator } from "@common-repo/types/src"

// Components
import { calculator } from "~/components/calculator"
import { CarOutlined } from "@ant-design/icons-vue"

definePageMeta({
	middleware: ["auth"]
})
</script>
