import { UserNoteFilePO } from '../po/UserNoteFilePO'

export interface UserNoteFileVO extends UserNoteFilePO {
	isFile?: number
	isNew?: boolean
}
