import { UserNoteFolderPO } from '../po/UserNoteFolderPO'

export interface UserNoteFolderVO extends UserNoteFolderPO {
	name: string
	children?: UserNoteFolderVO[]
}
