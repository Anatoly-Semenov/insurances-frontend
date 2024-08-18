<template>
	<div class="landing">
		<div class="landing__banner">
			<div class="landing__banner-main">
				<p class="landing__banner-title" v-if="title">{{ title }}</p>
				<p class="landing__banner-description" v-if="description">
					{{ description }}
				</p>

				<ul
					class="landing__banner-advantages"
					:class="{ _short: !description }"
					v-if="advantages?.length"
				>
					<li v-for="(advantage, index) in advantages" :key="index">
						{{ advantage }}
					</li>
				</ul>

				<ui-input
					v-if="type === types.REDIRECT_WITH_FIELD"
					class="landing__banner-link"
					title="Ответственный по сделке"
					:value="ownerEmail"
					required
					@input:value="ownerEmail = $event"
				/>

				<a class="landing__banner-link" :href="link" target="_blank">
					<ui-button size="large">Перейти к страхованию</ui-button>
				</a>
			</div>
			<img class="landing__banner-img" :src="img" alt="banner" v-if="img" />
		</div>

		<ui-tabs
			v-if="type === types.REDIRECT"
			:value="activeTab"
			animated
			@change="activeTab = $event"
		>
			<ui-tab tab="О полисе" key="about" />
			<ui-tab tab="Вопросы и ответы" key="faq" />
		</ui-tabs>

		<transition name="slide-fade-top" v-if="type === types.REDIRECT">
			<div class="landing__content" v-if="activeTab === 'about'">
				<ui-markdown
					class="landing__content-markdown"
					:content="markdown"
					v-if="markdown"
				/>

				<div class="landing__buttons">
					<a :href="link" target="_blank">
						<ui-button>Перейти к страхованию</ui-button>
					</a>
				</div>
			</div>
		</transition>

		<transition name="slide-fade-top">
			<div class="landing__content" v-if="activeTab === 'faq'">
				<ui-collapse
					class="landing__collapse"
					:data="collapse"
					:activeKey="activeKey"
					@change="activeKey = $event"
				/>
			</div>
		</transition>
	</div>
</template>

<script lang="ts" setup>
// Hooks
import { useAuthStore } from "~/store"

// Types
import { PropType } from "@vue/runtime-core"
import type { UiCollapse } from "~/types"
import { Landing } from "~/types"

// Props
const props = defineProps({
	type: {
		type: String as PropType<Landing.Type>,
		default: Landing.Type.REDIRECT
	},
	title: {
		type: String,
		default: ""
	},
	description: {
		type: String,
		default: ""
	},
	img: {
		type: String,
		default: ""
	},
	markdown: {
		type: String,
		default: ""
	},
	redirectLink: {
		type: String,
		default: ""
	},
	collapse: {
		type: Array as PropType<UiCollapse.Data>,
		default: () => []
	},
	advantages: {
		type: Array as PropType<string[]>,
		default: () => []
	}
})

// Store
const authStore = useAuthStore()

// Data
const activeKey = ref<string[]>([])
const activeTab = ref<string>("about")

const ownerEmail = ref<string>(authStore.getEmail)

const types = Landing.Type

// Computed
const link = computed((): string => {
	if (props.type === types.REDIRECT && authStore.getEmail) {
		return props.redirectLink + `/${authStore.getEmail}`
	}
	if (props.type === types.REDIRECT_WITH_FIELD) {
		return props.redirectLink + `${ownerEmail.value}`
	}

	return props.redirectLink
})
</script>
