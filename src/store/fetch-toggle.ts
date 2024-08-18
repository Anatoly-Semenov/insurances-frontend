import _cloneDeep from "lodash/cloneDeep"
import { message } from "ant-design-vue"

// Types
import { UnleashService } from "@common-repo/types/src"

type Toggle = UnleashService.Toggle
type Toggles = Toggle[]

// Data
const state = {
	toggles: [] as Toggles
}

type State = typeof state

export const useFetchToggleStore = defineStore("fetch-toggle", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		resetState() {
			const emptyState: State = _cloneDeep(state)

			Object.keys(state).forEach((name) => {
				this.$state[name as keyof State] = emptyState[name as keyof State]
			})
		},

		async fetchAllToggles(): Promise<void> {
			const { $fetchToggle } = useNuxtApp()

			try {
				const toggles: Toggles = await $fetchToggle.getAllToggles()

				if (Array.isArray(toggles)) {
					this.toggles = toggles
				}
			} catch (error) {
				message.error("Ошибка запроса на получение fetch toggle")
			}
		},

		async fetchToggleByName(name: string): Promise<void> {
			const { $fetchToggle } = useNuxtApp()

			try {
				const toggle = await $fetchToggle.getToggle(name)
			} catch (error) {
				message.error(`Ошибка запроса на получение fetch toggle ${name}`)
			}
		}
	},

	getters: {
		getAllToggles(): State["toggles"] {
			return this.toggles
		},

		getToggleByName(): (name: string) => Toggle {
			return (name) => {
				return this.toggles.find((toggle) => (toggle.name = name))!
			}
		},

		haveToggle(): (name: string) => boolean {
			const { $fetchToggle } = useNuxtApp()

			return (name) => {
				return $fetchToggle.checkIsEnabled(name)
			}
		}
	}
})
