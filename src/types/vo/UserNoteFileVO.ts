import { UserNoteFilePO } from '../po/UserNoteFilePO'

class UserNoteFileVO extends UserNoteFilePO {
	isFile: boolean = true
	isAdd: boolean = false
	isEdit: boolean = false
}

export { UserNoteFileVO }
