import { LocalTableBasePO } from '@/lib/local-table'

class UserNoteFolderPO extends LocalTableBasePO {
	name: string = ''
	pid: string = ''
	lvl: number = 0
	isFavorite: number = 0
}

export { UserNoteFolderPO }
