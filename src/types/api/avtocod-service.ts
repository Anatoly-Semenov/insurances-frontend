import { Response } from "@common-repo/types/src"

export namespace AvtocodService {
	export interface CarInfo {
		region: string | null
		vin: string
		year: number
		category: string
		chassis: string | null
		color: string | null
		grz: string | null
		mark: string
		maxMass: number
		model: string
		originalName: string
		power: number
		pts: Pts
	}

	export interface Pts {
		date: string | null
		number: string | null
	}

	export interface Payload {
		identifier: Identifier
		value: string
	}

	export enum Identifier {
		CHASSIS = "CHASSIS",
		VIN = "VIN"
	}

	export type CarResponse = Exclude<Response<any>, "entity"> & {
		carInfo: CarInfo
	}
}
