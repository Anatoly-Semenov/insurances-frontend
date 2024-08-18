import _cloneDeep from "lodash/cloneDeep"

import { BaseCalculator } from "~/store/base-calculator"

// Types
import { Calculator } from "@common-repo/types/src"

// Data
const baseCalculator = new BaseCalculator(Calculator.TypeEnum.CASH)
const baseState: any = baseCalculator.getState()

baseState.insurer.main = {
	...baseState.insurer.main
}

const state = {
	...baseState,

	payment: {
		main: {
			startedAt: "",
			finishedAt: "",
			coefficient: "",
			cv: 0
		},
		price: {
			isProlongation: false,
			sumInsured: 0,
			address: ""
		}
	},

	registration: {
		contract: {
			numberVsp: "",
			fullName: "нет КМ",
			personnelNumber: "",
			clientType: ""
		},
		placement: {
			region: "",
			city: ""
		},
		signatory: {
			signatory: "",
			signatoryGenitive: "",
			position: "",
			positionGenitive: "",
			based: ""
		},
		bank: {
			bik: "",
			kpp: "",
			corWallet: "",
			wallet: "",
			bankName: "",
			email: "",
			phone: ""
		}
	}
}

type State = typeof state

export const useCashStore = defineStore("cash", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),
		resetState(): void {
			this.resetStateByData(state)
		}
	},

	getters: {
		...baseCalculator.getGetters(),
		getCanCloseDealAdditional(): boolean {
			return true
		}
	}
})
