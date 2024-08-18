import _cloneDeep from "lodash/cloneDeep"

// Mocks
import { motorCar } from "~/mocks"

// Types
import { AvtocodService, Calculator, MotorService } from "@common-repo/types/src"

// Store
import { useConfigStore } from "~/store/config"
import { BaseCalculator } from "~/store/base-calculator"

// Data
const baseCalculator = new BaseCalculator(Calculator.TypeEnum.MOTOR)
const baseState: any = baseCalculator.getState()

baseState.insurer.main = {
	...baseState.insurer.main,
	kladr: ""
}

const state = {
	...baseState,

	info: {
		marks: [],
		models: [],
		categories: []
	} as MotorService.InfoObject,

	payment: {
		main: {
			documentType: "",
			documentNumber: "",
			documentDate: ""
		},
		cars: [] as MotorService.Vehicle[],
		price: {
			sumInsured: ""
		}
	},

	registration: {
		contract: {
			numberVsp: "",
			fullName: "нет КМ",
			personnelNumber: "нет КМ",
			clientType: ""
		},
		placement: {
			region: "",
			city: ""
		},
		signatory: {
			signatory: "",
			signatoryGenitive: "",
			position: "",
			positionGenitive: "",
			based: ""
		},
		bank: {
			bik: "",
			kpp: "",
			corWallet: "",
			wallet: "",
			bankName: "",
			email: "",
			phone: ""
		}
	}
}

type State = typeof state

export const useMotorStore = defineStore("motor-assistant", {
	state: (): State => {
		return _cloneDeep(state)
	},

	actions: {
		...baseCalculator.getActions(),
		resetState(): void {
			this.resetStateByData(state)
		},
		async fetchInfo(type: MotorService.InfoType): Promise<void> {
			const { $motorApi } = useNuxtApp()

			const methodName = `fetchInfo${type[0].toUpperCase() + type.slice(1)}`

			try {
				const { entity } = await $motorApi[methodName]()

				this.setInfo(type, entity)
			} catch (error) {
				throw error
			}
		},
		async fetchInfoModels(markId: number): Promise<void> {
			const { $motorApi } = useNuxtApp()

			try {
				const { entity } = await $motorApi.fetchInfoModels(markId)

				this.setInfo(MotorService.InfoType.MODELS, entity)
			} catch (error) {
				throw error
			}
		},
		async fetchCarsDataByVin(vin: string): Promise<void> {
			const { $avtocodeApi } = useNuxtApp()

			try {
				const { carInfo } = await $avtocodeApi.fetchCarData({
					identifier: AvtocodService.Identifier.VIN,
					value: vin
				})

				this.setCar(vin, carInfo)
			} catch (error) {
				throw error
			}
		},
		async fetchAvtocodeData(): Promise<void> {
			if (this.getVinNumbers.length) {
				const promises: Promise<void>[] = this.getVinNumbers.map(
					(vin: string) => {
						return this.fetchCarsDataByVin(vin)
					}
				)

				try {
					await Promise.all(promises)
				} catch (e) {}
			}
		},
		setCarValue(
			data: AvtocodService.CarInfo,
			index: number,
			stateName: string,
			avtocodeName: keyof AvtocodService.CarInfo | "" = ""
		) {
			if (!avtocodeName) avtocodeName = stateName

			const value: any = data?.[avtocodeName]

			if (value) {
				this.payment.cars[index][stateName] = value
			}
		},
		setCarIdValue(
			data: AvtocodService.CarInfo,
			index: number,
			stateInfoName: string,
			stateName: string,
			avtocodeName: keyof AvtocodService.CarInfo | "" = ""
		) {
			if (!avtocodeName) avtocodeName = stateName

			const infoItem: MotorService.Info = this.info[stateInfoName]?.find(
				({ name }: MotorService.Info) => name === data[avtocodeName]
			)

			const id: number = (infoItem?.id as number) || 0

			if (id) this.payment.cars[index][stateName] = id
		},
		setCar(vin: string, data: AvtocodService.CarInfo): void {
			const index: number = this.payment.cars.findIndex(
				(car: MotorService.Vehicle) => car.vin === vin
			)

			if (index > -1) {
				this.setCarValue(data, index, "enginePower", "power")
				this.setCarValue(data, index, "issueYear", "year")
				this.setCarValue(data, index, "originalName")
				this.setCarValue(data, index, "maxMass")
				this.setCarValue(data, index, "registrationNumber", "grz")
				this.setCarValue(data, index, "bodyColor", "color")
				this.setCarValue(data, index, "registrationRegionString", "region")

				this.setPtsNumberValue(data.pts?.number, index)
				this.setPtsDateValue(data.pts?.date, index)

				this.setCarIdValue(data, index, "marks", "markId", "mark")
				this.setCarIdValue(data, index, "categories", "category")

				this.setMarkModel(data, index)
			}
		},
		async setMarkModel(
			data: AvtocodService.CarInfo,
			index: number
		): Promise<void> {
			const infoItemMark: MotorService.Info = this.info.marks?.find(
				({ name }: MotorService.Info) => name === data.mark
			)
			const markId: number = (infoItemMark?.id as number) || 0

			await this.fetchInfoModels(markId)

			const infoItemModel: MotorService.Info = this.info.models?.find(
				({ name }: MotorService.Info) =>
					name.split(" - ")[1].toLowerCase() === data.model.toLowerCase()
			)
			const modelId: number = (infoItemModel?.id as number) || 0

			this.setCarField("modelId", modelId, index)
		},
		setInfo(type: MotorService.InfoType, data: MotorService.Info): void {
			this.info[type] = data
		},
		setCarField(
			fieldName: string,
			value: string | number,
			index: number
		): void {
			this.payment.cars[index][fieldName] = value
		},
		setStsValue(
			fieldName: "issueDate" | "number",
			value: string,
			index: number
		) {
			this.payment.cars[index].registrationCertificate[fieldName] = value
		},
		setPtsNumberValue(value: string, index: number) {
			this.payment.cars[index].passport.number = value
			this.payment.cars[index].ptsSeriesNumber = value
		},
		setPtsDateValue(value: string, index: number) {
			const ptsValue = this.setPtsDateFormat(value)

			this.payment.cars[index].passport.issueDate = ptsValue
			this.payment.cars[index].ptsIssueDate = ptsValue
		},
		setPtsDateFormat(value: string): string {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			return $dayjs(value).format(configStore.getFormatDates)
		},
		createEmptyCar(): void {
			const defaultCar = _cloneDeep(motorCar)

			defaultCar.startDate = this.getTomorrowDate

			this.payment.cars.push(defaultCar)
		},
		deleteCar(index: number): void {
			if (index > -1) this.payment.cars.splice(index, 1)
		},
		resetModelsList(): void {
			this.setInfo(MotorService.InfoType.MODELS, [])
		}
	},

	getters: {
		...baseCalculator.getGetters(),
		getCars(): any[] {
			return this.$state.payment.cars
		},
		getCarByIndex() {
			return (index: number): MotorService.Vehicle => {
				return this.payment.cars[index]
			}
		},
		getCarField() {
			return (fieldName: string, index: number): string | number => {
				return this.getCars[index][fieldName]
			}
		},
		getInfo() {
			return (name: MotorService.InfoType) => {
				return this.$state.info[name].map(({ id, name }: MotorService.Info) => {
					return {
						value: id,
						label: name
					}
				})
			}
		},
		getTomorrowDate(): string {
			const configStore = useConfigStore()
			const { $dayjs } = useNuxtApp()

			return $dayjs().add(1, "d").format(configStore.getFormatDates)
		},
		getVinNumbers(): string[] {
			const vinNumbers: string[] = []

			this.payment.cars.forEach(({ vin }: MotorService.Vehicle) => {
				if (vin) vinNumbers.push(vin)
			})

			return vinNumbers
		},
		getCanCloseDealAdditional(): boolean {
			return true
		}
	}
})
