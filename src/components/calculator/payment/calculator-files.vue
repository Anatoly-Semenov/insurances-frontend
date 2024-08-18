<template>
	<calculator-block
		:title="title"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__files">
			<ui-radio
				type="button"
				:id="CalculatorFields.Beneficiary.BANK_FINANCE"
				:value="store.getBankFinance"
				:options="bankFinanceOptions"
				@change="store.setBankFinance($event)"
			/>

			<a-table
				class="ui-table calculator__files-table"
				:columns="tableColumns"
				:dataSource="data"
				:rowKey="(row) => Math.random()"
				:pagination="false"
			>
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'name'">
						<p class="calculator__files-name">
							<span class="calculator__files-required" v-if="record.required">
								*
							</span>
							{{ record.name }}

							<ui-alert
								class="calculator__files-egrp"
								:type="Alert.Type.INFO"
								showIcon
								isMessageSlot
								v-if="record.fileName === SmrService.FileName.EXTRACT_FROM_EGRP"
							>
								<template #message>
									Приложите файл из
									<a :href="egrpUrl" target="_blank">ЕГРП</a>
									. Выберите из списка стаж подрядчика
								</template>
							</ui-alert>
						</p>
					</template>

					<template v-if="column.key === 'upload'">
						<div class="calculator__files-upload">
							<ui-upload
								@change="handleChangeUpload($event, record.fileName)"
								@remove="removeFile(record.fileName)"
								:id="`upload-file-${record.fileName}`"
							>
								<ui-button
									type="dashed"
									:loading="loadingFiles.includes(record.fileName)"
								>
									<upload-outlined />
									Выбрать файл
								</ui-button>
							</ui-upload>
							<input
								type="number"
								tabindex="-1"
								class="calculator__files-hidden-input"
								:value="store.getFiles[record.fileName]?.idDoc"
								:id="`file-id-${record.fileName}`"
								@input:value="store.setFileId(record.fileName, $event)"
							/>

							<span class="calculator__files-file">
								{{ store.getFile(record.fileName).name }}
							</span>
						</div>
					</template>

					<template v-if="column.key === 'delete'">
						<ui-tooltip title="Удалить файл">
							<button
								class="calculator__files-delete"
								:id="`delete-file-${record.fileName}`"
								@click="store.resetFile(record.fileName)"
							>
								<delete-outlined />
							</button>
						</ui-tooltip>
					</template>
				</template>
			</a-table>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons-vue"
import ATable from "ant-design-vue/lib/table"

// Types
import { CalculatorFields, Calculator, SmrService } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"
import { UiAlert as Alert } from "~/types"
import type { UiUpload } from "~/types"

// Hooks
import { useCalculatorFiles, useConfig } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

const { egrpUrl } = useConfig()

const {
	bankFinanceOptions,
	handleChangeUpload,
	loadingFiles,
	tableColumns,
	removeFile,
	title,
	store,
	data
} = useCalculatorFiles(props.type)
</script>
