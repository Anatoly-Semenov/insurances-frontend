import { Calculator, Info } from "@common-repo/types/src"

// Stores
import {
	useOsagoSpectechStore,
	useCyberRisksStore,
	useSettingsStore,
	useSpectechStore,
	useConfigStore,
	useKascoStore,
	useMotorStore,
	useBreakStore,
	useAssetStore,
	useInfoStore,
	useCashStore,
	useEcoStore,
	useSmrStore,
	useAgroStore
} from "~/store"

export function useStore(calculatorType: Calculator.Type) {
	const store = computed(() => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return useOsagoSpectechStore()
			case Calculator.TypeEnum.SPECTECH:
				return useSpectechStore()
			case Calculator.TypeEnum.CYBER:
				return useCyberRisksStore()
			case Calculator.TypeEnum.BREAK:
				return useBreakStore()
			case Calculator.TypeEnum.KASCO:
				return useKascoStore()
			case Calculator.TypeEnum.MOTOR:
				return useMotorStore()
			case Calculator.TypeEnum.AGRO:
				return useAgroStore()
			case Calculator.TypeEnum.CASH:
				return useCashStore()
			case Calculator.TypeEnum.SMR:
				return useSmrStore()
			case Calculator.TypeEnum.ECO:
				return useEcoStore()
			case Calculator.TypeEnum.ASSET:
				return useAssetStore()
			default:
				return useCyberRisksStore()
		}
	}).value

	const isCompany = computed(() => {
		return store.getCompanyType === Info.CompanyType.COMPANY
	})

	const infoStore = useInfoStore()
	const configStore = useConfigStore()
	const settingsStore = useSettingsStore()

	return { store, infoStore, configStore, settingsStore, isCompany }
}
