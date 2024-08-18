import { Component } from "@vue/runtime-core"

export namespace CalculatorPackage {
	export type Slug = "complex" | "base" | "information" | "wallet" | "ddos"

	export enum SlugEnum {
		COMPLEX = "complex",
		BASE = "base",
		INFORMATION = "information",
		WALLET = "wallet",
		DDOS = "ddos"
	}

	export interface Package {
		name: string
		icon: Component
		slug: Slug
		risks: string[]
		prolongationPrices?: number[]
		id?: number
	}
}
