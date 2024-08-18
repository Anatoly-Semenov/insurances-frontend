import { Ref } from "@vue/reactivity"

export namespace Http {
	export type Path = string

	export interface Header {
		key: string
		value: string
	}

	export interface ArbitraryObject {
		[key: string]: any
	}

	export type Body = RequestInit["body"] | Record<string, any>

	export type Headers = Header[] | ArbitraryObject

	export enum Method {
		GET = "GET",
		HEAD = "HEAD",
		POST = "POST",
		PUT = "PUT",
		DELETE = "DELETE",
		CONNECT = "CONNECT",
		OPTIONS = "OPTIONS",
		TRACE = "TRACE",
		PATCH = "PATCH"
	}

	export interface Options {
		key?: string
		method?: Method
		query?: ArbitraryObject
		params?: ArbitraryObject
		body?: Body
		headers?: Headers
		baseURL?: string
		server?: boolean
		lazy?: boolean
		immediate?: boolean
		default?: () => string
		transform?: (input: string) => string
		pick?: string[]
		watch?: string[]
	}

	export type AsyncData<T> = {
		data: Ref<T>
		pending: Ref<boolean>
		refresh: (opts?: { dedupe?: boolean }) => Promise<void>
		execute: () => Promise<void>
		error: Ref<Error | boolean>
	}

	export type Response<T> = Partial<Http.AsyncData<T>>

	export type Request<T> = Promise<AsyncData<T>>
}
