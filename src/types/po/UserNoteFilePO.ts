import { BasePO } from './BasePO'

export interface UserNoteFilePO extends BasePO {
	name: string
	content: string
	isLatest: number
	isFavorite: number
	userNoteFolderId: string
}
