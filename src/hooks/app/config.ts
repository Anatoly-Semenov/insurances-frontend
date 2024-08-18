// Configs
import { devConfig, prodConfig, psiConfig } from "~/configs"

// Types
interface Settings {
	[key: string]: string
}

enum Env {
	DEV = "dev",
	PSI = "staging",
	PROD = "prod"
}

export function useConfig() {
	const config = useRuntimeConfig()

	const env: Env = (config.public?.APP_ENV as Env) || Env.DEV

	let activeConfig: Settings

	switch (env) {
		case Env.DEV:
			activeConfig = devConfig
			break
		case Env.PSI:
			activeConfig = psiConfig
			break
		case Env.PROD:
			activeConfig = prodConfig
			break
	}

	const {
		GO_LANDING: goLanding = "",
		SECONDARY_FRONTEND_URL: secondaryFrontendUrl = "https://secondary.dev.test-url.io",
		UNLEASH_URL: unleashUrl = "https://unleash-proxy.dev.test-url.io/proxy",
		BASE_API_URL_SHORT: baseApiUrlShort = "https://testwww.test-url.ru",
		PREFFIX_MOTOR_ASSISTANT: preffixMotorAssistant = "/motorAssistant",
		BASE_API_URL: baseApiUrl = "https://testwww.test-url.ru/app",
		PORTAL_API_URL: portalApiUrl = "https://portal.test-url.ru",
		OLD_FRONTEND_URL: oldFrontendUrl = "https://www.test-url.ru",
		EGRP_URL: egrpUrl = "https://egrul.nalog.ru/index.html",
		PREFFIX_DMSACCIDENT: preffixDmsaccident = "/dms-sogaz",
		UNLEASH_APP_NAME: unleashAppName = "insurances-frontend",
		UNLEASH_ENVIRONMENT: unleashEnvironment = "default",
		CRM_URL: crmUrl = "https://test-crm.test-url.ru",
		UNLEASH_CLIENT_KEY: unleashClientKey = "test",
		PREFFIX_DMSSBS: preffixDmsInsurance = "/Insurance-dms",
		PREFFIX_ASSET: preffixAsset = "/asset",
		PREFFIX_AGRO: preffixAgro = "/agro",
		PREFFIX_MITE: preffixMite = "/mite",
		ENVIRONMENT: environment = "dev",
		NODE_ENV: nodeEnv = "dev",
		APP_ENV: appEnv = "dev"
	} = activeConfig

	const isDev: boolean = environment.includes("dev")

	return {
		preffixMotorAssistant,
		unleashEnvironment,
		preffixDmsaccident,
		secondaryFrontendUrl,
		unleashClientKey,
		baseApiUrlShort,
		oldFrontendUrl,
		unleashAppName,
		preffixDmsInsurance,
		portalApiUrl,
		preffixAsset,
		preffixAgro,
		preffixMite,
		environment,
		baseApiUrl,
		unleashUrl,
		goLanding,
		egrpUrl,
		nodeEnv,
		crmUrl,
		appEnv,
		isDev
	}
}
