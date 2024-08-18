<template>
	<archive :type="Calculator.TypeEnum.ASSET" />
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
