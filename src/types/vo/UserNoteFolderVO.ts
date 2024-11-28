import { UserNoteFolderPO } from '../po/UserNoteFolderPO'

export interface UserNoteFolderVO extends UserNoteFolderPO {
	isFolder: number
	isInput?: number
	children: UserNoteFolderVO[]
}
