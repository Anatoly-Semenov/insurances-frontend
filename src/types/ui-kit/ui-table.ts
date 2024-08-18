export namespace UiTable {
	export interface Column {
		title?: string
		key: string
		dataIndex?: string
		scopedSlots?: { customRender: string }
		align?: string
		slots?: { title: string }
		width?: number | boolean
		fixed?: boolean | "left" | "right"
		sorter?: boolean
	}

	export interface Row {
		[key: string]: any
	}
}
