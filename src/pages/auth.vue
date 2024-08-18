<template>
	<div class="auth" @keydown.enter="loginUser">
		<div class="auth__block">
			<div class="auth__header">
				<logo class="auth__header-logo" />
				<button class="auth__link" @click="$toLink(keyCloakLink)">
					Что такое keycloak?
					<right-outlined />
				</button>
			</div>
			<div class="auth__content">
				<div class="auth__info">
					<div class="auth__info-text">
						<p class="auth__title">Войти</p>
						<p class="auth__subtitle">Вход с помощью keycloak</p>
					</div>
					<img
						class="auth__content-logo"
						src="~/assets/img/logo-short.png"
						alt="logo"
					/>
				</div>
				<div class="auth__fields">
					<ui-input
						title="Логин"
						:value="login"
						:error="errorEmpty(login)"
						:disabled="isLoading"
						:id="Auth.Id.LOGIN"
						@input:value="login = $event"
					/>
					<ui-input
						title="Пароль"
						:value="password"
						:type="isVisiblePassword ? 'text' : 'password'"
						:error="errorEmpty(password)"
						:disabled="isLoading"
						:id="Auth.Id.PASSWORD"
						@input:value="password = $event"
					>
						<template #suffix>
							<button
								@click="isVisiblePassword = !isVisiblePassword"
								:disabled="isLoading"
							>
								<eye-invisible-outlined v-if="isVisiblePassword" />
								<eye-outlined v-else />
							</button>
						</template>
					</ui-input>
				</div>
				<ui-button
					class="auth__submit"
					@click="loginUser"
					:loading="isLoading"
					:disabled="!canLogin"
					size="large"
					:id="Auth.Id.SIGN_IN_BUTTON"
				>
					Войти
				</ui-button>
				<ui-button class="auth__problems" size="large" type="link">
					Не могу войти
				</ui-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "auth",
	middleware: ["not-auth"]
})

// Types
import { Auth } from "@common-repo/types/src"

// Components
import { message } from "ant-design-vue"

// Hooks
import { useError } from "~/hooks"
const router = useRouter()

// Store
import { useAuthStore } from "~/store"
const store = useAuthStore()

// Icons
import logo from "~/assets/img/logo.svg"
import {
	RightOutlined,
	EyeOutlined,
	EyeInvisibleOutlined
} from "@ant-design/icons-vue"

// Data
const login = ref<string>("")
const password = ref<string>("")
const isLoading = ref<boolean>(false)
const isVisiblePassword = ref<boolean>(false)
const keyCloakLink =
	"https://medium.com/codex/introduction-to-keycloak-227c3902754a"

// Methods
const { errorEmpty } = useError()
async function loginUser(): Promise<void> {
	if (canLogin.value && !isLoading.value) {
		isLoading.value = true

		if (isVisiblePassword.value) {
			isVisiblePassword.value = false
		}

		try {
			await store.login(login.value, password.value)

			router.push("/")
		} catch (error) {
			if (error) message.error(error as string)
		}

		await fetchProfileData()

		isLoading.value = false
	}
}

async function fetchProfileData(): Promise<void> {
	try {
		await store.fetchUserInfo()
		await store.fetchProfile()
	} catch (e) {}
}

// Computed
const canLogin = computed((): boolean => {
	return !errorEmpty(login.value) && !errorEmpty(password.value)
})
</script>
