<template>
	<landing v-bind="props" />
</template>

<script lang="ts" setup>
// Components
import landing from "~/components/landing/landing.vue"

// Img
import img from "~/assets/img/ksb.png"

// hooks
import { useConfig } from "~/hooks"

// Types
import { Landing } from "~/types"

const { goLanding } = useConfig()

const props = {
	type: Landing.Type.REDIRECT_WITH_FIELD,
	img,
	title: "Страхование гражданской ответственности",
	description: "",
	redirectLink: `${goLanding}`
}
</script>
