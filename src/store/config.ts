import _cloneDeep from "lodash/cloneDeep"

// Data
const state = {
	verificationGuids: {
		motorAssistant: "616e2a6b-92b6-4242-bf5c-16194ea842a6",
		nonDamageBi: "d583403f-18cd-4215-8824-6331eb2925a7",
		assortedDms: "fc93e7ed-45fc-4364-b69b-fb6454408791",
		cyberRisk: "afa7ae6b-47c5-46df-a781-611b608635c5",
		spectech: "2055af47-7d09-4648-810e-f7994e9da391",
		resoDms: "1f570f04-c498-4406-8c20-f64267013557",
		corpns: "f1a6a832-d04e-4771-bb0c-44edfc722f1d",
		Insurancedms: "b10fff43-4753-44b6-a749-aec8d31e4e78",
		shPlus: "9055e531-ad15-4e23-a251-86dd70d5aaed",
		break: "d583403f-18cd-4215-8824-6331eb2925a7",
		asset: "aacdd0e1-4eb9-4f2a-bea3-74e94c3cb4a0",
		nsCov: "ef961431-038c-4b78-9aa9-2b4bbc49e786",
		cargo: "363d5a14-906c-47a3-950b-2f948b89e545",
		kasco: "b81e918d-221e-4653-b984-619b98c793e8",
		sogaz: "dad4f087-fef4-482a-acef-8f6b4984ea0a",
		cash: "6ed83255-3036-4014-bc1c-ca2b5a3107ac",
		mite: "ba132183-e50e-49a0-a1f4-d9f2c5a9289f",
		smr: "e18dad60-63e9-494d-90ef-1169c9782d19",
		dno: "9b1540b8-08a8-4701-b7ca-2f4ec5f7c6f2",
		krs: "03115228-a7d9-473b-8c46-19a8cc76fc1c",
		eco: "94cca364-ac36-4804-a8e1-23f874c5f670"
	},
	formatDates: "DD.MM.YYYY",
	formatDatesInsurance: "YYYY-MM-DD"
}

type State = typeof state
export type VerificationGuid = keyof State["verificationGuids"]

export const useConfigStore = defineStore("config", {
	state: (): State => {
		return _cloneDeep(state)
	},
	getters: {
		getVerificationGuid(): string {
			return (name: VerificationGuid) => {
				return this.verificationGuids[name]
			}
		},
		getFormatDates(): State["formatDates"] {
			return this.formatDates
		},
		getFormatDatesInsurance(): State["formatDatesInsurance"] {
			return this.formatDatesInsurance
		}
	}
})
