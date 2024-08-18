export namespace UiUpload {
	export interface Headers {
		[key: string]: string
	}

	export type UploadFileStatus =
		| "error"
		| "success"
		| "done"
		| "uploading"
		| "removed"

	export interface OriRcFile extends File {
		uid: string
	}

	export interface FileType extends OriRcFile {
		readonly lastModifiedDate: Date
	}

	export interface UploadFile<T = any> {
		uid: string
		size?: number
		name: string
		fileName?: string
		lastModified?: number
		lastModifiedDate?: Date
		url?: string
		status?: UploadFileStatus
		percent?: number
		thumbUrl?: string
		originFileObj?: FileType
		response?: T
		error?: any
		linkProps?: any
		type?: string
		xhr?: T
		preview?: string
	}

	export interface UploadChangeParam<T = UploadFile> {
		file: T
		fileList: UploadFile[]
		event?: {
			percent: number
		}
	}

	export interface FileListItem {
		uid: string
		name: string
		status: string
		url: string
	}

	export type FileList = FileListItem[]
}
