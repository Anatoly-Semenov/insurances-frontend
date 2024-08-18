// Types
import type {
	VerificationService,
	DealService,
	Calculator,
	Info
} from "@common-repo/types/src"

import type {
	State,
	StatePassport,
	ForeignerField,
	SecondDocumentType
} from "~/store/base-calculator"

export namespace CalculatorBaseStore {
	export interface Actions {
		setUploadedAddressData(data: VerificationService.SuggestionData): void
		setUploadedInsurerData(data: VerificationService.SuggestionData): void
		setDealData(fieldName: Calculator.DealDataField, value: string): void
		setUploadedData(company: VerificationService.Company): void
		setSignatoryByPassportData(passport: StatePassport): void
		setCalculatorType(calculatorType: Calculator.Type): void
		setTimeoutVerify(value: boolean, timeout: number): void
		fetchRegionDataIfExist(region: number): Promise<void>
		setDeals(deals: DealService.ArchiveDeal[]): void
		resetForeignerData(passportIndex: number): void
		setDealStatus(status: DealService.Status): void
		fetchGosbIfExist(terBank: string): Promise<void>
		setDealSignatory(deal: DealService.Deal): void
		setDealForeigner(deal: DealService.Deal): void
		setDealIntroData(deal: DealService.Deal): void
		setDealMainInfo(deal: DealService.Deal): void
		setDealPassport(deal: DealService.Deal): void
		deleteDeal(id: string | number): Promise<void>
		fetchDeal(id: string | number): Promise<void>
		setDealAddress(deal: DealService.Deal): void
		copyDeal(id: string | number): Promise<void>
		setActiveSignatoryName(name: string): void
		fetchDataByBik(bik: number): Promise<void>
		deletePassportByIndex(index: number): void
		setPolicyholderEmail(email: string): void
		setDealMain(deal: DealService.Deal): void
		setRegistrationDataFromProfile(): void
		redirectToDeal(dealId: number): void
		setDeal(deal: DealService.Deal): void
		setDataByBik(response: string): void
		setLoading(payload: boolean): void
		prefetchDealLists(): Promise<void>
		fetchOpfIdByCode(): Promise<void>
		setVerify(payload: boolean): void
		resetStateByData(data: any): void
		changeInn(payload: string): void
		fetchDataByInn(): Promise<void>
		setDealId(id: number): void
		resetSignatoryData(): void
		fetchDeals(): Promise<void>
		calculate(): Promise<void>
		closeDeal(): Promise<void>
		verify(): Promise<void>
		addPassport(): void
		setData<T = any>(
			tab: Calculator.Tab,
			component: string,
			fieldName: string,
			value: T
		): void
		saveDeal({
			isSaveCalculation
		}: {
			isSaveCalculation: boolean
		}): Promise<void>
		setPassportData(
			fieldName: keyof StatePassport,
			value: any,
			index: number
		): void
		setForeignerData(
			fieldName: ForeignerField,
			value: string | SecondDocumentType,
			index: number
		): void
		setDealForeignerData(
			foreigner: DealService.SecondDocumentObj,
			passportIndex: number
		): void
	}

	export interface Getters {
		getFieldPassport(): (fieldName: keyof StatePassport, index: number) => any
		getFieldRegistration(): (componentName: string, fieldName: string) => any
		getFieldForeigner(): (fieldName: ForeignerField, index: number) => any
		getFieldInsurer(): (componentName: string, fieldName: string) => any
		getFieldPayment(): (componentName: string, fieldName: string) => any
		getRegistrationContractData(): DealService.RegistrationContractData
		getSigningPersonInfoWithSignatory(): DealService.SigningPersonInfo
		getFieldDeal(): (fieldName: Calculator.DealDataField) => any
		getVerifyPayload(): VerificationService.CompanyPayload
		getSigningPersonInfo(): DealService.SigningPersonInfo
		getCompanyRequisites(): DealService.CompanyRequisites
		getPassportByName(): (name: string) => StatePassport
		getCalculatePayload(): DealService.CalculatePayload
		getInn(): State["insurer"]["main"]["companyInn"]
		getPersonInfoList(): DealService.PersonInfo[]
		getCalculatorType(): State["calculatorType"]
		getIsLoadingClose(): State["isLoadingClose"]
		getIsLoadingSave(): State["isLoadingSave"]
		getDealContact(): DealService.DealContact
		getDeals(): DealService.ArchiveDeal[]
		getCompanyType(): Info.CompanyType
		getDealId(): State["deal"]["id"]
		getIsVerify(): State["isVerify"]
		getIsValidCalculation(): boolean
		getField<T = string | null>(): (
			tab: Calculator.Tab,
			componentName: string,
			fieldName: string
		) => T
		getPersonSecondDocument(): (
			passport: StatePassport
		) => DealService.SecondDocument
		getPassports(): StatePassport[]
		getCanCloseSignatory(): boolean
		getPolicyholderEmail(): string
		getIsEmptySignatory(): boolean
		getAddressFullManual(): string
		getCanCloseInsurer(): boolean
		getHaveCompanyType(): boolean
		getPassportsLength(): number
		getOgrnIssueDate(): string
		getPrice(): State["price"]
		getCanCloseDeal(): boolean
		getAddressFull(): string
		getIsValidInn(): boolean
		getSumInsured(): number
		getIsLoading(): boolean
		getCanVerify(): boolean
		getCanDraft(): boolean
		getIsSended(): boolean
	}
}
