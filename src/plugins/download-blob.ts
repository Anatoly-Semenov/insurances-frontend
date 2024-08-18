declare module "#app" {
	interface NuxtApp {
		$downloadBlob(blob: Blob, fileName: string): void
	}
}

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$downloadBlob(blob: Blob, fileName: string): void
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			downloadBlob(blob: Blob, fileName: string = "file"): void {
				const a = document.createElement("a")

				const url = window.URL.createObjectURL(blob)

				a.href = url
				a.download = fileName
				a.click()
				window.URL.revokeObjectURL(url)
			}
		}
	}
})
