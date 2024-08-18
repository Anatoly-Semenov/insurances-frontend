// Hooks
import { useHttp } from "~/hooks"

// Types
import type { VerificationService as IVerificationService } from "@common-repo/types/src"
type Company = IVerificationService.CompanyResponse
type CompanyPayload = IVerificationService.CompanyPayload

export class VerificationService {
	async verifyCompany(body: CompanyPayload): Promise<Company> {
		try {
			return await useHttp<Company>("/Verification/Company", { body })
		} catch (error) {
			throw error
		}
	}

	async fetchDataByInn(
		inn: string | number,
		VerificationGuid: string
	): Promise<Company> {
		try {
			return await useHttp<Company>("/Verification/Company", {
				body: {
					ApiClientGuid: VerificationGuid,
					Query: {
						query: `${inn}`
					}
				}
			})
		} catch (error) {
			throw error
		}
	}
}
