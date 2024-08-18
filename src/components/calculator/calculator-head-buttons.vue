<template>
	<div class="calculator__head-buttons">
		<ui-button
			@click="toArchive"
			type="dashed"
			:id="Calculator.Id.Button.ARCHIVE"
			:key="Calculator.Id.Button.ARCHIVE"
		>
			<template #icon>
				<folder-outlined />
			</template>
			Архив сделок
		</ui-button>
	</div>
</template>

<script setup lang="ts">
// Icons
import { FolderOutlined } from "@ant-design/icons-vue"

// Hooks
import { useStore } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store } = useStore(props.type)

// Methods
function toArchive() {
	const router = useRouter()
	const { $analytics } = useNuxtApp()

	router.push(`/${props.type}/archive`)

	$analytics.openArchive({
		calcName: store.calculatorName,
		isSuccess: true,
		value: store.getPrice
	})
}
</script>
