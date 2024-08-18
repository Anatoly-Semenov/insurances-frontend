<template>
	<div class="archive" :class="{ _loading: isLoading }">
		<p class="archive__title">
			<component :is="icon" v-if="icon" />
			Архив сделок /
			<nuxt-link :to="`/${calculatorName}`">{{ title }}</nuxt-link>
		</p>
		<div class="archive__main">
			<div class="archive__main-filter">
				<ui-input
					title="Поиск"
					:value="searchValue"
					:disabled="isLoading"
					id="search"
					@input:value="searchValue = $event"
				/>
				<ui-tabs :value="activeTab" animated @change="setActiveTab">
					<ui-tab
						v-for="(tab, index) in tabs"
						:key="`${index + 1}`"
						:tab="tab"
						:disabled="isLoading"
					/>
				</ui-tabs>
			</div>
			<a-table
				class="ui-table"
				:class="{ _loading: isLoading }"
				:columns="tableColumns"
				:dataSource="data"
				:rowKey="(row) => Math.random()"
				:pagination="pagination"
				@change="handleTableChange"
			>
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'product'">
						<p>
							{{ record.product }}
						</p>
					</template>
					<template v-if="column.key === 'company_name'">
						<p>
							<template v-if="record.company_name">
								{{ record.company_name }}
							</template>
							<template v-else>___</template>
						</p>
					</template>
					<template v-if="column.key === 'date_of_create'">
						<p>
							{{ record.date_of_create }}
						</p>
					</template>
					<template v-if="column.key === 'number_crm'">
						<a :href="generateCrmLink(record.number_crm)" target="_blank">
							{{ record.number_crm }}
						</a>
					</template>

					<template v-if="column.key === 'status'">
						<ui-tag color="green">
							{{ record.status }}
						</ui-tag>
					</template>

					<template v-if="column.key === 'status_crm'">
						<ui-tag color="orange">
							{{ record.status_crm }}
						</ui-tag>
					</template>

					<template v-else-if="column.key === 'id'">
						<nuxt-link
							:to="`/${calculatorName}/${record.id}`"
							:id="`cid_${record.id}`"
						>
							{{ record.id }}
						</nuxt-link>
					</template>

					<template v-else-if="column.key === 'actions'">
						<div class="archive__actions">
							<ui-tooltip title="Скопировать сделку">
								<button
									class="archive__action"
									@click="copyDeal(record.id)"
									:disabled="loadingDeal"
									:id="`copy_${record.id}`"
								>
									<loading-outlined v-if="loadingDeal === record.id" />
									<copy-outlined v-else />
								</button>
							</ui-tooltip>
							<ui-tooltip title="Удалить сделку">
								<button
									class="archive__action _delete"
									@click="showDeleteConfirm(record.id)"
									:id="`trash_${record.id}`"
								>
									<delete-outlined />
								</button>
							</ui-tooltip>
						</div>
					</template>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { createVNode } from "vue"

// Components
import ATable from "ant-design-vue/lib/table"
import { Modal, message } from "ant-design-vue"
import {
	DeleteOutlined,
	CopyOutlined,
	SecurityScanOutlined,
	LoadingOutlined,
	ExclamationCircleOutlined
} from "@ant-design/icons-vue"

// Hooks
import { useCalculatorInsurances, useStore, useConfig } from "~/hooks"

// Mocks
import { archiveList as loadingData } from "~/mocks"

// Types
import { Calculator, DealService } from "@common-repo/types/src"
import type { PropType } from "@vue/runtime-core"
import type { FunctionalComponent } from "vue"
import type { UiTable } from "~/types"

interface TableRow {
	product: string
	id: number | string
	company_name: string
	status: DealService.ArchiveStatusWrong
	status_crm: string
	date_of_create: string
	number_crm: string | number
	actions: string
}

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store } = useStore(props.type)

// Data
const router = useRouter()
const searchValue = ref<string>("")
const activeTab = ref<string>("3")
const tabs: string[] = ["Черновик", "Завершены", "Все расчеты"]
const insurance = ref<any>(null)
const calculatorName = ref<Calculator.Type>(Calculator.TypeEnum.CYBER)
const isLoading = ref<boolean>(false)
const loadingDeal = ref<number | string>(0)

const tableColumns: UiTable.Column[] = [
	{
		title: "Продукт",
		dataIndex: "product",
		key: "product",
		slots: { title: "product" },
		scopedSlots: { customRender: "product" },
		align: "left"
	},
	{
		title: "id",
		dataIndex: "id",
		key: "id",
		scopedSlots: { customRender: "id" },
		align: "center"
	},
	{
		title: "Назание компании",
		dataIndex: "company_name",
		key: "company_name",
		scopedSlots: { customRender: "company_name" },
		align: "center"
	},
	{
		title: "Статус",
		dataIndex: "status",
		key: "status",
		scopedSlots: { customRender: "status" },
		align: "center"
	},
	{
		title: "Статус CRM",
		dataIndex: "status_crm",
		key: "status_crm",
		scopedSlots: { customRender: "status_crm" },
		align: "center"
	},
	{
		title: "Дата создания",
		dataIndex: "date_of_create",
		key: "date_of_create",
		scopedSlots: { customRender: "date_of_create" },
		align: "center"
	},
	{
		title: "№ сделки в crm",
		dataIndex: "number_crm",
		key: "number_crm",
		scopedSlots: { customRender: "number_crm" },
		align: "center"
	},
	{
		title: "",
		dataIndex: "actions",
		key: "actions",
		scopedSlots: { customRender: "actions" },
		align: "left"
	}
]

// Computed
const title = computed((): string => {
	return insurance.value?.name || ""
})

const icon = computed((): FunctionalComponent | false => {
	return insurance.value?.icon || false
})

const data = computed((): TableRow[] => {
	const dealsIncoming = isLoading.value ? loadingData : store.getDeals

	let deals: TableRow[] = prepareTableData(dealsIncoming)

	// Set active tab
	deals = serActiveTabToTableData(deals)
	// Set search value
	deals = setSearchToTableData(deals)

	return deals
})

const pagination = computed(() => {
	if (data.value?.length > 10) {
		return {}
	}

	return false
})

// Methods
function handleTableChange(event: any): void {}

const { getInsuranceByName } = useCalculatorInsurances()

async function copyDeal(id: string | number): Promise<void> {
	loadingDeal.value = id
	await store.copyDeal(id)
	loadingDeal.value = 0

	const path: string = getInsuranceByName(calculatorName.value)!.path

	router.push(path)

	{
		const { $event } = useNuxtApp()

		$event.copyDeal(props.type)
	}
}

function showDeleteConfirm(id: string): void {
	Modal.confirm({
		class: "ui-modal",
		title: "Вы действительно хотите удалить сделку",
		icon: createVNode(ExclamationCircleOutlined),
		content: `ID сделки - ${id}`,
		okText: "Да",
		okType: "danger",
		cancelText: "Нет",
		async onOk(): Promise<void> {
			try {
				await store.deleteDeal(id)
				message.success(`Сделка с id ${id} успешно удалена`)

				{
					const { $event } = useNuxtApp()

					$event.removeDeal(props.type)
				}
			} catch (error) {
				message.error(error as string)
			}
		}
	})
}

function prepareTableData(deals: DealService.ArchiveDeal[]): TableRow[] {
	return deals.map(
		({
			cid,
			crm,
			date,
			name,
			statusCrm,
			statusWrong,
			type
		}: DealService.ArchiveDeal) => {
			return {
				product: type,
				id: cid,
				company_name: name,
				status: statusWrong,
				status_crm: statusCrm,
				date_of_create: date,
				number_crm: crm,
				actions: ""
			}
		}
	)
}

function serActiveTabToTableData(deals: TableRow[]): TableRow[] {
	switch (activeTab.value) {
		case "1":
			return deals.filter(
				({ status }) => status === DealService.ArchiveStatusWrong.IN_PROCESS
			)
		case "2":
			return deals.filter(
				({ status }) => status === DealService.ArchiveStatusWrong.FINISHED
			)
		default:
			return deals
	}
}

function setSearchToTableData(deals: TableRow[]): TableRow[] {
	if (searchValue.value) {
		const searchFactory = (value: string): boolean => {
			return value.toLowerCase().includes(searchValue.value.toLowerCase())
		}

		return deals.filter(
			({
				company_name,
				id,
				date_of_create,
				number_crm,
				product,
				status,
				status_crm
			}) => {
				return (
					searchFactory(company_name) ||
					searchFactory(date_of_create) ||
					searchFactory(status) ||
					searchFactory(status_crm) ||
					searchFactory(id + "") ||
					searchFactory(number_crm + "") ||
					searchFactory(product)
				)
			}
		)
	}

	return deals
}

function generateCrmLink(id: number | string): string {
	const dealEndpoint: string = "crm/deal/details"
	const { crmUrl } = useConfig()

	return `${crmUrl}/${dealEndpoint}/${id}`
}

function setActiveTab(value: string): void {
	activeTab.value = value

	{
		const { $event } = useNuxtApp()

		switch (value) {
			case "1":
				$event.showDrafts(props.type)
				break
			case "2":
				$event.showWins(props.type)
				break
			case "3":
				$event.showAll(props.type)
				break
			default:
				break
		}
	}
}

onMounted(async () => {
	store.setCalculatorType(props.type)

	{
		const route = useRoute()
		calculatorName.value = route.fullPath.slice(1, -8) as Calculator.Type

		insurance.value = getInsuranceByName(calculatorName.value)
	}

	{
		const { $event } = useNuxtApp()

		$event.goArchive(props.type)
	}

	isLoading.value = true
	await store.fetchDeals()
	isLoading.value = false
})
</script>
