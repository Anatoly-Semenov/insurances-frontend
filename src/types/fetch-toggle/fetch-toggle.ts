export abstract class FetchToggle {
	public async start(): Promise<any> {}

	public async getAllToggles(): Promise<any> {}

	public async getToggle(toggleName: string): Promise<any> {}

	public async setUserId(userId: string): Promise<any> {}

	// @ts-ignore
	public checkIsEnabled(toggleName: string): boolean {}
}
