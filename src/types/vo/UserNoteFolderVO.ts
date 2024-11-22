import { UserNoteFolderPO } from '../po/UserNoteFolderPO'

export interface UserNoteFolderVO extends UserNoteFolderPO {
	isFolder?: number
	children?: UserNoteFolderVO[]
}
