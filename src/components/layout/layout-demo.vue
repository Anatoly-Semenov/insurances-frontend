<template>
	<div class="layout__demo">
		<p class="layout__demo-text">🎉 Это альфа-версия новых калькуляторов</p>
		<ui-button
			size="small"
			type="default"
			@click="toOldVersion"
			:id="Calculator.Id.Button.OLD_APP_VERSION"
			:key="Calculator.Id.Button.OLD_APP_VERSION"
		>
			Вернуться в прошлую версию
		</ui-button>
	</div>
</template>

<script lang="ts" setup>
// Hooks
import { useCalculatorOld } from "~/hooks"

// Types
import { Calculator } from "@common-repo/types/src"

// Methods
const { toOldVersion } = useCalculatorOld()
</script>
