import { UserNoteFileVO } from './UserNoteFileVO'
import { UserNoteFolderVO } from './UserNoteFolderVO'

export interface UserNoteFilesVO {
	id: string
	name: string
	isFolder?: number
	isMenu?: number
	files?: Partial<UserNoteFileVO & UserNoteFolderVO>[]
}
