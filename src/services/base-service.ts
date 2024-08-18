import { useHttp, useEndpoint } from "~/hooks"

import type { DealService, Response } from "@common-repo/types/src"
import { Calculator, Http, InfoService } from "@common-repo/types/src"

type FacilitiesDescriptionList = DealService.FacilitiesDescriptionResponse
type FacilitiesTypesList = DealService.FacilitiesTypesResponse
type ArchiveDealsResponse = DealService.ArchiveDealsResponse
type AvailableTariffs = DealService.AvailableTariffResponse
type OptionsByTariff = DealService.OptionsByTariffResponse
type IndustriesList = DealService.IndustriesResponse
type BaseApiService = DealService.BaseApiService
type Deal = DealService.Deal

export class BaseService<D = Deal> implements BaseApiService {
	public path: string
	private calculatorType: Calculator.Type

	constructor(
		path: string,
		calculatorType: Calculator.Type = Calculator.TypeEnum.CYBER
	) {
		this.path = path
		this.calculatorType = calculatorType
	}

	generateEndpoint(dealId: string | number = 0) {
		return useEndpoint(this.path, this.calculatorType, dealId)
	}

	async fetchDeal(dealId: string | number): Promise<Response<D>> {
		try {
			const { getDeal } = this.generateEndpoint(dealId)

			const calculatorsWithGetMethod: Calculator.Type[] = [
				Calculator.TypeEnum.OSAGO_SPECTECH,
				Calculator.TypeEnum.AGRO
			]

			const isGet: boolean = calculatorsWithGetMethod.includes(
				this.calculatorType
			)

			const body: any = { dealId }

			const options: Http.Options = {
				method: isGet ? Http.Method.GET : Http.Method.POST
			}

			if (!isGet) options.body = body

			return await useHttp<Response<D>>(getDeal, options)
		} catch (error) {
			throw error
		}
	}

	async fetchDeals(email: string = ""): Promise<ArchiveDealsResponse> {
		const { getDeals } = this.generateEndpoint()

		const calculatorsWithGetMethod: Calculator.Type[] = [
			Calculator.TypeEnum.OSAGO_SPECTECH
		]

		const isGet: boolean = calculatorsWithGetMethod.includes(
			this.calculatorType
		)

		try {
			return (await useHttp<ArchiveDealsResponse>(getDeals, {
				method: isGet ? Http.Method.GET : Http.Method.POST,
				[isGet ? "query" : "body"]: {
					email
				}
			})) as ArchiveDealsResponse
		} catch (error) {
			throw error
		}
	}

	async fetchAvailableTariffs(): Promise<AvailableTariffs> {
		const { getAvailableTariffs } = this.generateEndpoint()

		try {
			return await useHttp<AvailableTariffs>(getAvailableTariffs, {
				body: {}
			})
		} catch (error) {
			throw error
		}
	}

	async fetchOptionsByTariff(tariff: number): Promise<OptionsByTariff> {
		const { getOptionsByTariff } = this.generateEndpoint()

		try {
			return await useHttp<OptionsByTariff>(getOptionsByTariff, {
				body: {
					tariff
				}
			})
		} catch (error) {
			throw error
		}
	}

	async fetchIndustries(): Promise<IndustriesList> {
		const { getIndustries } = this.generateEndpoint()

		try {
			return await useHttp<IndustriesList>(getIndustries, {
				method: Http.Method.GET
			})
		} catch (error) {
			throw error
		}
	}

	async fetchFacilitiesTypes(): Promise<FacilitiesTypesList> {
		const { getFacilitiesTypes } = this.generateEndpoint()

		try {
			return await useHttp<FacilitiesTypesList>(getFacilitiesTypes, {
				method: Http.Method.GET
			})
		} catch (error) {
			throw error
		}
	}

	async fetchFacilitiesDescriptions(): Promise<FacilitiesDescriptionList> {
		const { getFacilitiesDescriptions } = this.generateEndpoint()

		try {
			return await useHttp<FacilitiesDescriptionList>(
				getFacilitiesDescriptions,
				{
					method: Http.Method.GET
				}
			)
		} catch (error) {
			throw error
		}
	}

	async fetchCountryCatalog(): Promise<InfoService.Info> {
		const { getCountryCatalog } = this.generateEndpoint()

		try {
			return await useHttp<InfoService.Info>(getCountryCatalog, {
				method: Http.Method.GET
			})
		} catch (error) {
			throw error
		}
	}

	async saveDeal(body: D): Promise<Response<any>> {
		const { saveDeal } = this.generateEndpoint()

		try {
			return await useHttp<any>(saveDeal, {
				// @ts-ignore
				body
			})
		} catch (error) {
			throw error
		}
	}

	async closeDeal(body: D): Promise<any> {
		const { closeDeal } = this.generateEndpoint()

		try {
			return await useHttp<any>(closeDeal, {
				// @ts-ignore
				body
			})
		} catch (error) {
			throw error
		}
	}

	async deleteDeal(id: string | number): Promise<any> {
		const { deleteDeal } = this.generateEndpoint()

		try {
			return await useHttp<any>(deleteDeal, {
				query: { id }
			})
		} catch (error) {
			throw error
		}
	}

	async calculate(body: DealService.CalculatePayload | any): Promise<any> {
		const { calculate } = this.generateEndpoint()

		try {
			return await useHttp<any>(calculate, {
				body
			})
		} catch (error) {
			throw error
		}
	}

	async generatePreCalculate(dealId: number, email: string): Promise<any> {
		const { generatePrecalc } = this.generateEndpoint()

		try {
			return await useHttp<any>(generatePrecalc, {
				body: {
					DealId: dealId,
					RecipientEmailAddress: email
				}
			})
		} catch (error) {
			throw error
		}
	}
}
