import { UserNoteFolderPO } from '../po/UserNoteFolderPO'

export interface UserNoteFolderVO extends UserNoteFolderPO {
	isFolder: number
	isMenu: number
	isAdd?: boolean
	isEdit?: boolean
	children: UserNoteFolderVO[]
}
