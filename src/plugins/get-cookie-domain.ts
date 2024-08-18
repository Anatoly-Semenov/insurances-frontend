declare module "#app" {
	interface NuxtApp {
		$getCookieDomain(): string
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$getCookieDomain(): string
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			getCookieDomain(): string {
				if (!process.client) return ""

				const host: string | undefined = window.location.host

				if (!host) return ""

				const domainArr: string[] = host.split(".")

				if (domainArr.length > 2) {
					return `.${domainArr[domainArr.length - 2]}.${
						domainArr[domainArr.length - 1]
					}`
				} else {
					return "localhost"
				}
			}
		}
	}
})
