import { SearcherProps } from '@/components/searcher'
import DateUtils from '@/lib/date'
import SearcherUtils from '@/lib/searcher'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import { Reducer } from 'react'

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
	key: keyof typeof HomeActions | keyof HomeState
	value: Partial<HomeState> | HomeState[keyof HomeState]
	searcher?: SearcherProps
	event?: React.SyntheticEvent
}

/**
 * Home Actions
 */
const HomeActions = {
	all(state: HomeState, action: HomeAction) {
		Object.assign(state, action.value)
		action.value = state.folders
		// setActiveFolder during Initialization
		HomeActions.setActiveFolder(state, action)
	},
	folders(state: HomeState, action: HomeAction) {
		state.folders = action.value as UserNoteFolderVO
		HomeActions.setActiveFolder(state, action)
	},
	search(state: HomeState, action: HomeAction) {
		state.keyword = action.value as string
		state.filterFiles = SearcherUtils.filter(state.activeFiles, ['name', 'content'], state.keyword, action.searcher)
	},
	setActiveFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		const files = (folders.children || [])
			.filter((file) => !file.isNew)
			.concat(state.notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folders.id) as [])
		state.activeNote = files.find((file) => !file.isFolder)
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = { id: folders.id, pid: folders.pid, name: folders.name, isFolder: 1 }
		state.keyword = ''
	},
	setActiveMenu(state: HomeState, action: HomeAction) {
		const menu = action.value as MenuVO
		const field = ('is' + menu.name) as keyof UserNoteFileVO
		const files = state.notes.filter((note) => (field === 'isRecycle' || !note.isRecycle) && note[field])
		state.activeNote = files.find((file) => file.isFile)
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = { id: menu.id, name: menu.name, isMenu: 1 }
		state.keyword = ''
	},
	newFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		folders.children.push({
			id: Math.round(performance.now() * 10) + '',
			name: `New Folder(${folders.children.length + 1})`,
			lvl: folders.lvl + 1,
			children: [],
			pid: folders.id,
			date: DateUtils.getCurrentDate(),
			isFolder: 1,
			isNew: true
		})
	},
	addFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		const focusEvent = action.event as React.FocusEvent<HTMLInputElement>
		const focusInput = focusEvent.target
		const folderName = focusInput.value
		if (folderName == null || folderName === '') {
			focusInput.value = folders.name
			focusInput.select()
		} else {
			folders.name = folderName
			folders.isNew = false
			HomeActions.setActiveFolder(state, action)
		}
	},
	newDocument(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		const newNote = {
			id: Math.round(performance.now() * 10) + '',
			name: `New Document(${state.notes.length + 1})`,
			content: '',
			date: DateUtils.getCurrentDate(),
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0,
			userNoteFolderId: folders.id,
			isFile: 1,
			isNew: true
		}
		state.notes.push(newNote)
		const files = (folders.children || []).concat(
			state.notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folders.id) as []
		)
		state.notes = state.notes
		state.activeNote = newNote
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = { id: folders.id, pid: folders.pid, name: folders.name, isFolder: 1 }
		state.keyword = ''
	}
}

/**
 * Home Reducer
 *
 * @param state
 * @param action
 * @returns
 */
export const HomeReducer: Reducer<HomeState, HomeAction> = (state: HomeState, action: HomeAction) => {
	if (action.key in HomeActions) {
		HomeActions[action.key as keyof typeof HomeActions](state, action)
	} else {
		// Refresh Data, keyof HomeState
		Object.assign(state, { [action.key]: action.value })
	}
	return { ...state }
}
