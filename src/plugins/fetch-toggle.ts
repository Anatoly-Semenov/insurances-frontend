// Types
import { FetchToggle } from "@common-repo/types/src"
import { UnleashService } from "~/services/unleash-service"

// Hooks
import { useConfig } from "~/hooks"

declare module "#app" {
	interface NuxtApp {
		$fetchToggle: FetchToggle
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$fetchToggle: FetchToggle
	}
}

export default defineNuxtPlugin(() => {
	const { unleashUrl, unleashAppName, unleashClientKey, unleashEnvironment } =
		useConfig()

	const fetchToggle = new UnleashService(
		unleashUrl,
		unleashAppName,
		unleashClientKey,
		unleashEnvironment
	)

	fetchToggle.start()

	return {
		provide: {
			fetchToggle: fetchToggle
		}
	}
})
