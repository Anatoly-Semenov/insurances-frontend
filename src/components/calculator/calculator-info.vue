<template>
	<div
		class="calculator__info"
		:class="{ _fixed: isFixed, _inversion: isInversion }"
	>
		<div class="calculator__info-content">
			<ui-button
				class="calculator__info-old"
				@click="toOldCalculator(oldPath)"
				type="dashed"
				id="old-calculator-version"
				:id="Calculator.Id.Button.OLD_CALCULATOR_VERSION"
				:key="Calculator.Id.Button.OLD_CALCULATOR_VERSION"
				v-if="isOldVersion"
			>
				<template #icon>
					<retweet-outlined />
				</template>
				Прошлая версия калькулятора
			</ui-button>

			<transition name="fade-in">
				<ui-alert
					:message="preApprovementMessage"
					:type="Alert.Type.SUCCESS"
					showIcon
					v-if="isPreApprovement && !isInversion"
				/>
			</transition>

			<calculator-total :type="type" />
			<calculator-intro :type="type" />

			<calculator-info-buttons :type="type" v-if="!isInversion" />
		</div>
		<transition name="fade-in">
			<ui-alert
				:message="preApprovementMessage"
				:type="Alert.Type.SUCCESS"
				showIcon
				v-if="isPreApprovement && isInversion"
			/>
		</transition>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()

// Icons
import { RetweetOutlined } from "@ant-design/icons-vue"

// Components
const calculatorTotal = defineAsyncComponent(
	() => import("./calculator-total.vue")
)
const calculatorIntro = defineAsyncComponent(
	() => import("./calculator-intro.vue")
)
const calculatorInfoButtons = defineAsyncComponent(
	() => import("./calculator-info-buttons.vue")
)

// Hooks
import { useCalculatorInsurances, useCalculatorOld, useStore } from "~/hooks"

// Types
import type { PropType } from "@vue/runtime-core"
import { Calculator } from "@common-repo/types/src"
import { UiAlert as Alert } from "~/types"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Calculator.Type>,
		default: Calculator.TypeEnum.CYBER
	},
	isFixed: {
		type: Boolean,
		default: false
	}
})

// Store
const { store, settingsStore } = useStore(props.type)

// Data
const isCalculation = ref<boolean>(false)
const types = Calculator.TypeEnum
const oldPath = ref<string>("")

onMounted(() => {
	setIsCalculation()
})
watchEffect(() => {
	setIsCalculation()
})

// Computed
const isOldVersion = computed((): boolean => {
	const excludeCalculators: Calculator.Type[] = [
		Calculator.TypeEnum.OSAGO_SPECTECH
	]

	return !isInversion.value && !excludeCalculators.includes(props.type)
})

const isPreApprovement = computed((): boolean => {
	return (
		props.type === Calculator.TypeEnum.KASCO && !!store?.getIsPreApprovement
	)
})

const isInversion = computed((): boolean => {
	return settingsStore.getIsInversion
})

const preApprovementMessage = computed((): string => {
	const grade: string = store.getPreApprovementGrade

	const gradeText: string = grade ? `Грейд: ${grade}` : "Нет данных по грейду"

	return isPreApprovement.value
		? `Предодобренный ИНН. ${gradeText}`
		: "Не предодобренный ИНН"
})

// Methods
const { getInsuranceByName } = useCalculatorInsurances()
const { toOldCalculator } = useCalculatorOld(props.type)

function setIsCalculation(): void {
	if (route.query?.tab === "payment" && !isCalculation.value) {
		isCalculation.value = true
	} else if (isCalculation.value) {
		isCalculation.value = false
	}
}

function setOldPath(): void {
	oldPath.value =
		getInsuranceByName(props.type as Calculator.Type)?.oldPath || ""
}

onMounted(() => {
	setOldPath()
})
</script>
