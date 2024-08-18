<template>
	<transition name="slide-fade-top">
		<calculator-block
			title="Данные о выгодоприобретателе"
			:loading="store.getIsLoading"
			:disabled="store.getIsDisabledFields"
			v-if="isDisplayBlock"
		>
			<div class="calculator__beneficiary">
				<div class="calculator__beneficiary-row">
					<ui-radio
						type="button"
						:value="store.getBankFinance"
						:options="bankFinanceOptions"
						:id="Fields.Beneficiary.BANK_FINANCE"
						v-if="!isSpectech"
						@change="store.setBankFinance($event)"
					/>
					<ui-select
						title="Выгодоприобретатель"
						:options="beneficiaryOptions"
						:id="Fields.Beneficiary.BENEFICIARY"
						:value="beneficiary"
						required
					/>
					<ui-input
						title="Территориальный банк"
						:value="territoryBank"
						:error="errorEmpty(territoryBank)"
						:id="Fields.Beneficiary.BENEFICIARY_TER_BANK"
						required
						v-if="isSpectech"
						@input:value="set('territoryBank', $event)"
					>
						<template #suffix>
							<ui-tooltip :title="terBankTooltip">
								<info-circle-outlined />
							</ui-tooltip>
						</template>
					</ui-input>
				</div>

				<transition
					name="slide-fade-top"
					v-for="(
						{
							list,
							title,
							isDisplay,
							itemTitle,
							documentTypeOptions,
							beneficiaryDocumentName
						},
						index
					) in documentTypes"
					:key="`document-${index}`"
				>
					<calculator-block
						class="calculator__beneficiary-credits"
						:title="title"
						:loading="store.getIsLoading"
						:disabled="store.getIsDisabledFields"
						v-if="isDisplay"
					>
						<transition-group name="slide-fade-top" tag="div">
							<div
								class="calculator__beneficiary-credit"
								v-for="(
									{
										customDocumentType,
										documentNumber,
										documentDate,
										documentType,
										isCustomType,
										number
									},
									index
								) in list"
								:key="index"
							>
								<ui-tooltip title="Ручной ввод доп. соглашения">
									<ui-checkbox
										:value="isCustomType"
										:id="`${Fields.Beneficiary.IS_CUSTOM_TYPE}-${index + 1}`"
										@change="
											store.setBeneficiaryData(
												beneficiaryDocumentName,
												index,
												'isCustomType',
												$event
											)
										"
									/>
								</ui-tooltip>

								<ui-input
									title="Документ-основание"
									:value="customDocumentType"
									:error="errorEmpty(customDocumentType)"
									:id="`${Fields.Beneficiary.CUSTOM_DOCUMENT_TYPE}-${
										index + 1
									}`"
									required
									@input:value="
										store.setBeneficiaryData(
											beneficiaryDocumentName,
											index,
											'customDocumentType',
											$event
										)
									"
									v-if="isCustomType"
								/>
								<ui-select
									title="Документ-основание"
									:value="documentType"
									:options="documentTypeOptions"
									:error="errorEmpty(documentType)"
									:id="`${Fields.Beneficiary.DOCUMENT_TYPE}-${index + 1}`"
									required
									@change="
										store.setBeneficiaryData(
											beneficiaryDocumentName,
											index,
											'documentType',
											$event
										)
									"
									v-else
								/>

								<ui-input
									title="Номер документа"
									:value="documentNumber"
									:error="errorEmpty(documentNumber)"
									:id="`${Fields.Beneficiary.DOCUMENT_NUMBER}-${index + 1}`"
									required
									@input:value="
										store.setBeneficiaryData(
											beneficiaryDocumentName,
											index,
											'documentNumber',
											$event
										)
									"
								/>

								<ui-date-picker
									title="От"
									:value="documentDate"
									:error="errorEmpty(documentDate)"
									:id="`${Fields.Beneficiary.DOCUMENT_DATE}-${index + 1}`"
									required
									@change="
										store.setBeneficiaryData(
											beneficiaryDocumentName,
											index,
											'documentDate',
											$event
										)
									"
								/>
								<ui-tooltip
									title="Удалить кредитный договор"
									v-if="list.length > 1"
								>
									<button
										class="calculator__beneficiary-delete"
										:id="`beneficiary-delete-${index + 1}`"
										@click="
											store.deleteBeneficiaryDoc(beneficiaryDocumentName, index)
										"
									>
										<delete-outlined />
									</button>
								</ui-tooltip>
							</div>
						</transition-group>
						<ui-button
							class="calculator__beneficiary-add"
							type="default"
							:id="`beneficiary-add`"
							@click="store.createBeneficiaryDoc(beneficiaryDocumentName)"
						>
							Добавить {{ itemTitle }}
						</ui-button>
					</calculator-block>
				</transition>
			</div>
		</calculator-block>
	</transition>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons-vue"

// Types
import {
	CalculatorFields as Fields,
	Calculator,
	Info
} from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"
import type { UiSelect } from "~/types"

interface DocumentType {
	documentTypeOptions: UiSelect.Options
	beneficiaryDocumentName: string
	isDisplay: boolean
	itemTitle: string
	title: string
	list: any[]
}

// Hooks
import { useStore, useError } from "~/hooks"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Computed
const territoryBank = computed((): string => {
	return getField<string>("territoryBank")
})

const loanAgreementCatalog = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.LOAN_AGREEMENT_CATALOG)
})

const pledgeAgreementCatalog = computed((): UiSelect.Options => {
	return infoStore.getInfo(Info.InfoType.PLEDGE_AGREEMENT_CATALOG)
})

const isSpectech = computed((): boolean => {
	return props.type === Calculator.TypeEnum.SPECTECH
})

const isDisplayBlock = computed((): boolean => {
	return !isSpectech.value || !!store?.getIsPledge
})

const beneficiaryOptions = computed((): UiSelect.Options => {
	if (isSpectech.value) {
		return [
			{
				value: 1,
				label: "Банк"
			}
		]
	}

	return [
		{
			value: 1,
			label: "Страхователь"
		}
	]
})

const documentTypes = computed((): DocumentType[] => {
	const data: DocumentType[] = [
		{
			beneficiaryDocumentName: "beneficiaryDocumentListLoan",
			documentTypeOptions: loanAgreementCatalog.value,
			isDisplay: isSpectech.value || store.getBankFinance,
			itemTitle: "кредитный договор",
			title: "Кредитные договора",
			list: store.getCredits
		}
	]

	if (isSpectech.value) {
		data.unshift({
			beneficiaryDocumentName: "beneficiaryDocumentListPledge",
			documentTypeOptions: pledgeAgreementCatalog.value,
			itemTitle: "страховой договор",
			isDisplay: isSpectech.value,
			title: "Залоговые договора",
			list: store.getPledgeList
		})
	}

	return data
})

// Data
const terBankTooltip: string = `Поле мигрирует в полис в раздел "Выгодоприобретатель"`
const isFetchLists = ref<boolean>(false)
const beneficiary = ref<number>(1)

const bankFinanceOptions: UiSelect.Options = [
	{
		value: 1,
		label: "Финансирование банка"
	},
	{
		value: 0,
		label: "Финансирование банка отсутствует"
	}
]

// Methods
const { errorEmpty } = useError()

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.REGISTRATION, "beneficiary", fieldName, value)
}

function getField<T = string>(fieldName: string): T {
	return store.getFieldRegistration("beneficiary", fieldName)
}

async function fetchInfoLists(): Promise<void> {
	isFetchLists.value = true

	const promises = [infoStore.fetchInfo(Info.InfoType.LOAN_AGREEMENT_CATALOG)]

	if (isSpectech.value) {
		promises.push(infoStore.fetchInfo(Info.InfoType.PLEDGE_AGREEMENT_CATALOG))
	}

	await Promise.all(promises).catch(() => {})

	isFetchLists.value = false
}

onMounted((): void => {
	fetchInfoLists()
})
</script>
