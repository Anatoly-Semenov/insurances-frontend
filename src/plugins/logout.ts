// Store
import {
	useCyberRisksStore,
	useAuthStore,
	useBreakStore,
	useCashStore,
	useInfoStore
} from "~/store"

declare module "#app" {
	interface NuxtApp {
		$logout(): void
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$logout(): void
	}
}

export default defineNuxtPlugin(() => {
	const router = useRouter()
	const { $analytics, $getCookieDomain } = useNuxtApp()

	const resetCookie = (): void => {
		const tokenCookie = useCookie("token", {
			domain: $getCookieDomain(),
			default: () => ""
		})
		const expireCookie = useCookie("expireToken", {
			domain: $getCookieDomain(),
			default: () => ""
		})

		tokenCookie.value = ""
		expireCookie.value = ""
	}

	const resetStore = (): void => {
		const cyberRisksStore = useCyberRisksStore()
		const breakStore = useBreakStore()
		const authStore = useAuthStore()
		const cashStore = useCashStore()
		const infoStore = useInfoStore()

		cyberRisksStore.resetState()
		breakStore.resetState()
		authStore.resetState()
		cashStore.resetState()
		infoStore.resetState()
	}

	const resetAnalyticsData = (): void => {
		$analytics.setUserId("")
		$analytics.setCustomDimension(1)
	}

	const redirect = (): void => {
		router.push("/auth")
	}

	return {
		provide: {
			logout: (): void => {
				resetCookie()

				resetStore()

				resetAnalyticsData()

				redirect()
			}
		}
	}
})
