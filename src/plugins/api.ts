import ApiServices from "@common-repo/api-requests/src"

// Hooks
import { useHttp } from "~/hooks"

// Types
import {
	Env,
	ApiServices as IApiServices
} from "@common-repo/api-requests/src/types"

type Services = IApiServices.List

declare module "#app" {
	interface NuxtApp {
		$osagoSpectechApi: Services["osagoSpectechService"]
		$verificationApi: Services["verificationService"]
		$spectechApi: Services["spectechService"]
		$avtocodeApi: Services["avtocodService"]
		$actionsApi: Services["actionsService"]
		$portalApi: Services["portalService"]
		$kascoApi: Services["kascoService"]
		$motorApi: Services["motorService"]
		$breakApi: Services["breakService"]
		$assetApi: Services["assetService"]
		$cyberApi: Services["cyberService"]
		$agroApi: Services["agroService"]
		$cashApi: Services["cashService"]
		$authApi: Services["authService"]
		$infoApi: Services["infoService"]
		$ecoApi: Services["ecoService"]
		$smrApi: Services["smrService"]
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$osagoSpectechApi: Services["osagoSpectechService"]
		$verificationApi: Services["verificationService"]
		$spectechApi: Services["spectechService"]
		$avtocodeApi: Services["avtocodService"]
		$actionsApi: Services["actionsService"]
		$portalApi: Services["portalService"]
		$kascoApi: Services["kascoService"]
		$motorApi: Services["motorService"]
		$breakApi: Services["breakService"]
		$assetApi: Services["assetService"]
		$cyberApi: Services["cyberService"]
		$agroApi: Services["agroService"]
		$cashApi: Services["cashService"]
		$authApi: Services["authService"]
		$infoApi: Services["infoService"]
		$ecoApi: Services["ecoService"]
		$smrApi: Services["smrService"]
	}
}

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()

	const env: Env = (config.public?.APP_ENV as Env) || Env.DEV

	const apiServices: IApiServices.Instance = new ApiServices(useHttp, env)

	const {
		osagoSpectechService,
		verificationService,
		spectechService,
		avtocodService,
		actionsService,
		portalService,
		cyberService,
		breakService,
		assetService,
		kascoService,
		motorService,
		agroService,
		cashService,
		authService,
		infoService,
		ecoService,
		smrService
	} = apiServices.getServices()

	return {
		provide: {
			osagoSpectechApi: osagoSpectechService,
			verificationApi: verificationService,
			spectechApi: spectechService,
			avtocodeApi: avtocodService,
			actionApi: actionsService,
			portalApi: portalService,
			cyberApi: cyberService,
			breakApi: breakService,
			assetApi: assetService,
			kascoApi: kascoService,
			motorApi: motorService,
			agroApi: agroService,
			cashApi: cashService,
			authApi: authService,
			infoApi: infoService,
			ecoApi: ecoService,
			smrApi: smrService
		}
	}
})
