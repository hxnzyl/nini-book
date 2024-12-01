'use client'

import { addFolder } from '@/api/folders'
import { SearcherProps } from '@/contexts/searcher'
import ArrayUtils from '@/lib/array'
import DateUtils from '@/lib/date'
import SearcherUtils from '@/lib/searcher'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import { Reducer } from 'react'
import { ToasterAction } from './toaster'

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

type HomeStateKeys = keyof HomeState

export interface HomeAction extends SearcherProps {
	key: HomeActionKeys | HomeStateKeys
	value: Partial<HomeState> | HomeState[HomeStateKeys]
	target?: HTMLInputElement
}

type HomeActionKeys = keyof typeof HomeActions

export type HomeVerifyKeys = keyof typeof HomeVerify

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
		state.filterFiles = SearcherUtils.filter(state.activeFiles, ['name', 'content'], state.keyword, action)
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
		folders.isNew = false
		HomeActions.setActiveFolder(state, action)
		addFolder(folders)
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
 * Home verify before dispatch
 *
 */
export const HomeVerify = {
	/**
	 * Determine if the folder
	 *
	 * @param state
	 * @param action
	 * @returns
	 */
	addFolder(state: HomeState, action: HomeAction): ToasterAction | void {
		const folders = action.value as UserNoteFolderVO
		const focusInput = action.target as HTMLInputElement
		const folderName = focusInput?.value
		if (folders.name == null || folders.name === '') {
			// The folder name is empty
			focusInput.value = folders.name
			focusInput.select()
		} else if (
			ArrayUtils.findChildren([state.folders], (folder) => folder.id !== folders.id && folder.name === folderName)
		) {
			// The folder name is exist
			focusInput.select()
			return {
				key: 'add',
				value: {
					duration: 3000,
					title: 'Nini Book Toast',
					description: 'The folder name is existing, Please rename.',
					variant: 'destructive'
				}
			}
		} else {
			// Set folder name
			folders.name = folderName
		}
	},
	/**
	 * Determine if the document
	 *
	 * @param state
	 * @param action
	 */
	newDocument(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		const noteName = `New Document(${state.notes.length + 1})`
		if (
			ArrayUtils.findChildren(state.notes, (note) => note.userNoteFolderId === folders.id && note.name === noteName)
		) {
			// The note name is exist
			return {
				key: 'add',
				value: {
					duration: 3000,
					title: 'Nini Book Toast',
					description: 'The note name is existing, Please rename.',
					variant: 'destructive'
				}
			}
		}
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
		HomeActions[action.key as HomeActionKeys](state, action)
	} else {
		// Refresh Data, keyof HomeState
		state[action.key as HomeStateKeys] = action.value as never
	}
	return { ...state }
}
