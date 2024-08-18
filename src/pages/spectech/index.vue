<template>
	<calculator
		title="Спецтехника"
		:icon="CarOutlined"
		:type="Calculator.TypeEnum.SPECTECH"
	/>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["auth"]
})

// Types
import { Calculator } from "@common-repo/types/src"

// Components
import { calculator } from "~/components/calculator"
import { CarOutlined } from "@ant-design/icons-vue"
</script>
