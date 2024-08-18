<template>
	<calculator
		title="КАСКО"
		:icon="CarOutlined"
		:type="Calculator.TypeEnum.KASCO"
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
