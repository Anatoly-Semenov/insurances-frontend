<template>
	<config-provider :locale="locale">
		<nuxt-layout>
			<nuxt-loading-indicator />
			<nuxt-page />
		</nuxt-layout>
	</config-provider>
</template>

<script setup lang="ts">
import { ConfigProvider } from "ant-design-vue"

import locale from "ant-design-vue/es/locale/ru_RU"
</script>
