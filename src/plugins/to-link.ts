export enum Target {
	PARENT = "_parent",
	BLANK = "_blank",
	SELF = "_self",
	TOP = "_top"
}

declare module "#app" {
	interface NuxtApp {
		$toLink(link: string, target: Target): void
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$toLink(link: string, target: Target): void
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			toLink: (link: string, target: Target = Target.BLANK): void => {
				if (link) window.open(link, target)!.focus()
			}
		}
	}
})
