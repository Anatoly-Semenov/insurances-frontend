<template>
	<div
		class="profile"
		@keydown.enter="saveChanges"
		:class="{ _loading: isLoading }"
	>
		<div class="profile__main">
			<profile-block
				title="Персональные данные"
				subtitle="(Брокер)"
				description="Публичные данные брокера, нужны для оформления сделок"
			>
				<ui-input
					title="ФИО Брокера"
					:value="brokerFio"
					:error="errorEmpty(brokerFio)"
					:disabled="isProfile"
					@input:value="brokerFio = $event"
				/>
				<ui-input
					title="ФИО КМ"
					:value="kmFio"
					:error="errorFioKM(kmFio)"
					:disabled="isProfile"
					@input:value="kmFio = $event"
				/>
				<ui-input
					title="Личный табельный номер"
					:value="tabel"
					:error="errorTabelNumberKM(tabel)"
					:disabled="isProfile"
					@input:value="tabel = $event"
				/>
			</profile-block>
			<profile-block
				title="Данные о подразделении банка"
				description="Эти данные нужны для того, чтобы определять ваше подразделение"
			>
				<ui-select
					title="Регион по умолчанию"
					:options="regionOptions"
					:value="region"
					:disabled="isProfile"
					@change="setRegion"
				/>
				<ui-select
					title="Город"
					:options="cityOptions"
					:value="city"
					:disabled="isDisabledCity"
					:loading="isLoadingCity"
					@change="city = $event"
				/>
				<ui-select
					title="Территориальный банк"
					:options="terBankOptions"
					:value="terBank"
					:disabled="isProfile"
					@change="setTerBank"
				/>
				<ui-select
					title="ГОСБ / ОСБ"
					:options="gosbOptions"
					:loading="isGosbLoading"
					:value="gosb"
					:disabled="isProfile && isGosbDisabled"
					@change="gosb = $event"
				/>
				<ui-input
					title="Номер ВСП"
					:value="numberVsp"
					:error="errorEmpty(numberVsp)"
					:disabled="isProfile"
					@input:value="numberVsp = $event"
				/>
			</profile-block>
		</div>
		<!--			Todo: Temporary hide on production env			-->
		<div class="profile__intro" v-if="isDev">
			<profile-block class="profile__avatar-block" title="Публичный аватар">
				<profile-avatar />
			</profile-block>
			<div class="profile__buttons">
				<ui-button
					v-if="!isProfile"
					@click="saveChanges"
					:disabled="!canSave"
					:loading="isLoadingSave"
				>
					Сохранить изменения
				</ui-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Types
import { AuthService, Info, PortalService } from "@common-repo/types/src"
type Profile = PortalService.Profile | null
type User = AuthService.User | null

// Hooks
import { useError, useConfig } from "~/hooks"
import { useAuthStore, useInfoStore } from "~/store"

// Components
import { message } from "ant-design-vue"
const profileAvatar = defineAsyncComponent(
	() => import("~/components/profile/profile-avatar.vue")
)
const profileBlock = defineAsyncComponent(
	() => import("~/components/profile/profile-block.vue")
)

// Store
const authStore = useAuthStore()
const infoStore = useInfoStore()

// Data
const { isDev } = useConfig()

const brokerFio = ref<string>("")
const kmFio = ref<string>("")
const tabel = ref<string>("")

const region = ref<number | null>(null)
const city = ref<number | null>(null)
const numberVsp = ref<string>("")
const terBank = ref<number | null>(null)
const gosb = ref<number | null>(null)

const isLoading = ref<boolean>(false)
const isLoadingSave = ref<boolean>(false)
const isLoadingCity = ref<boolean>(false)
const isGosbLoading = ref<boolean>(false)

// Computed
const isProfile = computed((): boolean => !!authStore.getProfile)
const canSave = computed((): boolean => {
	return (
		brokerFio.value !== authStore.getUser?.name ||
		kmFio.value !== authStore.getUser?.nameKM ||
		tabel.value !== authStore.getUser?.tabel ||
		region.value !== authStore.getUser?.regionId ||
		city.value !== authStore.getUser?.cityId ||
		terBank.value !== authStore.getUser?.terBankId ||
		gosb.value !== authStore.getUser?.gosbId ||
		numberVsp.value !== authStore.getUser?.vsp
	)
})
const regionOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.REGIONS)
})
const cityOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.CITIES)
})
const terBankOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.TER_BANKS)
})
const gosbOptions = computed(() => {
	return infoStore.getInfo(Info.InfoType.GOSB)
})
const isDisabledCity = computed(() => {
	return !region || isLoadingCity.value
})
const isGosbDisabled = computed((): boolean => {
	return !terBank.value || isGosbLoading.value
})

// Methods
const { errorEmpty, errorFioKM, errorTabelNumberKM } = useError()

async function setStateProfile(profile: PortalService.Profile): Promise<void> {
	brokerFio.value = `${profile?.LAST_NAME || ""} ${profile?.NAME || ""}`
	numberVsp.value = profile?.UF_VSP_NUMBER || ""
	tabel.value = profile.ID || ""
	gosb.value = +profile.GOSB || null

	const regionId: number | null = +profile?.REGION_ID || null
	const terBankId: number | null = +profile?.TB || null

	if (regionId) {
		await setRegion(regionId)
	}

	if (terBank) {
		await setTerBank(terBankId as number)
	}

	city.value = +profile?.CITY_ID || null
	gosb.value = +profile?.GOSB || null
}

async function setStateUser(user: AuthService.User): Promise<void> {
	brokerFio.value = user.name || ""
	numberVsp.value = user.vsp || ""
	kmFio.value = user.nameKM || ""
	tabel.value = user.tabel || ""

	const regionId: number | null = user?.regionId || null
	const terBankId: number | null = user?.terBankId || null

	if (regionId) {
		await setRegion(regionId)
	}

	if (terBank) {
		await setTerBank(terBankId as number)
	}

	city.value = user?.cityId || null
	gosb.value = user?.gosbId || null
}

async function setStateData(): Promise<void> {
	const profile: Profile = authStore.getProfile
	const user: User = authStore.getUser

	if (profile) {
		await setStateProfile(profile)
	} else if (user) {
		await setStateUser(user)
	}
}

function fetchProfile(): void {
	isLoading.value = true

	authStore.fetchProfile().finally(() => {
		setStateData()
		isLoading.value = false
	})
}

async function saveChanges(): Promise<void> {
	if (canSave.value && !isLoadingSave.value) {
		isLoadingSave.value = true
		try {
			await authStore.updateUserInfo({
				CityId: city.value!,
				GosbId: gosb.value!,
				Name: brokerFio.value,
				NameKM: kmFio.value,
				RegionId: region.value!,
				Tabel: tabel.value,
				TerBankId: terBank.value!,
				Vsp: numberVsp.value,
				role: AuthService.Role.USER
			})

			message.success("Ваш профиль успешно обновлен")
		} catch (e) {}
		isLoadingSave.value = false
	}
}

async function setRegion(value: string | number): Promise<void> {
	region.value = +value
	city.value = null

	isLoadingCity.value = true
	await infoStore.fetchCities(value)
	isLoadingCity.value = false
}

async function setTerBank(value: string | number) {
	terBank.value = +value
	gosb.value = null

	isGosbLoading.value = true
	await infoStore.fetchGosb(value)
	isGosbLoading.value = false
}

onMounted(() => {
	infoStore.fetchInfo(Info.InfoType.REGIONS)
	infoStore.fetchInfo(Info.InfoType.TER_BANKS)

	fetchProfile()
})
</script>
