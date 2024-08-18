declare module "#app" {
	interface NuxtApp {
		$stopEvents(): void
	}
}

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$stopEvents(): void
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			stopEvents: (): void => {
				const event: Event = window.event!
				event.cancelBubble = true
				if (event.stopPropagation) event.stopPropagation()
			}
		}
	}
})
