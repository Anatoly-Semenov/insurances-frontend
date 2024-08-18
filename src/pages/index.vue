<template>
	<div class="index">
		<div class="index__radial _top" :class="{ _orange: width > 1000 }" />
		<div class="index__radial _bottom" />

		<div class="index__intro">
			<div class="index__info">
				<logo class="index__info-logo" />
				<p class="index__info-title">страховой брокер</p>
				<p class="index__info-subtitle">
					WEB-Витрина страховых продуктов имущественного страхования для ИП и
					юр. лиц.
				</p>
				<div class="index__info-buttons">
					<ui-button @click="comingSoon">Как начать?</ui-button>
					<ui-button
						@click="toOldVersion"
						type="default"
						:id="Calculator.Id.Button.OLD_APP_VERSION_INDEX"
						:key="Calculator.Id.Button.OLD_APP_VERSION_INDEX"
					>
						Прошлая версия
					</ui-button>
				</div>
			</div>

			<img
				class="index__intro-img"
				src="~/assets/img/landing.png"
				alt="img"
				v-if="width > 1000"
			/>
		</div>

		<div class="index__insurances">
			<index-insurance
				v-for="(data, index) in insurances"
				:key="index"
				:data="data"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
// Icons
import logo from "~/assets/img/logo.svg"

// Components
import { message } from "ant-design-vue"
import indexInsurance from "~/components/index/index-insurance.vue"

// Hooks
import { useCalculatorInsurances, useCalculatorOld } from "~/hooks"

// Types
import { Calculator } from "@common-repo/types/src"

definePageMeta({
	middleware: ["auth"]
})

const { insurances } = useCalculatorInsurances()
const { toOldVersion } = useCalculatorOld()
const { width } = useWindowSize()

function comingSoon() {
	message.info("Скоро эта кнопка будет работать")
}
</script>
