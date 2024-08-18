import _isObject from "lodash/isObject"

// Components
import { message } from "ant-design-vue"

// hooks
import { useConfig } from "~/hooks"

// Types
import { Http, Response, InsuranceService } from "@common-repo/types/src"

// Store
import { useAuthStore } from "~/store"
import { UseFetchOptions } from "#app/composables/fetch"

const LOGIN_PATH = "/Account/Login"
const REFRESH_PATH = "/Account/Refresh"

function unAuthorized() {
	const { $logout } = useNuxtApp()
	$logout()
}

function checkByUnAuthorized(error: any): { isUnAuthorized: boolean } {
	const message: string = error?.value?.message || ""

	const isUnAuthorized: boolean = message?.includes("401")

	if (message?.includes("401")) {
		unAuthorized()
	}

	return { isUnAuthorized }
}

function checkError<T>(
	data: { value: Response<T> | T },
	isCurrentApi: boolean = true
): void {
	if (isCurrentApi) {
		const isSuccess: boolean =
			data?.value?.isSuccess || data?.value?.IsSuccess || false

		const text: string = data?.value?.message || data?.value?.Message || ""

		if (!isSuccess && text) {
			if (text) {
				message.error(text)
			}
		}
	}
}

function displayInsuranceErrors(errors: InsuranceService.Error[]) {
	if (errors?.length) {
		errors.forEach((error: InsuranceService.Error) => {
			if (error.message) message.error(error.message, 5)
		})
	}
}

export async function useHttp<T>(
	path: Http.Path,
	customOptions: Http.Options = {}
): Promise<T | any> {
	const { baseApiUrl, baseApiUrlShort } = useConfig()
	const { $dayjs, $getCookieDomain } = useNuxtApp()

	const baseURL: string = baseApiUrl || ""
	const method: Http.Method = Http.Method.POST
	const headers: Http.Headers = {}

	const token = useCookie("token", {
		domain: $getCookieDomain(),
		default: () => ""
	})
	const expireToken = useCookie("expireToken", {
		domain: $getCookieDomain(),
		default: () => ""
	})

	const isExpireToken: boolean = $dayjs().isAfter(expireToken.value, "m")
	const canRefreshToken: boolean =
		expireToken && path !== REFRESH_PATH && path !== LOGIN_PATH && isExpireToken

	// Check by expire token
	if (canRefreshToken) {
		const store = useAuthStore()

		if (!store.getIsRefreshTokenProgress) {
			store.setRefreshTokenProgress(true)

			try {
				await store.refreshToken()
			} catch (e) {
				unAuthorized()
			} finally {
				store.setRefreshTokenProgress(false)
			}
		}
	}

	const isCurrentApi: boolean = !path.includes("http")

	// Check by available token
	if (isCurrentApi && token.value) {
		headers.Authorization = `Bearer ${token.value}`
	} else if (isCurrentApi && path !== LOGIN_PATH) {
		unAuthorized()
	}

	const options: Http.Options = {
		baseURL,
		method,
		headers
	}

	Object.keys(customOptions).forEach((key: string | object): void => {
		// @ts-ignore
		options[key] = _isObject(options[key])
			? // @ts-ignore
			  { ...(options[key] as object), ...(customOptions[key] as object) }
			: // @ts-ignore
			  customOptions[key]
	})

	try {
		const { data, error } = await useFetch<T>(
			path,
			options as UseFetchOptions<any, any, any>
		)

		const { isUnAuthorized } = checkByUnAuthorized(error)

		if (!isUnAuthorized) {
			if (data.value) {
				checkError(data, isCurrentApi)

				return data.value as T
			}

			if (error?.value?.data?.errors) {
				displayInsuranceErrors(error.value.data.errors)
			}

			if (error.value) checkError({ value: error.value!.data })
		} else {
			return error.value
		}
	} catch (error) {
		throw error
	}
}
