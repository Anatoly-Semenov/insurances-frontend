// @ts-ignore
import VueMatomo from "vue-matomo"

// hooks
import { useConfig } from "~/hooks"

// Types
import type { Matomo } from "@common-repo/types/src"

const siteId = (): number => {
	switch (document.location.host) {
		case "ps.test-url.ru": {
			return 14
		}
		case "master-insurances-frontend.k8s-apps.dev.test-url.tech": {
			return 14
		}
		case "insurances.test-url.ru": {
			return 14
		}
		case "insurances.dev.test-url.io": {
			return 14
		}
		case "insurances.staging.test-url.io": {
			return 14
		}
		default: {
			return 5
		}
	}
}

declare module "#app" {
	interface NuxtApp {
		$matomo: VueMatomo
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$matomo: VueMatomo
	}
}

export default defineNuxtPlugin((nuxtApp) => {
	const { isDev } = useConfig()

	if (!isDev) {
		const options: Matomo.ConnectOptions = {
			host: "https://matomo.test-url.ru",
			enableHeartBeatTimer: false,
			heartBeatTimerInterval: 15,
			trackerFileName: "matomo",
			enableLinkTracking: true,
			trackInitialView: true,
			requireConsent: false,
			disableCookies: false,
			router: nuxtApp.router,
			cookieDomain: null,
			preInitActions: [],
			siteId: siteId(),
			domains: null,
			debug: false,
			userId: null
		}

		nuxtApp.vueApp.use(VueMatomo, options)

		return {
			provide: {
				matomo: VueMatomo
			}
		}
	}
})
