<template>
	<div class="layout">
		<template v-if="isAvailableUser">
			<layout-demo />
			<layout-header />
			<div class="layout__content">
				<div class="layout__container">
					<slot />
				</div>
			</div>
			<layout-footer />
		</template>
		<layout-preloader v-else />
	</div>
</template>

<script setup lang="ts">
// Components
import {
	layoutHeader,
	layoutFooter,
	layoutPreloader,
	layoutDemo
} from "~/components/layout/"

// Types
import { Info } from "@common-repo/types/src"

// Hooks
import { useUser } from "~/hooks"

// Store
import { useInfoStore } from "~/store"
const infoStore = useInfoStore()

// Data
const { isAvailableUser, email, terBankName, fetchUserIfIsNotExist } = useUser()

// Plugins
const { $analytics } = useNuxtApp()

// Computed
onMounted(async () => {
	await fetchUserIfIsNotExist()

	isAvailableUser.value = true

	await setAnalyticsData()
})

// Methods
async function setAnalyticsData() {
	await infoStore.fetchInfo(Info.InfoType.TER_BANKS)

	window.setTimeout(() => {
		$analytics.setUserId(email.value)
		$analytics.setCustomDimension(terBankName.value)
	}, 100)
}

onMounted(() => {
	console.log("RELEASES-269")
})
</script>
