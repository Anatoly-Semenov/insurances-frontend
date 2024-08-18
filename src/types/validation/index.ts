export namespace Validation {
	export type Value = string | number

	export enum Errors {
		RELATION_INSURANCE_SUM_TO_COST_EXCEPTION = "Значение должно быть 50 - 70",
		RELATION_INSURANCE_SUM_TO_COST = "Значение должно быть 35 - 50",
		COEFFICIENT_SMR = "должно быть в диапазоне 1 - 1.5",
		KM_TABEL = "Неправильно указан табельный номер КМ",
		DATE_FEATURE = "Дата не может быть меньше текущей",
		PASSPORT_SERIES = "Не корректная серия пасспорта",
		PASSPORT_NUMBER = "Не корректный номер пасспорта",
		PASSPORT_CODE = "Не корректный код подразделения",
		COEFFICIENT_ECO = "Должно быть в диапазоне 1 - 3",
		COEFFICIENT = "Должно быть значение от 0 до 10",
		AGE = "Возраст не может быть менее 18 лет",
		PHONE = "Не корректный номер телефона",
		EMPTY_NUMBER = "Должно быть больше 0",
		INN_COMPANY = "Должно быть 10 знаков",
		CHASSIS = "Не корректный номер шасси",
		KM_FIO = "Неправильно указано ФИО КМ",
		BANK_WALLET = "Должно быть 20 знаков",
		EMPTY = "Обязательно для заполнения",
		INN_IP = "Должно быть 12 знаков",
		VIN = "Не корректный VIN номер",
		OGRN = "Должно быть 13 знаков",
		NUMBER = "Должно быть числом",
		EMAIL = "Не корректный email",
		BIC = "Должно быть 9 знаков",
		KPP = "Должно быть 9 знаков",
		ID = "Неправильно указан ID",
		INN = "Не корректный ИНН"
	}

	export const enum Mask {
		KPP = "#########",
		BIK = KPP,
		DATE = "##.##.####",
		PTS = "## WW ######",
		FIVE_NUMBER = "#####",
		INN_SHORT = "##########",
		PASSPORT_CODE = "###-###",
		PASSPORT = "## ## ######",
		INN_LONG = "############",
		VIN = "*****************",
		CHASSIS = "**************",
		ENGINE_POWER = FIVE_NUMBER,
		PHONE = "+# (###) ###-##-##",
		PHONE_OLD = "+# ### ### ## ##",
		CAR_GOS_NUMBER = "R ### RR ###",
		BANK_WALLET = "####################"
	}

	export enum MaskTokens {
		ALL_WORDS = "[А-Я]|[а-я]|[A-Z]|[a-z]",
		ALL = `[A-Z]|[a-z]|[А-Я]|[а-я]|[0-9]`,
		RUSSIAN = "[А-Я]|[а-я]",
		ENG = "[A-Z]|][a-z]"
	}

	export enum MaskTokensName {
		ALL_WORDS = "W",
		RUSSIAN = "R",
		ENG = "Z",
		ALL = "*"
	}
}
