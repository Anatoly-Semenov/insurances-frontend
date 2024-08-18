<template>
	<div
		class="calculator__block"
		:class="{ _loading: loading, _disabled: disabled, _withoutTitle: !title }"
	>
		<div class="calculator__block-head">
			<div class="calculator__block-text">
				<p class="calculator__block-title" v-if="title">
					{{ title }}
				</p>
				<transition name="fade-in">
					<p class="calculator__block-description" v-if="description">
						{{ description }}
					</p>
				</transition>
			</div>
			<slot name="header" />
		</div>
		<transition name="fade-in">
			<div class="calculator__block-content" v-if="isContent">
				<slot />
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: ""
	},
	description: {
		type: String,
		default: ""
	},
	loading: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	isContent: {
		type: Boolean,
		default: true
	}
})
</script>
