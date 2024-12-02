import { BasePO } from './BasePO'

export interface UserPO extends BasePO {
	name: string
	email: string
	avatar: string
}
