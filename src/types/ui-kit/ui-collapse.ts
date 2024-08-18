import { Component } from "@vue/runtime-core"

export namespace UiCollapse {
	export type Collapsible = "header" | "icon" | "disabled"

	export type ExpandIconPosition = "start" | "end"

	interface ItemOptional {
		expandIconPosition?: ExpandIconPosition
		destroyInactivePanel?: boolean
		collapsible?: Collapsible
		accordion?: boolean
		bordered?: boolean
		ghost?: boolean
	}

	export interface Item extends ItemOptional {
		content: Content
		header: string
	}

	export interface Content {
		value: string | Component
		type: ContentType
	}

	export enum ContentType {
		COMPONENT = "component",
		STRING = "string",
		HTML = "html"
	}

	export type Data = Item[]
}
