<template>
	<calculator-block
		title="Полезные файлы"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator-agro__files">
			<ui-tooltip :title="offerTooltip">
				<ui-button
					class="calculator__risk-offer"
					type="default"
					:disabled="!store.getCanOffer"
					:loading="isLoadingOffer"
					:id="Fields.Agro.DOWNLOAD_KP"
					@click="fetchCommercialOffer"
				>
					<upload-outlined />
					Выгрузить КП
				</ui-button>
			</ui-tooltip>

			<a
				v-for="({ text, file, id }, index) in downloadButtons"
				:key="index"
				:href="file"
				:id="id"
				download
			>
				<ui-button type="default">
					<upload-outlined />
					{{ text }}
				</ui-button>
			</a>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { UploadOutlined } from "@ant-design/icons-vue"

// Hooks
import { useStore } from "~/hooks"

// Types
import { CalculatorFields as Fields, Calculator } from "@common-repo/types/src"
import { PropType } from "@vue/runtime-core"

interface File {
	id: Fields.Agro
	text: string
	file: string
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.AGRO
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const isLoadingOffer = ref<boolean>(false)

const downloadButtons: File[] = [
	{
		id: Fields.Agro.DOWNLOAD_LIST_OF_AGRICULTURAL_OBJECTS,
		text: "Перечень объектов СХ в 2023г.",
		file: "~/public/documents/agro-objects-2023.xlsx"
	},
	{
		id: Fields.Agro.DOWNLOAD_COEFFICIENTS_BY_RISK_GROUPS,
		text: "Коэффициенты по группам рисков",
		file: "~/public/documents/agro-risks-groups-koefs.xlsx"
	}
]

// Computed
const offerTooltip = computed((): false | string => {
	return store.getCanOffer
		? false
		: "Для выгрузки КП необходимо сохранить сделку и произвести расчет"
})

// Methods
async function fetchCommercialOffer(): Promise<void> {
	isLoadingOffer.value = true
	await store.fetchCommercialOffer()
	isLoadingOffer.value = false
}
</script>
