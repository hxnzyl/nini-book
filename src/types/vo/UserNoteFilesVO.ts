import { UserNoteFileVO } from './UserNoteFileVO'
import { UserNoteFolderVO } from './UserNoteFolderVO'

export interface UserNoteFilesVO extends UserNoteFileVO, UserNoteFolderVO {
	files?: UserNoteFilesVO[]
}
