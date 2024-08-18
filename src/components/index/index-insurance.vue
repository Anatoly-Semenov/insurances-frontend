<template>
	<div class="index__insurance" @click.prevent="toCalculator" :id="data.id">
		<div class="index__insurance-intro">
			<div class="index__insurance-icon" v-if="data?.icon">
				<component :is="data.icon" :height="16" />
			</div>
			<p class="index__insurance-title" v-if="data?.name">{{ data.name }}</p>
		</div>
		<p class="index__insurance-description" v-if="true || data?.description">
			{{ data.description }}
		</p>
		<ul class="index__insurance-subjects" v-if="false && data?.subjects">
			<li
				class="index__insurance-subject"
				v-for="(subject, index) in data.subjects"
				:key="index + subject"
			>
				{{ subject }}
			</li>
		</ul>
		<div v-if="data?.isButtonsVisible" class="index__insurance-buttons">
			<ui-button class="index__insurance-detail" size="small" type="default">
				Подробнее
			</ui-button>
			<ui-button
				class="index__insurance-archive"
				@click="toArchive"
				size="small"
				type="default"
			>
				Архив сделок
			</ui-button>
		</div>
	</div>
</template>

<script setup lang="ts">
// Types
import { IndexInsurance } from "~/types"

// Plugins
const { $analytics } = useNuxtApp()

const props = defineProps<{
	data: IndexInsurance.Data
}>()

const router = useRouter()

const toCalculator = (): void => {
	router.push(props.data.path)

	$analytics.clickToCalculator(props.data.name)
}

const toArchive = (): void => {
	const { $stopEvents } = useNuxtApp()

	$stopEvents()

	router.push(props.data.path + "/archive")

	$analytics.openArchive({
		calcName: props.data.path
	})
}
</script>
