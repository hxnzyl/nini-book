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

export const HomeContext = createContext({} as HomeContext)

export interface HomeState {
	user: UserVO
	menus: MenuVO[]
	notes: UserNoteFileVO[]
	folders: UserNoteFolderVO
	activeNote?: Partial<UserNoteFileVO>
	activeFolder: Partial<UserNoteFilesVO>
	activeFiles: Partial<UserNoteFileVO & UserNoteFolderVO>[]
	filterFiles: Partial<UserNoteFileVO & UserNoteFolderVO>[]
	keyword: string
}

export interface HomeAction {
	key:
		| 'all'
		| 'search'
		| 'setActiveFolder'
		| 'setActiveNote'
		| 'setActiveMenu'
		| 'newFolder'
		| 'addFolder'
		| keyof HomeState
	value: Partial<HomeState> | HomeState[keyof HomeState]
	searcher?: SearcherProps
	event?: React.SyntheticEvent
}

export interface HomeContext {
	state: HomeState
	stateDispatch: Dispatch<HomeAction>
	sidebarWidth: string[]
	setSidebarWidth: Dispatch<SetStateAction<string[]>>
	isActive: (notes?: UserNoteFilesVO) => boolean
	isColumns: (type: 1 | 2 | 3) => boolean
}

/**
 * Home State Reducer
 *
 * @param state
 * @param action
 * @returns
 */
export const HomeReducer: Reducer<HomeState, HomeAction> = (state: HomeState, action: HomeAction) => {
	let { key, value } = action
	if (key === 'all') {
		// setActiveFolder during Initialization
		state = value as HomeState
		key = 'setActiveFolder'
		value = state.folders
	}
	const newState = {} as HomeState
	const { notes, folders } = state
	if (key === 'search') {
		// Change from search
		newState.keyword = value as string
		newState.filterFiles = SearcherUtils.filter(
			state.activeFiles,
			['name', 'content'],
			newState.keyword,
			action.searcher
		)
	} else if (key === 'setActiveFolder') {
		// Change from folder
		const folder = value as UserNoteFolderVO
		const files = (folder.children || [])
			.filter((file) => !file.isNew)
			.concat(notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folder.id) as [])
		newState.activeNote = files.find((file) => !file.isFolder)
		newState.activeFiles = files
		newState.filterFiles = files
		newState.activeFolder = { id: folder.id, pid: folder.pid, name: folder.name, isFolder: 1 }
		newState.keyword = ''
	} else if (key === 'setActiveMenu') {
		// Change from menu
		const menu = value as MenuVO
		const isField = ('is' + menu.name) as keyof UserNoteFileVO
		const files = notes.filter((note) => (isField === 'isRecycle' || !note.isRecycle) && note[isField])
		newState.activeNote = files.find((file) => file.isFile)
		newState.activeFiles = files
		newState.filterFiles = files
		newState.activeFolder = { id: menu.id, name: menu.name, isMenu: 1 }
		newState.keyword = ''
	} else if (key === 'setActiveNote') {
		// Change from file
		newState.activeNote = value as UserNoteFileVO
	} else if (key === 'newFolder') {
		const folder = value as UserNoteFolderVO
		folder.children.push({
			id: Math.round(performance.now() * 10) + '',
			name: `New Folder(${folder.children.length + 1})`,
			lvl: folder.lvl + 1,
			isFolder: 1,
			children: [],
			pid: folder.id,
			time: performance.now(),
			isNew: true
		})
		newState.folders = folders
	} else if (key === 'addFolder') {
		const folder = value as UserNoteFolderVO
		const focusEvent = action.event as React.FocusEvent<HTMLInputElement>
		const focusInput = focusEvent.target
		const folderName = focusInput.value
		if (folderName == null || folderName === '') {
			focusInput.value = folder.name
			focusInput.select()
		} else {
			folder.isNew = false
			newState.folders = folders
			newState.activeFolder = folder
		}
	} else {
		// Refresh Data, keyof HomeState
		Object.assign(newState, { [key]: state[key] })
	}
	return { ...state, ...newState }
}

/**
 * Home Useful
 *
 * @returns
 */
export function useHome() {
	const context = useContext(HomeContext)
	if (!context) {
		throw new Error('useHome must be used within a HomeStateContext.Provider.')
	}

	return context
}
