import { UserNoteFolderPO } from '../po/UserNoteFolderPO'

export interface UserNoteFolderVO extends UserNoteFolderPO {
	isFolder: number
	isNew?: boolean
	children: UserNoteFolderVO[]
}
