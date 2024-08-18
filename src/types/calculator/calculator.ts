export namespace Calculator {
	export enum DealDataField {
		RESPONSIBLE_EMAIL = "responsibleEmail",
		STATUS = "status",
		DATE = "date",
		ID = "id"
	}

	export const enum CvMin {
		OSAGO_SPECTECH = 10,
		SPECTECH = 1,
		ASSET = 1,
		BASE = 5,
		ECO = 10,
		SMR = 1
	}

	export const enum CvMax {
		OSAGO_SPECTECH = 10,
		KASCO_UNKNOWN = 50,
		KASCO_SOGAZ = 45,
		KASCO_VSK = 35,
		SPECTECH = 45,
		ASSET = 50,
		BREAK = 80,
		BASE = 40,
		ECO = 80,
		SMR = 80
	}
}
