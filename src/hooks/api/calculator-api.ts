import { Calculator } from "@common-repo/types/src"

export function useCalculatorApi(
	calculator: Calculator.Type = Calculator.TypeEnum.CYBER
): any {
	const {
		$osagoSpectechApi,
		$spectechApi,
		$cyberApi,
		$breakApi,
		$kascoApi,
		$motorApi,
		$assetApi,
		$agroApi,
		$cashApi,
		$ecoApi,
		$smrApi
	} = useNuxtApp()

	switch (calculator) {
		case Calculator.TypeEnum.OSAGO_SPECTECH:
			return $osagoSpectechApi
		case Calculator.TypeEnum.SPECTECH:
			return $spectechApi
		case Calculator.TypeEnum.CYBER:
			return $cyberApi
		case Calculator.TypeEnum.BREAK:
			return $breakApi
		case Calculator.TypeEnum.CASH:
			return $cashApi
		case Calculator.TypeEnum.KASCO:
			return $kascoApi
		case Calculator.TypeEnum.MOTOR:
			return $motorApi
		case Calculator.TypeEnum.ASSET:
			return $assetApi
		case Calculator.TypeEnum.AGRO:
			return $agroApi
		case Calculator.TypeEnum.SMR:
			return $smrApi
		case Calculator.TypeEnum.ECO:
			return $ecoApi
	}
}
