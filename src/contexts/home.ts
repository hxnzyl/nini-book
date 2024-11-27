import { SearcherProps } from '@/components/searcher'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export const SIDEBAR_WIDTH = ['36rem', '16rem', '20rem']
export const SIDEBAR_ICON_WIDTH = '3rem'

export interface HomeData {
	user: UserVO
	menus: MenuVO[]
	notes: UserNoteFileVO[]
	folders: UserNoteFolderVO
}

export interface HomeState {
	activeNote?: Partial<UserNoteFileVO>
	activeFolder: Partial<UserNoteFilesVO>
	activeFiles: Partial<UserNoteFileVO & UserNoteFolderVO>[]
	filterFiles: Partial<UserNoteFileVO & UserNoteFolderVO>[]
	keyword: string
}

export interface HomeAction {
	type: 'folder' | 'file' | 'menu' | 'keyword'
	target: UserNoteFolderVO | UserNoteFileVO | Partial<UserNoteFileVO & UserNoteFolderVO> | MenuVO | string
	data?: HomeData
	searcher?: Required<SearcherProps>
}

export interface HomeContext {
	data: HomeData
	state: HomeState
	dispatch: (action: HomeAction) => void
	sidebarWidth: string[]
	setSidebarWidth: Dispatch<SetStateAction<string[]>>
	isActive: (notes?: UserNoteFilesVO) => boolean
	isColumns: (type: 1 | 2 | 3) => boolean
}

export const HomeContext = createContext({} as HomeContext)

export function useHome() {
	const context = useContext(HomeContext)
	if (!context) {
		throw new Error('useHome must be used within a HomeContext.Provider.')
	}

	return context
}
