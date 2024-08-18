<template>
	<div class="layout__header">
		<div class="layout__header-gradient" />
		<div class="layout__header-info">
			<div class="layout__container">
				<div class="layout__header-main">
					<nuxt-link class="layout__header-logo" to="/">
						<img src="~/assets/img/logo.png" alt="logo" />
					</nuxt-link>
					<div class="layout__header-links" v-if="!isTablet">
						<ui-button
							v-for="{ name, path, action, id } in links"
							:key="name"
							:id="id"
							:class="{ _active: name === 'Имущественное страхование' }"
							@click="path ? $router.push(path) : action()"
							type="link"
						>
							{{ name }}
							<down-outlined
								v-if="name === 'Еще'"
								:class="{ _active: isInsurances }"
							/>
						</ui-button>
					</div>
				</div>

				<ui-dropdown :data="profileDropdown">
					<div class="layout__header-profile">
						<p class="layout__header-name" v-if="userName && !isMobile">
							{{ userName }}
						</p>
						<!--			Todo: Temporary hide on production env			-->
						<ui-avatar v-if="isDev" size="small" :src="avatar" />
					</div>
				</ui-dropdown>
			</div>
		</div>

		<transition name="slide-header-menu">
			<div class="layout__header-insurances" v-if="isInsurances">
				<div class="layout__container">
					<nuxt-link
						v-for="{ name, path, icon } in insurances"
						:to="path"
						class="layout__header-insurance"
					>
						<component class="layout__header-icon" :is="icon" :height="14" />
						<p class="layout__header-title">
							{{ name }}
						</p>
					</nuxt-link>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
// Icons
import { DownOutlined } from "@ant-design/icons-vue"

// Types
import { FunctionalComponent } from "vue"
import type { UiDropdown } from "~/types"
import { Target } from "~/plugins/to-link"

interface Link {
	name: string
	path?: string
	id?: string
	action?: () => void
	icon?: FunctionalComponent
}

// hooks
import { useUser, useConfig, useCalculatorInsurances } from "~/hooks"

const { $logout } = useNuxtApp()
const router = useRouter()

// Data
const { isDev, persinFrontendUrl } = useConfig()

// Computed
const { name: userName } = useUser()
const { width } = useWindowSize()

const isTablet = computed((): boolean => {
	return width.value < 1000
})

const isMobile = computed((): boolean => {
	return width.value < 500
})

onMounted(() => {
	if (isDev) {
		links.value.push({
			name: "ui-kit",
			path: "/ui-kit"
		})
	}
})

// Data
const isInsurances = ref<boolean>(false)
const config = useRuntimeConfig()
const avatar: string =
	"https://ae04.alicdn.com/kf/Hd0ee7cfdb28b41df9e0b749f2e74dd6eH/Tony-Stark.jpg"

const links = ref<Link[]>([
	{
		name: "Личное страхование",
		action() {
			const { $toLink } = useNuxtApp()

			$toLink(persinFrontendUrl, Target.SELF)
		},
		id: "persin"
	},
	{
		name: "Имущественное страхование",
		path: "/",
		id: "insurances"
	},
	{
		name: "Еще",
		action: () => {
			isInsurances.value = !isInsurances.value
		},
		id: "more"
	}
])
const profileDropdown: UiDropdown.Data = [
	{
		text: "Профиль",
		action() {
			router.push("/profile")
		}
	},
	{
		text: "Выйти",
		action() {
			$logout()
		}
	}
]

const { insurances } = useCalculatorInsurances()

watchEffect(() => {
	if (isInsurances.value && isMobile.value) {
		isInsurances.value = false
	}
})
</script>
