import { Mask } from "maska"

// Types
export enum MaskMethod {
	UNMASKED = "unmasked",
	MASKED = "masked"
}

type MaskType = string | string[]

declare module "#app" {
	interface NuxtApp {
		$mask(value: string, mask: MaskType, method?: MaskMethod): string
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$mask(value: string, mask: MaskType, method?: MaskMethod): string
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			mask(
				value: string,
				mask: MaskType,
				method: MaskMethod = MaskMethod.MASKED
			): string {
				const maskInstance = new Mask({ mask })

				return maskInstance[method](value)
			}
		}
	}
})
