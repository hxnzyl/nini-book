import { UserNoteFolderPO } from '../po/UserNoteFolderPO'

class UserNoteFolderVO extends UserNoteFolderPO {
	isFolder: boolean = true
	isMenu: boolean = false
	isAdd: boolean = false
	isEdit: boolean = false
	children: UserNoteFolderVO[] = []
}

export { UserNoteFolderVO }
