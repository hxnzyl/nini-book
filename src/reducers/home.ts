import { addFolder, updateFolder } from '@/api/folders'
import { addNote, updateNote } from '@/api/notes'
import { SearcherProps } from '@/contexts/searcher'
import DateUtils from '@/lib/date'
import SearcherUtils from '@/lib/searcher'
import TreeUtils from '@/lib/tree'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import { Reducer } from 'react'
import { UserNoteFileVO } from './../types/vo/UserNoteFileVO'
import { ToasterAction } from './toaster'

export interface HomeState {
	user: UserVO
	menus: MenuVO[]
	notes: UserNoteFileVO[]
	recycleNotes: UserNoteFileVO[]
	folders: UserNoteFolderVO[]
	recycleFolders: UserNoteFolderVO[]
	activeMenu: MenuVO
	activeFile?: Partial<UserNoteFileVO>
	activeFolder: Partial<UserNoteFolderVO>
	activeFiles: Partial<UserNoteFileVO & UserNoteFolderVO>[]
	filterFiles: Partial<UserNoteFileVO & UserNoteFolderVO>[]
	keyword: string
}

export interface HomeAction extends SearcherProps {
	key: HomeActionKeys | keyof HomeState
	value: Partial<HomeState> | HomeState[keyof HomeState]
	target?: HTMLInputElement
}

export type HomeHook = {
	[key in HomeActionKeys]?: {
		before?: (state: HomeState, action: HomeAction) => ToasterAction | void
		after?: (state: HomeState, action: HomeAction) => ToasterAction | void
	}
}

/**
 * Home Actions
 */
const HomeActions = {
	refresh(state: HomeState, action: HomeAction) {
		Object.assign(state, action.value)
		if (state.activeMenu.isMenu) {
			action.value = state.activeMenu
			HomeActions.setActiveMenu(state, action)
		} else {
			action.value = state.activeFolder.id ? state.activeFolder : state.folders[0]
			HomeActions.setActiveFolder(state, action)
		}
	},
	search(state: HomeState, action: HomeAction) {
		state.keyword = action.value as string
		state.filterFiles = SearcherUtils.filter(state.activeFiles, ['name', 'content'], state.keyword, action)
	},
	setActiveFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		const files = (folders.children || [])
			.filter((folder) => !folder.isAdd)
			.concat(state.notes.filter((note) => note.userNoteFolderId === folders.id) as [])
		state.activeFile = files.find((file) => !file.isFolder)
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = folders
		state.keyword = ''
	},
	setActiveFolderAsMenu(state: HomeState, action: HomeAction) {
		HomeActions.setActiveFolder(state, action)
		state.activeMenu = state.activeFolder as MenuVO
	},
	setActiveFolderAsParent(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		if (state.activeMenu.isMenu) {
			action.value =
				(state.activeMenu.name == 'Recycle' && state.recycleFolders.find((folder) => folder.id === folders.pid)) ||
				state.activeMenu
			HomeActions.setActiveMenu(state, action)
		} else {
			action.value = TreeUtils.find(state.folders, (folder) => folder.id === folders.pid) || state.folders[0]
			HomeActions.setActiveFolder(state, action)
		}
	},
	setActiveMenu(state: HomeState, action: HomeAction) {
		const menu = action.value as MenuVO
		const noteField = ('is' + menu.name) as keyof UserNoteFileVO
		const files =
			noteField === 'isRecycle'
				? state.recycleFolders.concat(state.recycleNotes as [])
				: (state.notes.filter((note) => note[noteField]) as [])
		state.activeFile = files.find((file) => !file.isFolder)
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = menu
		state.activeMenu = menu
		state.keyword = ''
	},
	newFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		folders.children.push({
			id: Math.round(performance.now() * 10) + '',
			name: `New Folder(${folders.children.length + 1})`,
			lvl: folders.lvl + 1,
			pid: folders.id,
			date: DateUtils.getCurrentDate(),
			children: [],
			isFavorite: 0,
			isFolder: 1,
			isMenu: 0,
			isAdd: true
		})
	},
	addFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		folders.isAdd = false
		HomeActions.setActiveFolder(state, action)
		addFolder(folders)
	},
	renameFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		folders.isEdit = true
	},
	updateFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		folders.isEdit = false
		updateFolder(folders)
	},
	removeFolder(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		// Remove folder and Collection removed folder id
		const removedFolderIds: string[] = []
		TreeUtils.forEach([folders], (folder) => {
			// Remove current folder
			TreeUtils.pull(state.folders, folder)
			// Add recycle folder
			state.recycleFolders.push(folder)
			// Update storage folder
			folder.isRecycle = 1
			removedFolderIds.push(folder.id)
			updateFolder(folder)
		})
		// Remove note and Collection removed note id
		const removedNoteIds: string[] = []
		state.notes = state.notes.filter((note) => {
			const removed = removedFolderIds.includes(note.userNoteFolderId)
			if (removed) {
				// Add recycle note
				state.recycleNotes.push(note)
				// Update storage note
				note.isRecycle = 1
				removedNoteIds.push(note.id)
				updateNote(note)
			}
			// Remove current note
			return !removed
		})
		// Set activity folder as parent if the folder is active
		HomeActions.setActiveFolderAsParent(state, action)
	},
	moveFolder(state: HomeState, action: HomeAction) {
		const [parent, target, destination] = action.value as UserNoteFolderVO[]
		// Remove it
		TreeUtils.pull(parent.children, target)
		// Push end
		destination.children.push(target)
		// Update pid
		if (target.pid !== destination.id) {
			target.pid = destination.id
			// Update lvl
			target.lvl = destination.lvl + 1
			updateFolder(target)
			TreeUtils.forEach(
				target.children,
				(child, index, parent) => {
					child.lvl = parent!.lvl + 1
					updateFolder(child)
				},
				target
			)
		}
	},
	newFile(state: HomeState, action: HomeAction) {
		const folders = action.value as UserNoteFolderVO
		const newNote: UserNoteFileVO = {
			id: Math.round(performance.now() * 10) + '',
			name: `New File(${state.notes.length + 1})`,
			content: '',
			date: DateUtils.getCurrentDate(),
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0,
			userNoteFolderId: folders.id,
			isFile: 1,
			isAdd: true
		}
		state.notes.push(newNote)
		const files: Partial<UserNoteFileVO & UserNoteFolderVO>[] = folders.children || []
		files.push(newNote)
		state.notes = state.notes
		state.activeFile = newNote
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = folders
		state.keyword = ''
	},
	addFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		file.isAdd = false
		addNote(file)
	},
	renameFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		file.isEdit = true
	},
	updateFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		file.isEdit = false
		updateNote(file)
	},
	removeFile(state: HomeState, action: HomeAction) {
		const note = action.value as UserNoteFileVO
		// Add recycle note
		state.recycleNotes.push(note)
		// Update storage note
		note.isRecycle = 1
		updateNote(note)
		// Set activity folder as it's folder
		action.value = state.activeFolder
		HomeActions.setActiveFolder(state, action)
	},
	moveFile(state: HomeState, action: HomeAction) {
		const values = action.value as unknown[]
		const target = values[0] as UserNoteFileVO
		const destination = values[1] as UserNoteFolderVO
		// Update folder id
		target.userNoteFolderId = destination.id
		updateNote(target)
		// Refresh Active Folder
		action.value = state.activeFolder
		HomeActions.setActiveFolder(state, action)
	}
}

type HomeActionKeys = keyof typeof HomeActions

/**
 * Home Hooks
 */
export const HomeHooks: HomeHook = {
	addFolder: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const folders = action.value as UserNoteFolderVO
			const focusInput = action.target as HTMLInputElement
			const folderName = focusInput?.value
			if (folders.name == null || folders.name === '') {
				// The folder name is empty
				focusInput.value = folders.name
				focusInput.select()
			} else if (TreeUtils.find(state.folders, (folder) => folder.id !== folders.id && folder.name === folderName)) {
				// The folder name is exist
				return {
					key: 'add',
					value: {
						title: 'Add Folder',
						description: `The folder name "${folderName}" is existing, Please rename.`,
						variant: 'destructive'
					}
				}
			} else {
				// Set folder name
				folders.name = folderName
			}
		}
	},
	updateFolder: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const folders = action.value as UserNoteFolderVO
			const focusInput = action.target as HTMLInputElement
			const folderName = focusInput?.value
			if (folders.name == null || folders.name === '') {
				// The folder name is empty
				focusInput.value = folders.name
				focusInput.select()
			} else if (TreeUtils.find(state.folders, (folder) => folder.id !== folders.id && folder.name === folderName)) {
				// The folder name is exist
				return {
					key: 'add',
					value: {
						title: 'Rename Folder',
						description: `The folder name "${folderName}" is existing, Please rename.`,
						variant: 'destructive'
					}
				}
			} else {
				// Set folder name
				folders.name = folderName
			}
		}
	},
	removeFolder: {
		after(state: HomeState, action: HomeAction): ToasterAction | void {
			const folders = action.value as UserNoteFolderVO
			return {
				key: 'add',
				value: {
					title: 'Remove Folder Notification',
					description: `The folder "${folders.name}" is removed.`
				}
			}
		}
	},
	addFile: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const folders = action.value as UserNoteFolderVO
			const noteName = `New File(${state.notes.length + 1})`
			if (state.notes.find((note) => note.userNoteFolderId === folders.id && note.name === noteName)) {
				// The note name is exist
				return {
					key: 'add',
					value: {
						title: 'New File',
						description: `The note name "${noteName}" is existing, Please rename.`,
						variant: 'destructive'
					}
				}
			}
		}
	},
	updateFile: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const file = action.value as UserNoteFileVO
			const focusInput = action.target as HTMLInputElement
			const fileName = focusInput?.value
			if (file.name == null || file.name === '') {
				// The file name is empty
				focusInput.value = file.name
				focusInput.select()
			} else if (state.notes.find((note) => note.id !== file.id && note.name === fileName)) {
				// The file name is exist
				return {
					key: 'add',
					value: {
						title: 'Rename File',
						description: `The file name "${fileName}" is existing, Please rename.`,
						variant: 'destructive'
					}
				}
			} else {
				// Set file name
				file.name = fileName
			}
		}
	},
	removeFile: {
		after(state: HomeState, action: HomeAction): ToasterAction | void {
			const file = action.value as UserNoteFileVO
			return {
				key: 'add',
				value: {
					title: 'Remove File Notification',
					description: `The file "${file.name}" is removed.`
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
		state[action.key as keyof HomeState] = action.value as never
	}
	return { ...state }
}
