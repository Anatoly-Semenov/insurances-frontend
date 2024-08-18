// Img
import logoInsurance from "assets/img/Insurance-logo.jpg"
import logoVsk from "assets/img/vsk-logo.jpg"
import logoUgoria from "assets/img/ugoria-logo.png"

// Store
import { useFetchToggleStore } from "~/store"

// Types
import { Calculator, KascoService } from "@common-repo/types/src"

export interface KascoInsurance {
	// Todo: add value "ugoria" to enum KascoService.InsuranceCompany
	insuranceCompany: KascoService.InsuranceCompany | "ugoria"
	isCvDisabled: boolean
	defaultCv?: number
	minCv: number
	maxCv: number
	logo: any
}

export function useCalculatorKasco(
	calculatorType: Calculator.Type = Calculator.InsurancesType.KASCO
) {
	const fetchToggleStore = useFetchToggleStore()

	onMounted(async () => {
		await fetchToggleStore.fetchAllToggles()
	})

	// Data
	const kascoList: KascoInsurance[] = [
		{
			logo: logoInsurance,
			minCv: 5,
			maxCv: 50,
			isCvDisabled: false,
			insuranceCompany: KascoService.InsuranceCompany.SBS
		},
		{
			logo: logoVsk,
			minCv: 5,
			maxCv: 35,
			isCvDisabled: false,
			insuranceCompany: KascoService.InsuranceCompany.VSK
		}
	]

	const osagoList: KascoInsurance[] = [
		{
			logo: logoInsurance,
			minCv: 0,
			maxCv: 100,
			defaultCv: 10,
			isCvDisabled: true,
			insuranceCompany: KascoService.InsuranceCompany.SBS
		}
	]

	if (
		calculatorType === Calculator.InsurancesType.KASCO &&
		fetchToggleStore.haveToggle("PROPINS-3121")
	) {
		kascoList.push({
			logo: logoUgoria,
			minCv: 0,
			maxCv: 100,
			defaultCv: 40,
			isCvDisabled: true,
			insuranceCompany: "ugoria"
		})

		// Todo: temporary hide
		// osagoList.push({
		// 	logo: logoUgoria,
		// 	minCv: 0,
		// 	maxCv: 100,
		// 	defaultCv: 10,
		// 	isCvDisabled: true,
		// 	insuranceCompany: "ugoria"
		// })
	}

	return { kascoList, osagoList }
}
