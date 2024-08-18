import type { PropType } from "vue-types/src/types"

export namespace UiDropdown {
	export interface DataItem {
		text: string
		action: () => any
	}

	export type Data = DataItem[]

	export type PropData = PropType<Data>
}
