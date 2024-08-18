<template>
	<div class="auth__layout">
		<slot v-if="isAvailableUser" />
		<layout-preloader v-else />
	</div>
</template>

<script setup lang="ts">
// Components
import { layoutPreloader } from "~/components/layout"

// Hooks
import { useUser } from "~/hooks"

// Data
const { isAvailableUser, fetchUserIfIsNotExist } = useUser()
const router = useRouter()

onMounted(async () => {
	await fetchUserIfIsNotExist().then(() => {
		router.push("/")
	})

	isAvailableUser.value = true
})
</script>
