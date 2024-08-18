declare module "*.vue" {
	import Vue from "vue"
	export default Vue
}

declare module "*.svg" {
	import type { DefineComponent } from "vue"
	const component: DefineComponent
	export default component
}

declare module "*.png" {
	const content: any

	export default content
}

declare module "vue3-markdown-it" {
	const value: any

	export default value
}
