<template>
	<div class="profile__block">
		<div class="profile__block-head">
			<p class="profile__block-title">
				{{ title }}
				<span class="profile__block-subtitle" v-if="subtitle">
					{{ subtitle }}
				</span>
			</p>
			<p class="profile__block-description" v-if="description">
				{{ description }}
			</p>
			<slot name="header" />
		</div>
		<div class="profile__block-content">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: "Заголовок"
	},
	subtitle: String,
	description: String
})
</script>
