<template>
	<div class="ui-kit">
		<div class="ui-kit__docs">
			<button @click="toAntDesign">
				<img src="~/assets/img/ant-logo.png" alt="logo" />
			</button>
			<ui-button type="link" @click="toAntDesign">Move to docs</ui-button>
		</div>
		<div class="ui-kit__container">
			<ui-kit-item title="ui-avatar">
				<ui-avatar size="large" :src="avatar" />
			</ui-kit-item>

			<ui-kit-item title="ui-button">
				<ui-button>New button</ui-button>
			</ui-kit-item>

			<ui-kit-item title="ui-modal">
				<ui-button @click="isModal = true" :key="isModal">Open Modal</ui-button>
				<ui-modal
					title="Title"
					:visible="isModal"
					@cancel:visible="isModal = false"
					@ok:visible="isModal = false"
				>
					{{ loremIpsum }}
				</ui-modal>
			</ui-kit-item>

			<ui-kit-item title="ui-checkbox">
				<ui-checkbox
					@change="isChecked = $event"
					:value="isChecked"
					type="checkbox"
				>
					{{ isChecked }}
				</ui-checkbox>
			</ui-kit-item>

			<ui-kit-item title="ui-input">
				<ui-input
					title="title"
					:value="inputValue"
					@input:value="inputValue = $event"
				/>
			</ui-kit-item>

			<ui-kit-item title="ui-input-number">
				<ui-input-number
					title="title"
					:value="inputNumberValue"
					@input:value="inputNumberValue = $event"
					isAddonBefore
					isAddonAfter
				>
					<template #addonBefore>Price</template>
					<template #addonAfter>$</template>
				</ui-input-number>
			</ui-kit-item>

			<ui-kit-item title="ui-date-picker">
				<ui-date-picker
					title="Выберите дату"
					:value="datePickerValue"
					@input:value="datePickerValue = $event"
				/>
			</ui-kit-item>

			<ui-kit-item title="ui-select">
				<ui-select
					title="Select"
					:options="selectOptions"
					:value="selectValue"
					@change="selectValue = $event"
				/>
			</ui-kit-item>

			<ui-kit-item title="ui-radio">
				<ui-radio
					type="button"
					:value="radioValue"
					:options="radioOptions"
					@change="radioValue = $event"
				/>
			</ui-kit-item>

			<ui-kit-item title="ui-slider">
				<ui-slider
					title="Title"
					:value="sliderValue"
					@change="sliderValue = $event"
				/>
			</ui-kit-item>

			<ui-kit-item title="ui-tag">
				<ui-tag>Страховки</ui-tag>
				<ui-tag color="var(--color-highlight)">Кредиты</ui-tag>
				<ui-tag color="var(--color-error)">Ипотеки</ui-tag>
			</ui-kit-item>

			<ui-kit-item title="ui-tooltip">
				<ui-tooltip :title="loremIpsumShort" placement="left">
					<ui-button>Some tooltip</ui-button>
				</ui-tooltip>

				<ui-tooltip :title="loremIpsum">
					<ui-avatar :src="avatar" />
				</ui-tooltip>

				<ui-tooltip :title="loremIpsumShort" placement="right">
					Some tooltip
				</ui-tooltip>
			</ui-kit-item>

			<ui-kit-item title="ui-result">
				<ui-result title="Title" subTitle="Sub title" status="success">
					<template #extra>
						<ui-button>Button</ui-button>
					</template>
				</ui-result>
			</ui-kit-item>

			<ui-kit-item title="ui-table">
				<a-table
					class="ui-table"
					:columns="tableColumns"
					:dataSource="tableData"
					:rowKey="(row) => Math.random()"
					:pagination="false"
					@change="handleTableChange"
				/>
			</ui-kit-item>

			<ui-kit-item title="ui-tabs" :style="{ backgroundColor: '#ebebeb' }">
				<ui-tabs :value="activeTab" @change="activeTab = $event">
					<ui-tab tab="Оформелние" key="1">
						<ui-avatar size="large" :src="avatar" />
						Таб 1
					</ui-tab>
					<ui-tab tab="Расчет" key="2">
						Таб 2
						<ui-avatar size="large" :src="avatar" />
					</ui-tab>
					<ui-tab tab="Итого" key="3">
						<ui-avatar size="large" :src="avatar" />
						Таб 3
					</ui-tab>
				</ui-tabs>
			</ui-kit-item>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["auth"]
})

// Components
import ATable from "ant-design-vue/lib/table"

// Types
import type { UiSelect, UiRadio, UiTable } from "~/types"

// hooks
const { $toLink } = useNuxtApp()

// Methods
const toAntDesign = (): void => {
	$toLink("https://antdv.com/components/overview")
}

// Data
const isChecked = ref<boolean>(false)
const isModal = ref<boolean>(false)
const inputValue = ref<string>("")
const inputNumberValue = ref<number>(0)
const datePickerValue = ref<string>("")
const activeTab = ref<string>("2")
const selectValue = ref<string>("jack")
const selectOptions: UiSelect.Options = [
	{
		value: "jack",
		label: "Jack"
	},
	{
		value: "jack-1",
		label: "Jack-1"
	},
	{
		value: "disabled",
		label: "Disabled",
		disabled: true
	}
]
const radioValue = ref<string>("jack")
const radioOptions: UiRadio.Options = [
	{
		value: "jack",
		label: "Jack"
	},
	{
		value: "jack-1",
		label: "Jack-1"
	},
	{
		value: "disabled",
		label: "Disabled",
		disabled: true
	}
]
const sliderValue = ref<number>(30)

const avatar: string =
	"https://ae04.alicdn.com/kf/Hd0ee7cfdb28b41df9e0b749f2e74dd6eH/Tony-Stark.jpg"
const loremIpsumShort: string = "Lorem ipsum dolor sit amet"
const loremIpsum: string =
	"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." +
	" Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. " +
	"Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem."

const tableColumns: UiTable.Column[] = [
	{
		title: "User_id",
		dataIndex: "user_id",
		key: "user_id",
		slots: { title: "user_id" },
		scopedSlots: { customRender: "user_id" },
		align: "left"
	},
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		scopedSlots: { customRender: "name" },
		align: "left"
	},
	{
		title: "Ter bank",
		dataIndex: "ter_bank",
		key: "ter_bank",
		scopedSlots: { customRender: "ter_bank" },
		align: "left"
	}
]

const tableData = [
	{
		user_id: "1",
		name: "Иван",
		ter_bank: "Москва"
	},
	{
		user_id: "2",
		name: "Андрей",
		ter_bank: "Вологда"
	},
	{
		user_id: "3",
		name: "Генадий",
		ter_bank: "Москва"
	}
]
</script>
