<template>
	<div class="error">
		<layout-header v-if="isAuth" />
		<div class="error__content">
			<ui-result
				v-if="error.statusCode === 404"
				title="404"
				subTitle="Такой страницы нет"
				status="404"
			>
				<template #extra>
					<ui-button @click="$router.push('/')">На главную</ui-button>
				</template>
			</ui-result>
			<ui-result
				v-if="error.statusCode === 500"
				title="500"
				subTitle="Произошла ошибка"
				status="500"
			>
				<template #extra>
					<ui-button @click="reload">Обновить страницу</ui-button>
				</template>
			</ui-result>
		</div>
		<layout-footer v-if="isAuth" />
	</div>
</template>

<script setup lang="ts">
// Components
import { layoutHeader, layoutFooter } from "~/components/layout/"

// Props
const props = defineProps({
	error: Object
})

// Data
const isAuth = ref<boolean>(false)

const reload = (): void => {
	window.location.reload()
}

onMounted(() => {
	const { $getCookieDomain } = useNuxtApp()

	isAuth.value = !!useCookie("token", {
		domain: $getCookieDomain(),
		default: () => ""
	}).value
})
</script>
