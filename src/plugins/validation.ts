// Types
import type { Validation as ValidationType } from "@common-repo/types/src"
type Value = ValidationType.Value

// Services
import { Validation } from "~/services"

declare module "#app" {
	interface NuxtApp {
		$validation(link: Value): Validation
	}
}
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$validation(link: Value): Validation
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			validation: (value: Value): Validation => {
				return new Validation(value)
			}
		}
	}
})
