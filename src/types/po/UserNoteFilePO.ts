export interface UserNoteFilePO {
	id: string
	date?: string
	name?: string
	content?: string
	isLatest?: number
	isRecycle?: number
	isFavorite?: number
	userNoteFolderId?: string
	userNoteFolderName?: string
}
