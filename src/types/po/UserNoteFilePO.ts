import { LocalTableBasePO } from '@/lib/local-table'

class UserNoteFilePO extends LocalTableBasePO {
	name: string = ''
	content: string = ''
	isLatest: number = 0
	isFavorite: number = 0
	userNoteFolderId: string = ''
}

export { UserNoteFilePO }
