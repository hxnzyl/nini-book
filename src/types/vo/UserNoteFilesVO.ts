import { UserNoteFilePO } from '../po/UserNoteFilePO'
import { UserNoteFolderPO } from '../po/UserNoteFolderPO'

export interface UserNoteFilesVO extends UserNoteFilePO, UserNoteFolderPO {
	name: string
	isFolder?: number
	isFile?: number
	files?: UserNoteFilesVO[]
}
