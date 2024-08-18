<template>
	<archive />
</template>

<script setup lang="ts">
// Components
import archive from "~/components/archive/archive.vue"

definePageMeta({
	middleware: ["auth"]
})
</script>
