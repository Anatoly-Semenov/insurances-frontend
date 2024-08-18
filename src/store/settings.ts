import _cloneDeep from "lodash/cloneDeep"

// Data
const state = {
	isInversion: false
}

type State = typeof state

export const useSettingsStore = defineStore("settings", {
	state: (): State => {
		return _cloneDeep(state)
	},
	actions: {
		setIsInversion(value: boolean): void {
			this.isInversion = value
		},
		toggleIsInversion(): void {
			this.isInversion = !this.isInversion
		}
	},
	getters: {
		getIsInversion(): boolean {
			return this.isInversion
		}
	}
})
