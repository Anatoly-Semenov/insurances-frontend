// Types
import type { RouteLocationNormalized as Route } from "vue-router"

// Store
import { useAuthStore } from "~/store"

// Components
import { message } from "ant-design-vue"

export default defineNuxtRouteMiddleware((to: Route, from: Route) => {
	if (process.client) {
		const store = useAuthStore()

		if (!store.getUser && !store.getCanFetchUserInfo) {
			store.resetState()

			if (from.name !== "auth") {
				message.error("Пожалуйста, авторизируйтесь")
			} else {
				message.destroy()
			}

			return navigateTo("/auth")
		}
	}
})
