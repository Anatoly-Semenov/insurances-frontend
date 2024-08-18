<template>
	<calculator-block
		title="Данные для CRM"
		:loading="store.getIsLoading"
		:disabled="store.getIsDisabledFields"
	>
		<div class="calculator__contract">
			<ui-select
				title="Тип клиента"
				:options="clientTypeOptions"
				:value="clientType"
				:error="errorEmpty(clientType)"
				required
				:key="Fields.CRM.CLIENT_TYPE"
				:id="Fields.CRM.CLIENT_TYPE"
				@change="set('clientType', $event)"
			/>
			<ui-select
				title="Территориальный банк"
				:options="terBankOptions"
				:value="terBank"
				:error="errorEmpty(terBank)"
				required
				:key="Fields.CRM.TER_BANK"
				:id="Fields.CRM.TER_BANK"
				@change="setTerBank"
			/>
			<ui-select
				title="ГОСБ / ОСБ"
				:disabled="isGosbDisabled"
				:loading="isGosbLoading"
				:options="gosbOptions"
				:value="+gosb"
				:error="errorEmpty(gosb)"
				required
				:key="Fields.CRM.GOSB"
				:id="Fields.CRM.GOSB"
				@change="set('gosb', $event)"
			/>
			<ui-select
				title="Тип клиента банка / Сегмент"
				:options="segmentOptions"
				:value="clientTypeBank"
				:error="errorEmpty(clientTypeBank)"
				required
				:key="Fields.CRM.CLIENT_TYPE_BANK"
				:id="Fields.CRM.CLIENT_TYPE_BANK"
				@change="set('clientTypeBank', $event)"
			/>
			<ui-input
				title="Номер ВСП в формате ОСБ/ВСП"
				:value="numberVsp"
				:error="errorEmpty(numberVsp)"
				:key="Fields.CRM.VSP"
				:id="Fields.CRM.VSP"
				@input:value="set('numberVsp', $event)"
			/>
			<ui-input
				title="ФИО КМ/КИ"
				:value="fullName"
				:error="errorFioKM(fullName)"
				required
				:key="Fields.CRM.FIO_KM"
				:id="Fields.CRM.FIO_KM"
				@input:value="setFullName"
			/>
			<ui-input
				title="Табельный номер КМ/КИ"
				:value="personnelNumber"
				:error="!isTabelDisabled && errorTabelNumberKM(personnelNumber)"
				required
				:disabled="isTabelDisabled"
				:key="Fields.CRM.TN_KM"
				:id="Fields.CRM.TN_KM"
				@input:value="set('personnelNumber', $event)"
				@focusout="focusoutTabel"
			/>
		</div>
	</calculator-block>
</template>

<script setup lang="ts">
// Components
import { calculatorBlock } from "~/components/calculator"

// Hooks
import { useStore, useError, useDeal } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import type { UiSelect } from "~/types"
import {
	Calculator,
	CalculatorFields as Fields,
	Info
} from "@common-repo/types/src"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	}
})

// Store
const { store, infoStore } = useStore(props.type)

// Data
const isGosbLoading = ref<boolean>(false)
const { isDetail } = useDeal()

function getField(fieldName: string): string {
	return store.getFieldRegistration("contract", fieldName)
}

// Computed
const clientType = computed((): string => getField("clientType"))
const terBank = computed((): string => getField("terBank"))
const gosb = computed((): string => getField("gosb"))
const clientTypeBank = computed((): string => getField("clientTypeBank"))
const numberVsp = computed((): string => getField("numberVsp"))
const fullName = computed((): string => getField("fullName"))
const personnelNumber = computed((): string => getField("personnelNumber"))

const isGosbDisabled = computed((): boolean => {
	return !terBank.value || isGosbLoading.value
})
const isTabelDisabled = computed((): boolean => {
	return fullName?.value?.toLowerCase() === "нет км"
})

const clientTypeOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.CLIENT_TYPES)
})
const terBankOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.TER_BANKS)
})
const segmentOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.SEGMENTS)
})
const gosbOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.GOSB)
})

// Methods
const { errorEmpty, errorFioKM, errorTabelNumberKM } = useError()

function set(fieldName: string, value: any): void {
	store.setData(Calculator.Tab.REGISTRATION, "contract", fieldName, value)
}

function setFullName(value: string): void {
	set("fullName", value)
	set("personnelNumber", "")

	if (isTabelDisabled.value) {
		set("personnelNumber", "нет КМ")
	}
}

async function setTerBank(value: any) {
	set("terBank", value)
	set("gosb", "")

	isGosbLoading.value = true
	await infoStore.fetchGosb(value)
	isGosbLoading.value = false
}

function focusoutTabel(): void {
	const tabel: string[] = [...`${personnelNumber.value}`]
	const maxValue: number = 8

	const length: number = tabel.length

	if (length < 8) {
		for (let index = 0; index < maxValue - length; index++) {
			tabel.unshift("0")
		}
	}

	set("personnelNumber", tabel.join(""))
}

onMounted(async () => {
	await Promise.all([
		infoStore.fetchInfo(Info.InfoType.SEGMENTS),
		infoStore.fetchInfo(Info.InfoType.TER_BANKS)
	])

	setTimeout(() => {
		if (isDetail.value) {
			infoStore.fetchInfo(Info.InfoType.CLIENT_TYPES)
		} else if (!isGosbDisabled.value) {
			if (terBank.value) infoStore.fetchGosb(terBank.value)
		}
	}, 1)
})
</script>
