<template>
	<div class="calculator__assets">
		<template v-if="territories.length">
			<calculator-asset
				v-for="(
					{
						incompleteConstructionType,
						selectedIndustryActivity,
						subjectOfFederation,
						conservationType,
						insuranceObjects,
						selectedIndustry,
						federalDistrict,
						sogazRiskClass,
						yearOfBuilding,
						populationArea,
						InsuranceRiskClass,
						realtyType,
						assetList,
						address,
						factors,
						realty,
						area
					},
					index
				) in territories"
				:incompleteConstructionType="incompleteConstructionType"
				:selectedIndustryActivity="selectedIndustryActivity"
				:subjectOfFederation="subjectOfFederation"
				:selectedIndustry="selectedIndustry"
				:conservationType="conservationType"
				:insuranceObjects="insuranceObjects"
				:isLoadingDeal="store.getIsLoading"
				:federalDistrict="federalDistrict"
				:sogazRiskClass="sogazRiskClass"
				:yearOfBuilding="yearOfBuilding"
				:populationArea="populationArea"
				:InsuranceRiskClass="InsuranceRiskClass"
				:realtyType="realtyType"
				:assetList="assetList"
				:address="address"
				:factors="factors"
				:realty="realty"
				:number="index"
				:area="area"
			/>
		</template>

		<div class="calculator__assets-empty" v-else>
			<ui-result
				title="Список территорий пуст"
				subTitle="Добавьте первую территорию"
				status="404"
			>
				<template #extra>
					<ui-button @click="store.addTerritory">Добавить территорию</ui-button>
				</template>
			</ui-result>
		</div>

		<transition name="slide-fade-top">
			<div class="calculator__assets-buttons" v-if="territories.length">
				<div
					class="calculator__assets-button"
					v-for="(
						{ isLoading, action, text, type, icon, component }, index
					) in buttons"
				>
					<ui-upload
						v-if="component === 'ui-upload'"
						@change="uploadFileWithTerritories"
					>
						<ui-button
							:disabled="store.getIsLoading"
							:loading="isLoading?.value"
							:key="index + text"
							:type="type"
						>
							<component v-if="icon" :is="icon" />
							{{ text }}
						</ui-button>
					</ui-upload>

					<component
						v-else
						:disabled="store.getIsLoading"
						:loading="isLoading?.value"
						:key="index + text"
						:is="component"
						:type="type"
						@click="action"
					>
						<component v-if="icon" :is="icon" />
						{{ text }}
					</component>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
// Icons
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons-vue"

// Components
import { message } from "ant-design-vue"
import { calculatorBlock } from "~/components/calculator"
import { calculatorAsset } from "~/components/calculator/payment"

// Hooks
import { useStore, useError } from "~/hooks"

// Mocks
import { assetTerritory as emptyTerritory } from "~/mocks"

// Types
import {
	AssetService,
	UiButton as IUiButton,
	UiUpload as IUiUpload
} from "~/types"
import { PropType } from "@vue/runtime-core"
import { Calculator, Info } from "@common-repo/types/src"

interface Button {
	isLoading?: Ref<boolean>
	icon: Component | null
	type: IUiButton.Type
	component: string
	action: unknown
	text: string
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.ASSET
	}
})

// Store
const { store, infoStore, configStore } = useStore(props.type)

// Data
const types = Calculator.TypeEnum

const isDownloadingTerritoriesFile = ref<boolean>(false)
const isUploadingTerritoriesFile = ref<boolean>(false)

// Computed
const territories = computed((): AssetService.Territory[] => {
	return store.getIsLoading && store.getTerritories.length <= 1
		? [emptyTerritory]
		: store.getTerritories
})

const buttons: Button[] = [
	{
		type: IUiButton.TypeEnum.PRIMARY,
		text: "Добавить территорию",
		component: "ui-button",
		icon: null,
		action() {
			store.addTerritory
		}
	},
	{
		isLoading: isUploadingTerritoriesFile,
		text: "Загрузить файл с территориями",
		action: uploadFileWithTerritories,
		type: IUiButton.TypeEnum.DEFAULT,
		component: "ui-upload",
		icon: UploadOutlined
	},
	{
		isLoading: isDownloadingTerritoriesFile,
		text: "Скачать файл для заполнения",
		type: IUiButton.TypeEnum.LINK,
		action: downloadExampleFile,
		component: "ui-button",
		icon: DownloadOutlined
	}
]

// Methods
const { errorEmpty } = useError()

async function fetchInfoLists() {
	const infoList: Array<keyof typeof Info.InfoType> = [
		"INCOMPLETE_CONSTRUCTION_TYPES",
		"ASSET_INSURANCE_OBJECTS",
		"FEDERAL_DISTRICTS",
		"CONSERVATION_TYPE",
		"ASSET_INDUSTRIES",
		"ASSET_FACTORS",
		"REALTY_TYPE",
		"REALTY"
	]

	const promises: Promise<void>[] = []

	for (const info of infoList) {
		promises.push(infoStore.fetchInfo(Info.InfoType[info]))
	}

	await Promise.all(promises)
}

async function downloadExampleFile(): Promise<void> {
	isDownloadingTerritoriesFile.value = true
	await store.downloadExampleFile()
	isDownloadingTerritoriesFile.value = false
}

async function uploadFileWithTerritories(
	info: IUiUpload.UploadChangeParam
): Promise<void> {
	isUploadingTerritoriesFile.value = true

	const displayError = () => {
		message.error("Ошибка загрузки файла")
	}

	if (info.file.status === "error") {
		displayError()

		return
	}

	const file: Blob | undefined = info?.file?.originFileObj

	if (file) {
		await store.uploadFileWithTerritories(file)
	} else {
		displayError()
	}

	isUploadingTerritoriesFile.value = false
}

onMounted(() => {
	fetchInfoLists()
})
</script>
