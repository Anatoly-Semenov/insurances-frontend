<template>
	<archive :type="Calculator.TypeEnum.MOTOR" />
</template>

<script setup lang="ts">
// Types
import { Calculator } from "@common-repo/types/src"

// Components
import archive from "~/components/archive/archive.vue"

definePageMeta({
	middleware: ["auth"]
})
</script>
