<template>
	<calculator-block
		title="Описание территории страхования"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__territories">
			<ui-checkbox
				:value="isSecurityAssist"
				@change="set('isSecurityAssist', $event)"
				:id="CalculatorFields.Territory.IS_SECURITY_ASSIST"
			>
				Охрана присутствует в нерабочее время
			</ui-checkbox>
		</div>

		<div class="calculator__territories-buttons">
			<ui-button
				@click="store.addTerritory"
				:disabled="!isSecurityAssist"
				:id="CalculatorFields.Territory.ADD_TERRITORY"
			>
				Добавить Территорию
			</ui-button>

			<ui-button
				type="dashed"
				:disabled="!isSecurityAssist"
				@click="downloadExampleFile"
				:loading="isLoadingDownloadExampleFile"
				:id="CalculatorFields.Territory.DOWNLOAD_EXAMPLE_FILE"
			>
				<download-outlined />
				Скачать шаблон для заполнения территорий
			</ui-button>

			<ui-upload
				@change="handleChangeUpload"
				@remove="removeFile"
				:disabled="!isSecurityAssist"
			>
				<ui-button
					type="dashed"
					:loading="isUploadingFile"
					:disabled="!isSecurityAssist"
					:id="CalculatorFields.Territory.UPLOAD_FILE"
				>
					<upload-outlined />
					Загрузить файл с территориями
				</ui-button>
			</ui-upload>
		</div>
	</calculator-block>

	<transition-group name="slide-fade-top">
		<calculator-territory
			v-for="(
				{
					city,
					house,
					office,
					street,
					factors,
					assetList,
					cadastralNumber,
					subjectOfFederations,
					selectedTerritoryType
				},
				index
			) in territories"
			:selectedTerritoryType="selectedTerritoryType"
			:subjectOfFederations="subjectOfFederations"
			:cadastralNumber="cadastralNumber"
			:assetList="assetList"
			:factors="factors"
			:office="office"
			:street="street"
			:house="house"
			:city="city"
			:index="index"
			:key="`territory-${index}`"
		/>
	</transition-group>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { calculatorTerritory } from "./"
import { message } from "ant-design-vue"

// Icons
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons-vue"

// Hooks
import { useStore, useError } from "~/hooks"

// Types
import {
	Info,
	Calculator,
	SpectechService,
	CalculatorFields
} from "@common-repo/types/src"
import { PropType } from "@vue/runtime-core"
import { UiUpload as IUiUpload } from "~/types"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.SPECTECH
	}
})

// Store
const { store, infoStore, configStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum
const isUploadingFile = ref<boolean>(false)
const isLoadingDownloadExampleFile = ref<boolean>(false)

// Computed
const isSecurityAssist = computed(() => getField<boolean>("isSecurityAssist"))

const territories = computed((): SpectechService.Territory => {
	return store.getTerritories
})

// Methods
const { errorEmpty } = useError()

function getField<T = string>(fieldName: string): T {
	return store.getField<T>(Calculator.Tab.PAYMENT, "territory", fieldName)
}

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.PAYMENT, "territory", fieldName, value)
}

async function handleChangeUpload(
	info: IUiUpload.UploadChangeParam
): Promise<void> {
	isUploadingFile.value = true

	const displayError = () => {
		message.error("Ошибка загрузки файла")
	}

	if (info.file.status === "error") {
		displayError()

		return
	}

	if (info.file.originFileObj) {
		const { $spectechApi } = useNuxtApp()

		const { IsSuccess, entity: territories } = await $spectechApi.sendFile(
			info.file.originFileObj
		)

		if (IsSuccess) {
			message.success("Файл успешно отправлен")
		}

		if (territories?.length) {
			store.setUploadedTerritories(territories)
		}
	} else {
		displayError()
	}

	isUploadingFile.value = false
}

async function downloadExampleFile(): Promise<void> {
	const { $spectechApi, $downloadBlob } = useNuxtApp()

	isLoadingDownloadExampleFile.value = true

	const blob: Blob = await $spectechApi.downloadExampleFile()

	if (blob) {
		$downloadBlob(blob, "territories")
	}

	isLoadingDownloadExampleFile.value = false
}

function removeFile(): void {
	// todo
}

onMounted(() => {
	Promise.all([
		infoStore.fetchInfo(Info.InfoType.REGIONS),
		infoStore.fetchSubjectsOfFederation(null, props.type),
		infoStore.fetchSpectechFactors(),
		infoStore.fetchMachineryGroups(),
		infoStore.fetchTerritoryTypes()
	])
})
</script>
