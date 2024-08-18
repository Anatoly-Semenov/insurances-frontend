<template>
	<calculator />
</template>

<script setup lang="ts">
// Components
import { calculator } from "~/components/calculator"

definePageMeta({
	middleware: ["auth"]
})
</script>
