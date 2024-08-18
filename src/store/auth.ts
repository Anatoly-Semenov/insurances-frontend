import _cloneDeep from "lodash/cloneDeep"

// Types
import type { Ref } from "@vue/reactivity"
import type { AuthService } from "@common-repo/types/src"
import { Calculator, PortalService } from "@common-repo/types/src"

type LoginResponse = { pending?: Ref<boolean>; error?: Ref<any> }
type User = AuthService.User | null
type Profile = PortalService.Profile
type UserUpdate = AuthService.UpdateUser

interface Token {
	value: null | string
	expire: null | string
}
interface CookieToken {
	token: Token["value"]
	expire: Token["expire"]
}

// Data
const state = {
	user: null as User,
	profile: {
		PERSONAL_CITY: 0,
		UF_VSP_NUMBER: 0,
		SECOND_NAME: "",
		LAST_NAME: "",
		REGION_ID: 0,
		CITY_ID: 0,
		NAME: "",
		REGION: 0,
		GOSB: 0,
		ID: 0,
		TB: 0
	} as Profile,
	token: {
		value: null,
		expire: null
	} as Token,
	isRefreshTokenProgress: false
}

type State = typeof state

export const useAuthStore = defineStore("auth", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		async login(login: string, password: string): Promise<void> {
			const { $authApi } = useNuxtApp()

			try {
				const { isSuccess, entity, message } = await $authApi.login(
					login,
					password
				)

				if (isSuccess) {
					const { token = "", expire = "", ...user } = entity

					if (token) {
						this.setToken({ value: token, expire })
						this.setUser(user as User)
					}
				} else {
					throw message || "Ошибка авторизации"
				}
			} catch (error) {
				throw error
			}
		},

		async fetchUserInfo(): Promise<void> {
			const { $authApi } = useNuxtApp()

			try {
				const { entity } = await $authApi.getUserInfo()

				const { token = "", expire = "", ...user } = entity

				this.setUser(user as User)
			} catch (error) {
				throw error
			}
		},

		async fetchProfile(): Promise<void> {
			const { $portalApi } = useNuxtApp()

			try {
				const { result = null } = await $portalApi.getProfileByEmail(
					this.getEmail
				)

				if (result) this.setProfile(result)
			} catch (error) {
				throw error
			}
		},

		async updateUserInfo(user: AuthService.UpdateUser): Promise<void> {
			const { $authApi } = useNuxtApp()

			try {
				const { isSuccess, message } = await $authApi.updateUserInfo(user)

				if (isSuccess) {
					this.setUser(user, "update")
				} else {
					throw message
				}
			} catch (error) {
				throw error
			}
		},

		async refreshToken(): Promise<void> {
			const { $authApi } = useNuxtApp()

			const { isSuccess, entity, message } = await $authApi.refreshToken()

			if (isSuccess) {
				const { token = "", expire = "", ...user } = entity

				if (token) {
					this.setToken({ value: token, expire })
					this.setUser(user as User)
				}
			} else {
				throw message || "Не получилосьь обновить токен"
			}
		},

		setUser(
			payload: User | UserUpdate,
			type: "default" | "update" = "default"
		): void {
			if (type === "update") {
				const {
					CityId,
					GosbId,
					Name,
					NameKM,
					RegionId,
					Tabel,
					TerBankId,
					Vsp,
					role
				} = payload as UserUpdate

				this.user!.cityId = CityId
				this.user!.gosbId = GosbId
				this.user!.name = Name
				this.user!.nameKM = NameKM
				this.user!.regionId = RegionId
				this.user!.tabel = Tabel
				this.user!.terBankId = TerBankId
				this.user!.vsp = Vsp
				this.user!.role = role
			} else {
				const { $fetchToggle } = useNuxtApp()

				this.user = payload as User

				if (this.getEmail) {
					$fetchToggle.setUserId(this.getEmail)
				}
			}
		},

		setProfile(profile: Profile): void {
			if (profile) {
				this.profile.PERSONAL_CITY = +profile.PERSONAL_CITY
				this.profile.UF_VSP_NUMBER = +profile.UF_VSP_NUMBER
				this.profile.SECOND_NAME = profile.SECOND_NAME
				this.profile.REGION_ID = +profile.REGION_ID
				this.profile.LAST_NAME = profile.LAST_NAME
				this.profile.CITY_ID = +profile.CITY_ID
				this.profile.REGION = +profile.REGION
				this.profile.GOSB = +profile.GOSB
				this.profile.NAME = profile.NAME
				this.profile.ID = +profile.ID
				this.profile.TB = +profile.TB
			}
		},

		setToken({ value, expire }: Token): void {
			this.token = { value, expire }

			this.setTokenToCookie({ token: value, expire })
		},

		setTokenToCookie({ token, expire }: CookieToken): void {
			const { $getCookieDomain } = useNuxtApp()

			const tokenCookie = useCookie("token", {
				domain: $getCookieDomain(),
				default: () => ""
			})
			const expireCookie = useCookie("expireToken", {
				domain: $getCookieDomain(),
				default: () => ""
			})

			if (tokenCookie.value !== token) tokenCookie.value = token
			if (expireCookie.value !== expire) expireCookie.value = expire
		},

		setRefreshTokenProgress(payload: boolean): void {
			this.isRefreshTokenProgress = payload
		},

		resetState(): void {
			const emptyState: State = _cloneDeep(state)

			Object.keys(state).forEach((name) => {
				// @ts-ignore
				this.$state[name as Calculator.Tab] = emptyState[name as Calculator.Tab]
			})
		}
	},

	getters: {
		getUser(): User {
			return this.user
		},

		getProfile(): Profile {
			return this.profile
		},

		getEmail(): AuthService.User["email"] {
			return this.getUser?.email || ""
		},

		getToken(): Token {
			return this.token
		},

		getCanFetchUserInfo(): boolean {
			const { $getCookieDomain } = useNuxtApp()

			const isUser: boolean = !!this.getUser

			if (isUser) return false

			return !!useCookie("token", {
				domain: $getCookieDomain(),
				default: () => ""
			}).value
		},

		getIsRefreshTokenProgress(): boolean {
			return this.isRefreshTokenProgress
		}
	}
})
