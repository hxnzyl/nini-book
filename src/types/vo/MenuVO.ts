import { MenuPO } from '../po/MenuPO'

export interface MenuVO extends MenuPO {
	isFolder: boolean
	isMenu: boolean
	children: MenuVO[]
}
