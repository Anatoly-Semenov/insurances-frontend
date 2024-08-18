// Services
import { Matomo } from "~/services"

declare module "#app" {
	interface NuxtApp {
		$analytics: Matomo
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$analytics: Matomo
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			analytics: new Matomo()
		}
	}
})
