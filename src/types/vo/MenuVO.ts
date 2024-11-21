import { LucideIconName } from '@/components/lucide-icon'
import { MenuPO } from '../po/MenuPO'
import { UserNoteFilePO } from '../po/UserNoteFilePO'

export interface MenuVO extends MenuPO {
	notes?: UserNoteFilePO[]
	children?: MenuVO[]
	icon?: LucideIconName
}
