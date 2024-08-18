<template>
	<calculator-block
		title="Второй документ"
		description="Иностранного гражданина"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__foreigner">
			<ui-select
				title="Тип документа"
				:options="secondDocumentOptions"
				:value="documentType"
				:required="isForeignerDocumentType"
				:key="Fields.Foreigner.SECOND_DOCUMENT"
				:id="Fields.Foreigner.SECOND_DOCUMENT"
				@change="setForeignerData('documentType', $event, index)"
			/>
			<template v-if="documentType">
				<ui-input
					title="Серия и номер"
					:value="seriesAndNumber"
					:error="errorEmpty(seriesAndNumber)"
					:required="isForeignerSeriesAndNumber"
					:key="Fields.Foreigner.RESIDENCE_PERMIT_SERIA_NUMBER"
					:id="Fields.Foreigner.RESIDENCE_PERMIT_SERIA_NUMBER"
					@input:value="setForeignerData('seriesAndNumber', $event, index)"
				/>
				<transition name="fade-in">
					<ui-input
						title="Кем выдан"
						v-if="documentType !== Info.SecondDocumentType.MIGRATION_CARD"
						:value="issuedBy"
						:error="errorEmpty(issuedBy)"
						:required="isForeignerIssuedBy"
						:key="Fields.Foreigner.RESIDENCE_PERMIT_OFFICE"
						:id="Fields.Foreigner.RESIDENCE_PERMIT_OFFICE"
						@input:value="setForeignerData('issuedBy', $event, index)"
					/>
				</transition>
				<ui-date-picker
					title="Дата выдачи"
					:value="dateOfIssue"
					:required="isForeignerDateOfIssue"
					:key="Fields.Foreigner.RESIDENCE_PERMIT_DATE"
					:id="Fields.Foreigner.RESIDENCE_PERMIT_DATE"
					@change="setDateOfIssue"
				/>
				<ui-date-picker
					title="Срок действия с"
					:value="validFrom"
					:required="isForeignerValidFrom"
					:key="Fields.Foreigner.RESIDENCE_PERMIT_DATE_SINCE"
					:id="Fields.Foreigner.RESIDENCE_PERMIT_DATE_SINCE"
					@change="setForeignerData('validFrom', $event, index)"
				/>
				<ui-date-picker
					title="Срок действия по"
					:value="validTo"
					:required="isForeignerValidityPeriodEnd"
					:key="Fields.Foreigner.RESIDENCE_PERMIT_DATE_TO"
					:id="Fields.Foreigner.RESIDENCE_PERMIT_DATE_TO"
					@change="setForeignerData('validTo', $event, index)"
				/>
				<transition name="fade-in">
					<ui-input
						title="Вид деятельности"
						v-if="documentType === Info.SecondDocumentType.WORK_PERMIT"
						:value="kindOfActivity"
						:error="errorEmpty(kindOfActivity)"
						:required="isForeignerKindOfActivity"
						:key="Fields.Foreigner.WORK_PERMIT_ACTIVITY_TYPE"
						:id="Fields.Foreigner.WORK_PERMIT_ACTIVITY_TYPE"
						@input:value="setForeignerData('kindOfActivity', $event, index)"
					/>
				</transition>
			</template>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Types
import type { PropType } from "@vue/runtime-core"
import {
	Calculator,
	CalculatorFields as Fields,
	Info
} from "@common-repo/types/src"

// Hooks
import { useStore, useError, useCalculatorRequired } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	},
	index: {
		type: Number,
		default: 0
	}
})

// Store
const { store, configStore, infoStore } = useStore(props.type)

// Data
const secondDocumentOptions = infoStore.getInfo(
	Info.InfoTypeStatic.SECOND_DOCUMENT,
	"static"
)

// Computed
const {
	isForeignerValidityPeriodEnd,
	isForeignerSeriesAndNumber,
	isForeignerKindOfActivity,
	isForeignerDocumentType,
	isForeignerDateOfIssue,
	isForeignerValidFrom,
	isForeignerIssuedBy
} = useCalculatorRequired(props.type)

const arrayIndex = computed((): number => props.index - 1)

const documentType = computed((): Info.SecondDocumentType => {
	return store.getFieldForeigner("documentType", arrayIndex.value)
})

const seriesAndNumber = computed(() =>
	store.getFieldForeigner("seriesAndNumber", arrayIndex.value)
)
const issuedBy = computed(() =>
	store.getFieldForeigner("issuedBy", arrayIndex.value)
)
const dateOfIssue = computed(() =>
	store.getFieldForeigner("dateOfIssue", arrayIndex.value)
)
const validFrom = computed(() =>
	store.getFieldForeigner("validFrom", arrayIndex.value)
)
const validTo = computed(() =>
	store.getFieldForeigner("validTo", arrayIndex.value)
)
const kindOfActivity = computed(() =>
	store.getFieldForeigner("kindOfActivity", arrayIndex.value)
)

// Methods
const { errorEmpty } = useError()

function setForeignerData(
	fieldName: string,
	value: string | number,
	index: number
): void {
	store.setForeignerData(fieldName, value, index - 1)
}

function setDateOfIssue(value: string) {
	const { $dayjs } = useNuxtApp()

	setForeignerData("dateOfIssue", value, props.index)
	setForeignerData("validFrom", value, props.index)

	const validTo = $dayjs(value, configStore.getFormatDates)
		.add(20, "year")
		.format(configStore.getFormatDates)

	setForeignerData("validTo", validTo, props.index)
}
</script>
