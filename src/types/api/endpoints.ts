export namespace Endpoints {
	export const enum GetDeal {
		OSAGO_SPECTECH = "/api/Deal/v1/getDeal?id=",
		SPECTECH = "/api/deal/v1/getDeal?id=",
		AGRO = "/api/deal/v1?dealId=",
		KASCO = "/deal/getDeal?id=",
		BREAK = "/deal/getDeal?id=",
		MOTOR = "/deal/getDeal?id=",
		ECO = "/deal/getDeal?id=",
		SMR = "/deal/getDeal?id=",
		CYBER = "/Deal/GetDeal",
		ASSET = "/deal/get?id="
	}

	export const enum GetDeals {
		OSAGO_SPECTECH = "/api/Deal/v1/getList",
		BASE = "/deal/getList"
	}

	export namespace Info {
		export const enum GetModelsByMarkId {
			OSAGO_SPECTECH = "/eosago-spectech/api/Info/v1/getModelsByMarkId",
			KASCO = "/kasco/Info/GetModelsByMarkId",
			BASE = "/Info/GetModelsByMarkId"
		}

		export const enum GetMarks {
			OSAGO_SPECTECH = "/eosago-spectech/api/Info/v1/GetCarMarks",
			KASCO = "/kasco/Info/GetMarks",
			BASE = "/Info/GetMarks"
		}

		export const enum GetSubcategoryTsType {
			OSAGO_SPECTECH = "/eosago-spectech/api/Info/v1/getSubcategoryTsType",
			BASE = "/Info/v1/getSubcategoryTsType"
		}

		export const enum GetCarDocumentType {
			OSAGO_SPECTECH = "/eosago-spectech/api/Info/v1/getCarDocumentType",
			BASE = "/Info/v1/getCarDocumentType"
		}

		export const enum GetCategoryTsType {
			OSAGO_SPECTECH = "/eosago-spectech/api/Info/v1/getCategoryTsType",
			BASE = "/Info/v1/getCategoryTsType"
		}

		export const enum GetInsuranceOpfs {
			OSAGO_SPECTECH = "/eosago-spectech/api/Info/v1/getCategoryTsType",
			BASE = "/Info/v1/getCategoryTsType"
		}

		export const enum GetInsuranceDocumentsTypes {
			OSAGO_SPECTECH = "/eosago-spectech/api/Info/v1/getInsuranceDocumentsTypes",
			BASE = "/Info/v1/getInsuranceDocumentsTypes"
		}

		export const enum GetSubjectsOfFederation {
			ASSET = "/asset/api/info/v1/getSubjectsOfDistrict",
			SPECTECH = "/spectech/api/info/v1/getSubjects",
			BASE = "/api/info/v1/getSubjectsOfDistrict"
		}
	}

	export const enum GetAvailableTariffs {
		BASE = "/Info/GetAvailableTariffs"
	}

	export const enum GetOptionsByTariff {
		BASE = "/Info/GetOptionsByTariff"
	}

	export const enum GetIndustries {
		BASE = "/Info/GetIndustries"
	}

	export const enum GetFacilitiesTypes {
		BASE = "/Info/GetFacilitiesTypes"
	}

	export const enum GetFacilitiesDescriptions {
		BASE = "/Info/GetFacilitiesDescriptions"
	}

	export const enum GetCountryCatalog {
		BASE = "/getCountryCatalog"
	}

	export const enum SaveDeal {
		OSAGO_SPECTECH = "/api/Deal/v1/save",
		SPECTECH = "/api/deal/v1/save",
		BASE = "/Deal/Save"
	}

	export const enum CloseDeal {
		OSAGO_SPECTECH = "/api/Deal/v1/close",
		BASE = "/Deal/Close"
	}

	export const enum DeleteDeal {
		OSAGO_SPECTECH = "/api/Deal/v1/delete",
		BASE = "/Deal/Delete"
	}

	export const enum GeneratePrecalc {
		BASE = "/document/GeneratePrecalc"
	}

	export const enum Calculate {
		OSAGO_SPECTECH = "/api/Calculation/v1/calculate",
		SPECTECH = "/api/calculation/v1/calculate",
		BASE = "/Calculator/Calculate",
		ECO = "/Calculation/Calculate",
		SMR = "/Calculation/Calculate"
	}
}
