// Components
import { message } from "ant-design-vue"

// Store
import { useAuthStore, useInfoStore } from "~/store"
import { Info } from "@common-repo/types/src"
import { UiSelect } from "~/types"

export function useUser() {
	const isAvailableUser = ref<boolean>(false)
	const authStore = useAuthStore()
	const infoStore = useInfoStore()

	const name = computed((): string => {
		return authStore?.getUser?.name || "Безымянный пользователь"
	})

	const email = computed((): string => {
		return authStore?.getUser?.email || ""
	})

	const terBanks = computed((): UiSelect.Options => {
		return infoStore.getInfo(Info.InfoType.TER_BANKS)
	})

	const terBankId = computed((): number => {
		return authStore?.getUser?.terBankId || 0
	})

	const terBankName = computed((): string => {
		if (terBanks.value) {
			return (
				terBanks.value?.find(({ value }) => value === +terBankId.value)
					?.label || ""
			)
		}

		return ""
	})

	async function fetchUserIfIsNotExist() {
		if (authStore.getCanFetchUserInfo) {
			try {
				await authStore.fetchUserInfo()
				await authStore.fetchProfile()
			} catch (error) {
				message.error("Ошибка запроса данных пользователя", 1)
			}
		}
	}

	return {
		name,
		email,
		terBankName,
		isAvailableUser,
		fetchUserIfIsNotExist
	}
}
