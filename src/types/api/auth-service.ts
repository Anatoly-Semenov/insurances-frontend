import type { Response } from "@common-repo/types/src"

export namespace AuthService {
	export enum Role {
		ADMIN = "admin",
		USER = "user"
	}

	export interface Login {
		expire: string // Date
		token: string
		email: string
		siteToken: null | string
		name: null | string
		tabel: null | string
		role: Role
		regionId: number
		cityId: number
		nameKM: null | string
		terBankId: number
		vsp: null | string
		gosbId: number
	}

	export interface UpdateUser {
		CityId: number
		GosbId: number
		Name: string
		NameKM: string
		RegionId: number
		Tabel: string
		TerBankId: number
		Vsp: string
		role: Role
	}

	export type User = Exclude<Login, "token" | "expire">

	export type UserInfo = UserInfoItem[]

	export interface UserInfoItem {
		id: number
		name: string
	}

	export interface Token {
		token: string
		expire: string
	}

	export type LoginResponse = Response<Login>

	export type UserInfoResponse = Response<Login>

	export type TokenResponse = Response<Token>
}
