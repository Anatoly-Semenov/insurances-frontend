<template>
	<vue-markdown class="ui-markdown" :source="content" />
</template>

<script setup lang="ts">
const VueMarkdown = defineAsyncComponent(() => import("vue3-markdown-it"))

const props = defineProps({
	content: {
		type: String,
		default: ""
	}
})
</script>
