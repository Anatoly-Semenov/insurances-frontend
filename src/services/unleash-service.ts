import { UnleashClient } from "unleash-proxy-client"

// Types
import {
	FetchToggle,
	UnleashService as IUnleashService
} from "@common-repo/types/src"

export class UnleashService implements FetchToggle {
	private instance: UnleashClient

	constructor(
		url: string,
		appName: string,
		clientKey: string,
		environment: string = "default"
	) {
		this.instance = new UnleashClient({
			environment,
			clientKey,
			appName,
			url
		})
	}

	public async start(): Promise<UnleashClient> {
		await this.instance.start()

		return this.instance
	}

	public async getAllToggles(): Promise<IUnleashService.Toggle[]> {
		return await this.instance.getAllToggles()
	}

	public async getToggle(toggleName: string): Promise<IUnleashService.Variant> {
		return this.instance.getVariant(toggleName)
	}

	public async setUserId<T>(userId: string): Promise<T> {
		return this.instance.updateContext({ userId }) as T
	}

	public checkIsEnabled(toggleName: string): boolean {
		return this.instance.isEnabled(toggleName)
	}
}
