export interface UserNoteFilePO {
	id: string
	name: string
	date: string
	content: string
	isLatest: number
	isRecycle: number
	isFavorite: number
	userNoteFolderId: string
}
