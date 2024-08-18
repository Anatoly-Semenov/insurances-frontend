import sanitizeHtml from "sanitize-html"

declare module "#app" {
	interface NuxtApp {
		$sanitizeHtml(html: string): string
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$sanitizeHtml(html: string): string
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			sanitizeHtml: (html: string): string => {
				return sanitizeHtml(html)
			}
		}
	}
})
