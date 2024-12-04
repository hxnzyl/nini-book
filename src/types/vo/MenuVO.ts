import { LucideIconName } from '@/components/lucide-icon'
import { MenuPO } from '../po/MenuPO'

export interface MenuVO extends MenuPO {
	icon?: LucideIconName
	isFolder: number
	isMenu: number
}
