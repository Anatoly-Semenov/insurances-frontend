<template>
	<div
		class="calculator__fertility"
		:class="{
			_first: componentType === AgroService.FertilityComponentType.FERTILITY,
			_fullscreen: isFullScreen,
			_empty: !isEmergencyRisk || !cultures?.length,
			_open: isOpenBlock
		}"
	>
		<calculator-block
			:title="title"
			class="calculator__fertility-block"
			:loading="store.getIsLoading"
			:disabled="store.getIsDisabledFields"
		>
			<template #header>
				<div class="calculator__block-buttons">
					<ui-checkbox
						:value="isEmergencyRisk"
						v-if="isEmergency"
						@change="store.toggleEmergencyRisk"
					>
						Рассчитать риск ЧС
					</ui-checkbox>

					<template v-if="isEmergencyRisk">
						<button
							class="calculator__block-button"
							:class="{ _open: isOpenBlock }"
							@click="isOpenBlock = !isOpenBlock"
							v-if="!isFullScreen"
						>
							<down-outlined />
						</button>

						<button
							class="calculator__block-button"
							@click=";(isFullScreen = !isFullScreen), (isOpenBlock = true)"
							:id="Fields.Motor.TOGGLE_FULL_SCREEN"
						>
							<fullscreen-exit-outlined v-if="isFullScreen" />
							<fullscreen-outlined v-else />
						</button>
					</template>
				</div>
			</template>

			<div class="calculator__fertility-container">
				<ui-button
					@click="store.addCulture"
					type="default"
					v-if="isEmergencyRisk && isOpenBlock"
				>
					Добавить культуру
				</ui-button>
			</div>
		</calculator-block>
		<transition name="slide-fade-top">
			<a-table
				class="ui-table"
				:class="{ _loading: isLoading }"
				:columns="tableColumns"
				:dataSource="cultures"
				:pagination="pagination"
				:rowKey="(row) => row.id"
				:scroll="{ x: isFullScreen ? false : tableWidth }"
				v-if="isEmergencyRisk && isOpenBlock"
			>
				<template #bodyCell="{ column, record, index }">
					<template v-if="textFields.includes(column.key)">
						<p :id="`${column.key}-${index + 1}`">
							{{ store.getCultureValue(index, column.key) }}
						</p>
					</template>

					<template v-if="column.key === 'id'">
						<p :id="`id-${index + 1}`">{{ index + 1 }}</p>
					</template>

					<template v-if="column.key === 'bindingId'">
						<ui-tooltip
							:title="isBindingDisabled ? 'выберите регион страхования' : false"
						>
							<ui-select
								:options="bindingOptions"
								:value="store.getCultureValue(index, 'bindingId')"
								:disabled="isBindingDisabled"
								@change="store.setCultureValue(index, 'bindingId', $event)"
								:id="`${Fields.Agro.BINDING_ID}-${index + 1}`"
							/>
						</ui-tooltip>
					</template>

					<template v-if="column.key === 'cultureName'">
						<ui-input
							:value="store.getCultureValue(index, 'cultureName')"
							@input:value="store.setCultureValue(index, 'cultureName', $event)"
							:id="`${Fields.Agro.CULTURE_NAME}-${index + 1}`"
						/>
					</template>

					<template v-for="field in numberFields">
						<ui-input-number
							:value="store.getCultureValue(index, field)"
							@input:value="store.setCultureValueNumber(index, field, $event)"
							:id="`${field}-${index + 1}`"
							v-if="column.key === field"
						/>
					</template>

					<template v-if="column.key === 'relationInsuranceSumToCost'">
						<ui-input-number
							:value="
								store.getCultureValue(index, 'relationInsuranceSumToCost')
							"
							:error="
								errorRelationInsuranceSumToCost(
									store.getCultureValue(index, 'relationInsuranceSumToCost'),
									store.getCultureValue(index, 'bindingId')
								)
							"
							@input:value="
								store.setCultureValueNumber(
									index,
									'relationInsuranceSumToCost',
									$event
								)
							"
							:id="`${Fields.Agro.RELATION_INSURANCE_SUM_TO_COST}-${index + 1}`"
						/>
					</template>

					<template v-if="column.key === 'franchise'">
						<ui-select
							:options="franchiseOptions"
							:value="store.getCultureValue(index, 'franchise')"
							:id="`${Fields.Agro.FRANCHISE}-${index + 1}`"
							@change="store.setCultureValue(index, 'franchise', $event)"
						/>
					</template>

					<template v-if="column.key === 'franchisesEmergencyRisk'">
						<ui-select
							:options="franchiseOptions"
							:value="store.getCultureValue(index, 'franchisesEmergencyRisk')"
							:id="`${Fields.Agro.FRANCHISE_EMERGENCY_RISK}-${index + 1}`"
							@change="
								store.setCultureValue(index, 'franchisesEmergencyRisk', $event)
							"
						/>
					</template>

					<template v-for="number in 5">
						<ui-input
							v-if="column.key === `year${number}`"
							:value="store.getCultureValue(index, `year${number}`)"
							:id="`year${number}`"
							@input:value="
								store.setCultureValue(index, `year${number}`, $event)
							"
						/>
					</template>

					<template v-if="column.key === 'delete'">
						<button
							class="calculator__fertility-delete"
							@click="showDelete(index)"
							:id="`delete-${index + 1}`"
						>
							<delete-outlined />
						</button>
					</template>
				</template>
			</a-table>
		</transition>
	</div>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"
import ATable from "ant-design-vue/lib/table"

// Hooks
import { useCalculatorFertility } from "~/hooks"

// Types
import { PropType } from "@vue/runtime-core"
import {
	CalculatorFields as Fields,
	Calculator,
	AgroService
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.AGRO
	},
	componentType: {
		type: String as PropType<AgroService.FertilityComponentType>,
		default: AgroService.FertilityComponentType.FERTILITY
	}
})

const {
	errorRelationInsuranceSumToCost,
	FullscreenExitOutlined,
	FullscreenOutlined,
	isBindingDisabled,
	franchiseOptions,
	isEmergencyRisk,
	DeleteOutlined,
	bindingOptions,
	DownOutlined,
	numberFields,
	isFullScreen,
	tableColumns,
	isOpenBlock,
	isEmergency,
	showDelete,
	errorEmpty,
	tableWidth,
	textFields,
	countYear,
	infoStore,
	isLoading,
	cultures,
	title,
	types,
	store
} = useCalculatorFertility(props.type, props.componentType)

onMounted(() => {
	if (store.getRegion) {
		infoStore.fetchBindingsByRegionId(store.getRegion)
	}
})
</script>
