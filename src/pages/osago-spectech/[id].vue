<template>
	<calculator
		title="ОСАГО / Спецтехинка"
		:icon="FileDoneOutlined"
		:type="Calculator.TypeEnum.OSAGO_SPECTECH"
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
import { FileDoneOutlined } from "@ant-design/icons-vue"
</script>
