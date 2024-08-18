// Directives
import VueTheMask from "vue-the-mask"
import { vMaska } from "maska"

// UI components
import {
	UiInputNumber,
	UiDatePicker,
	UiCheckbox,
	UiCollapse,
	UiDropdown,
	UiTooltip,
	UiPopover,
	UiResult,
	UiDrawer,
	UiSelect,
	UiSlider,
	UiAvatar,
	UiButton,
	UiUpload,
	UiInput,
	UiRadio,
	UiAlert,
	UiModal,
	UiTabs,
	UiTag,
	UiTab
} from "@common-repo/ui-kit/src"
import UiMarkdown from "~/components/ui-kit/ui-markdown.vue"

export default defineNuxtPlugin((nuxtApp) => {
	// @ts-ignore
	nuxtApp.vueApp
		// @ts-ignore
		.component("ui-input-number", UiInputNumber)
		// @ts-ignore
		.component("ui-date-picker", UiDatePicker)
		// @ts-ignore
		.component("ui-checkbox", UiCheckbox)
		.component("ui-markdown", UiMarkdown)
		.component("ui-collapse", UiCollapse)
		.component("ui-dropdown", UiDropdown)
		.component("ui-popover", UiPopover)
		.component("ui-tooltip", UiTooltip)
		.component("ui-upload", UiUpload)
		.component("ui-drawer", UiDrawer)
		.component("ui-result", UiResult)
		.component("ui-select", UiSelect)
		.component("ui-slider", UiSlider)
		.component("ui-avatar", UiAvatar)
		.component("ui-button", UiButton)
		.component("ui-modal", UiModal)
		.component("ui-input", UiInput)
		.component("ui-radio", UiRadio)
		.component("ui-alert", UiAlert)
		.component("ui-tabs", UiTabs)
		.component("ui-tag", UiTag)
		.component("ui-tab", UiTab)
		// @ts-ignore
		.use(VueTheMask)
		.directive("maska", vMaska)
})
