import { EventService } from "~/services"

declare module "#app" {
	interface NuxtApp {
		$event: EventService
	}
}

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$event: EventService
	}
}

// @ts-ignore
export default defineNuxtPlugin(() => {
	// @ts-ignore
	const { $actionApi } = useNuxtApp()

	return {
		provide: {
			event: new EventService($actionApi)
		}
	}
})
