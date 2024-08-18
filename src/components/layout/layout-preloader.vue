<template>
	<div class="layout__preloader">
		<div class="layout__preloader-container">
			<icon-logo class="layout__preloader-logo" />
			<p class="layout__preloader-title">{{ title }}</p>
			<p class="layout__preloader-subtitle">{{ subtitle }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
// Icons
import iconLogo from "~/assets/img/logo.svg"

// Data
const title: string = "Загрузка"
const subtitle: string = "Подгружаем данные пользователя"
</script>
