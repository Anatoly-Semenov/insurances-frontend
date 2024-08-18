import { Calculator, Endpoints } from "@common-repo/types/src"

export function useEndpoint(
	path: string,
	calculatorType: Calculator.Type,
	dealId?: number | string
) {
	const getDeal = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.GetDeal.OSAGO_SPECTECH + dealId
			case Calculator.TypeEnum.SPECTECH:
				return path + Endpoints.GetDeal.SPECTECH + dealId
			case Calculator.TypeEnum.BREAK:
				return path + Endpoints.GetDeal.BREAK + dealId
			case Calculator.TypeEnum.KASCO:
				return path + Endpoints.GetDeal.KASCO + dealId
			case Calculator.TypeEnum.MOTOR:
				return path + Endpoints.GetDeal.MOTOR + dealId
			case Calculator.TypeEnum.ASSET:
				return path + Endpoints.GetDeal.ASSET + dealId
			case Calculator.TypeEnum.AGRO:
				return path + Endpoints.GetDeal.AGRO + dealId
			case Calculator.TypeEnum.ECO:
				return path + Endpoints.GetDeal.ECO + dealId
			case Calculator.TypeEnum.SMR:
				return path + Endpoints.GetDeal.SMR + dealId
			case Calculator.TypeEnum.CYBER:
				return path + Endpoints.GetDeal.CYBER
			default:
				return path + Endpoints.GetDeal.CYBER
		}
	}).value

	const getDeals = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.GetDeals.OSAGO_SPECTECH
			default:
				return path + Endpoints.GetDeals.BASE
		}
	}).value

	const getModelsByMarkId = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.Info.GetModelsByMarkId.OSAGO_SPECTECH
			case Calculator.TypeEnum.KASCO:
				return path + Endpoints.Info.GetModelsByMarkId.KASCO
			default:
				return path + Endpoints.Info.GetModelsByMarkId.BASE
		}
	}).value

	const getMarks = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.Info.GetMarks.OSAGO_SPECTECH
			case Calculator.TypeEnum.KASCO:
				return path + Endpoints.Info.GetMarks.KASCO
			default:
				return path + Endpoints.Info.GetMarks.BASE
		}
	}).value

	const getSubcategoryTsType = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.Info.GetSubcategoryTsType.OSAGO_SPECTECH
			default:
				return path + Endpoints.Info.GetSubcategoryTsType.BASE
		}
	}).value

	const getCarDocumentType = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.Info.GetCarDocumentType.OSAGO_SPECTECH
			default:
				return path + Endpoints.Info.GetCarDocumentType.BASE
		}
	}).value

	const getCategoryTsType = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.Info.GetCategoryTsType.OSAGO_SPECTECH
			default:
				return path + Endpoints.Info.GetCategoryTsType.BASE
		}
	}).value

	const getInsuranceOpfs = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.Info.GetInsuranceOpfs.OSAGO_SPECTECH
			default:
				return path + Endpoints.Info.GetInsuranceOpfs.BASE
		}
	}).value

	const getInsuranceDocumentsTypes = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.Info.GetInsuranceDocumentsTypes.OSAGO_SPECTECH
			default:
				return path + Endpoints.Info.GetInsuranceDocumentsTypes.BASE
		}
	}).value

	const getAvailableTariffs = computed((): string => {
		switch (calculatorType) {
			default:
				return path + Endpoints.GetAvailableTariffs.BASE
		}
	}).value

	const getSubjectsOfFederation = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.SPECTECH:
				return Endpoints.Info.GetSubjectsOfFederation.SPECTECH
			case Calculator.TypeEnum.ASSET:
				return Endpoints.Info.GetSubjectsOfFederation.ASSET
			default:
				return Endpoints.GetAvailableTariffs.BASE
		}
	}).value

	const getOptionsByTariff = computed((): string => {
		switch (calculatorType) {
			default:
				return path + Endpoints.GetOptionsByTariff.BASE
		}
	}).value

	const getIndustries = computed((): string => {
		switch (calculatorType) {
			default:
				return path + Endpoints.GetIndustries.BASE
		}
	}).value

	const getFacilitiesTypes = computed((): string => {
		switch (calculatorType) {
			default:
				return path + Endpoints.GetFacilitiesTypes.BASE
		}
	}).value

	const getFacilitiesDescriptions = computed((): string => {
		switch (calculatorType) {
			default:
				return path + Endpoints.GetFacilitiesDescriptions.BASE
		}
	}).value

	const getCountryCatalog = computed((): string => {
		switch (calculatorType) {
			default:
				return path + Endpoints.GetCountryCatalog.BASE
		}
	}).value

	const saveDeal = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.SaveDeal.OSAGO_SPECTECH
			case Calculator.TypeEnum.SPECTECH:
				return path + Endpoints.SaveDeal.SPECTECH
			default:
				return path + Endpoints.SaveDeal.BASE
		}
	}).value

	const closeDeal = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.CloseDeal.OSAGO_SPECTECH
			default:
				return path + Endpoints.CloseDeal.BASE
		}
	}).value

	const deleteDeal = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.OSAGO_SPECTECH:
				return path + Endpoints.DeleteDeal.OSAGO_SPECTECH
			default:
				return path + Endpoints.DeleteDeal.BASE
		}
	}).value

	const generatePrecalc = computed((): string => {
		switch (calculatorType) {
			default:
				return path + Endpoints.GeneratePrecalc.BASE
		}
	}).value

	const calculate = computed((): string => {
		switch (calculatorType) {
			case Calculator.TypeEnum.SPECTECH:
				return path + Endpoints.Calculate.SPECTECH
			case Calculator.TypeEnum.ECO:
				return path + Endpoints.Calculate.ECO
			case Calculator.TypeEnum.SMR:
				return path + Endpoints.Calculate.SMR
			default:
				return path + Endpoints.Calculate.BASE
		}
	}).value

	return {
		getFacilitiesDescriptions,
		getSubjectsOfFederation,
		getInsuranceDocumentsTypes,
		getSubcategoryTsType,
		getAvailableTariffs,
		getOptionsByTariff,
		getFacilitiesTypes,
		getCarDocumentType,
		getCategoryTsType,
		getModelsByMarkId,
		getCountryCatalog,
		generatePrecalc,
		getIndustries,
		getInsuranceOpfs,
		deleteDeal,
		closeDeal,
		calculate,
		getDeals,
		saveDeal,
		getMarks,
		getDeal
	}
}
