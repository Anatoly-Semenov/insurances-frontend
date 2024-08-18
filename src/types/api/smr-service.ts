import { DealService, Response } from "@common-repo/types/src"

export namespace SmrService {
	export interface Deal extends DealService.Deal {
		beneficiaryDocumentListLoan: BeneficiaryDocumentLoan[]
		personInfoList: DealService.PersonInfo[]
		contractorExperience: number | string
		isExpLessOneYear: boolean
		workingStartDate: string
		completionStage: boolean
		installmentType: number
		multiplyingKoef: number
		objectPosition: string
		workingEndDate: string
		waterDistance: boolean
		ppGoStartDate: string
		installment: boolean
		objectRegion: number
		objectWorker: number
		bankFinance: number
		beneficiary: number
		objectOwner: string
		workTypes: number[]
		ppGoEndDate: string
		reasonDate: string
		ppGoInsSum: number
		objectName: string
		employees: never[]
		workingSum: number
		goInsurSum: number
		objectDoc: string
		creditDoc: string
		franchise: number
		basePrice: number
		ppGoPrice: number
		goPrice: number
		ppGo: boolean
		insSum: number
		files: File[]
		go: boolean
		kpp: string
	}

	export interface File {
		name: FileName | null
		idDoc: number
	}

	export enum FileName {
		EXTRACT_FROM_EGRP = "extractFromEgrp",
		BUILDING_PERMIT = "buildingPermit",
		WORK_SCHEDULE = "workSchedule",
		DOP_CONTRACT = "dopContract",
		EXPERTISE = "expertise",
		CONTRACT = "contract",
		ESTIMATE = "estimate"
	}

	export interface Files {
		[FileName.BUILDING_PERMIT]: File
		[FileName.WORK_SCHEDULE]: File
		[FileName.DOP_CONTRACT]: File
		[FileName.EXPERTISE]: File
		[FileName.CONTRACT]: File
		[FileName.ESTIMATE]: File
	}

	export enum CalculationType {
		PGO = "Ppgo",
		DEFAULT = "",
		GO = "Go"
	}

	export type BeneficiaryDocumentLoan = DealService.BeneficiaryDocument

	export type DealResponse = Response<Deal>
}
