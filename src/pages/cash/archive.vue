<template>
	<archive :type="Calculator.TypeEnum.CASH" />
</template>

<script setup lang="ts">
// Types
import { Calculator } from "@common-repo/types/src"

// Components
import archive from "~/components/archive/archive.vue"
import { message } from "ant-design-vue"

definePageMeta({
	middleware: ["auth"]
})

onMounted(() => {
	const router = useRouter()

	// Todo: Maybe temporary hide calculator: "Cash"
	router.push("/")

	message.error(`Калькулятор "Наличность" снят с витрины`)
})
</script>
