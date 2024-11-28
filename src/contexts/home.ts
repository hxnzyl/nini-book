import { SearcherProps } from '@/components/searcher'
import SearcherUtils from '@/lib/searcher'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import { Dispatch, Reducer, SetStateAction, createContext, useContext } from 'react'

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
	refreshData: (fetch: PromiseProps<HomeData>) => void
	state: HomeState
	dispatch: (action: HomeAction) => void
	sidebarWidth: string[]
	setSidebarWidth: Dispatch<SetStateAction<string[]>>
	isActive: (notes?: UserNoteFilesVO) => boolean
	isColumns: (type: 1 | 2 | 3) => boolean
}

export const HomeContext = createContext({} as HomeContext)

/**
 * Home Useful
 *
 * @returns
 */
export function useHome() {
	const context = useContext(HomeContext)
	if (!context) {
		throw new Error('useHome must be used within a HomeContext.Provider.')
	}

	return context
}

/**
 * Home Reducer
 *
 * @param state
 * @param action
 * @returns
 */
export const HomeReducer: Reducer<HomeState, Required<HomeAction>> = (
	state: HomeState,
	action: Required<HomeAction>
) => {
	const { type, target, data } = action
	let { keyword, activeNote, activeFolder, activeFiles, filterFiles } = state
	if (type === 'menu') {
		// Change from menu
		const menu = target as MenuVO
		const isField = ('is' + menu.name) as keyof UserNoteFileVO
		const files = data.notes.filter((note) => (isField === 'isRecycle' || !note.isRecycle) && note[isField])
		activeNote = files.find((file) => file.isFile)
		activeFiles = filterFiles = files
		activeFolder = { id: menu.id, name: menu.name, isMenu: 1 }
		keyword = ''
	} else if (type === 'folder') {
		// Change from folder
		const folder = target as UserNoteFolderVO
		const files = (folder.children || []).concat(
			data.notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folder.id) as []
		)
		activeNote = files.find((file) => !file.isFolder)
		activeFiles = filterFiles = files
		activeFolder = { id: folder.id, pid: folder.pid, name: folder.name, isFolder: 1 }
		keyword = ''
	} else if (type === 'file') {
		// Change from file
		activeNote = target as UserNoteFileVO
	} else {
		// Change from search
		keyword = target as string
		filterFiles = SearcherUtils.filter(activeFiles, ['name', 'content'], keyword, action.searcher)
	}
	return { activeFolder, activeFiles, filterFiles, activeNote, keyword }
}
