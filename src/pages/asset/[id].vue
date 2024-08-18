<template>
	<calculator
		title="Имущество"
		:icon="HomeOutlined"
		:type="Calculator.TypeEnum.ASSET"
	/>
</template>

<script setup lang="ts">
// Types
import { Calculator } from "@common-repo/types/src"

// Components
import { calculator } from "~/components/calculator"
import { HomeOutlined } from "@ant-design/icons-vue"

definePageMeta({
	middleware: ["auth"]
})
</script>
