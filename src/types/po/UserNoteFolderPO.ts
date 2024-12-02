import { BasePO } from './BasePO'

export interface UserNoteFolderPO extends BasePO {
	name: string
	pid: string
	lvl: number
	isFavorite: number
}
