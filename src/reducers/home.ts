import { FoldersTable } from '@/api/folders'
import { NotesTable } from '@/api/notes'
import { SearcherProps } from '@/contexts/searcher'
import SearcherUtils from '@/lib/searcher'
import TreeUtils from '@/lib/tree'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import { pull } from 'lodash-es'
import { Reducer } from 'react'
import { UserNoteFileVO } from './../types/vo/UserNoteFileVO'
import { ToasterAction } from './toaster'

export interface HomeState {
	user: UserVO
	menus: MenuVO[]
	notes: UserNoteFileVO[]
	removedNotes: UserNoteFileVO[]
	folders: UserNoteFolderVO[]
	removedFolders: UserNoteFolderVO[]
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
		const folder = action.value as UserNoteFolderVO
		const files = (folder.children || [])
			.filter((folder) => !folder.isAdd)
			.concat(state.notes.filter((note) => note.userNoteFolderId === folder.id) as [])
		state.activeFile = files.find((file) => !file.isFolder)
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = folder
		state.keyword = ''
	},
	setActiveFolderAsMenu(state: HomeState, action: HomeAction) {
		HomeActions.setActiveFolder(state, action)
		state.activeMenu = state.activeFolder as MenuVO
	},
	goParentFolder(state: HomeState, action: HomeAction) {
		const { pid, deleteFlag } = action.value as UserNoteFolderVO
		const { isMenu } = state.activeMenu
		if (!isMenu) {
			action.value = TreeUtils.find(state.folders, (folder) => folder.id === pid) || state.folders[0]
			HomeActions.setActiveFolder(state, action)
		} else {
			const activeFolder = deleteFlag && state.removedFolders.find((folder) => folder.id === pid)
			if (activeFolder) {
				action.value = activeFolder
				HomeActions.setActiveFolder(state, action)
			} else {
				action.value = state.activeMenu
				HomeActions.setActiveMenu(state, action)
			}
		}
	},
	setActiveMenu(state: HomeState, action: HomeAction) {
		const menu = action.value as MenuVO
		const noteField = ('is' + menu.name) as keyof UserNoteFileVO
		const files =
			noteField === 'deleteFlag'
				? state.removedFolders.concat(state.removedNotes as [])
				: (state.notes.filter((note) => note[noteField]) as [])
		state.activeFile = files.find((file) => !file.isFolder)
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = menu
		state.activeMenu = menu
		state.keyword = ''
	},
	newFolder(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		folder.children.push({
			id: Math.round(performance.now() * 10) + '',
			name: `New Folder(${folder.children.length + 1})`,
			lvl: folder.lvl + 1,
			pid: folder.id,
			children: [],
			isFavorite: 0,
			isFolder: true,
			isMenu: false,
			isAdd: true,
			isEdit: false
		})
	},
	addFolder(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		folder.isAdd = false
		HomeActions.setActiveFolder(state, action)
		FoldersTable.insert(folder)
	},
	renameFolder(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		folder.isEdit = true
	},
	updateFolder(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		folder.isEdit = false
		FoldersTable.update(folder)
	},
	restoreFolder(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		// Get parent folder
		const parentFolder = TreeUtils.find(state.folders, (f) => f.id === folder.pid)
		// Remove removed folder
		pull(state.removedFolders, folder)
		// Update storage folder
		FoldersTable.restore(folder)
		// Add folder
		parentFolder!.children.push(folder)
		// Remove removed notes
		state.removedNotes = state.removedNotes.filter((note) => {
			const restored = folder.id === note.userNoteFolderId
			if (restored) {
				NotesTable.restore(note)
			}
			return !restored
		})
		// Refresh
		action.value = {}
		HomeActions.refresh(state, action)
	},
	deleteFolder(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		// Delete folder
		pull(state.removedFolders, folder)
		FoldersTable.dispose(folder)
		// Delete note
		state.removedNotes = state.removedNotes.filter((note) => {
			const deleted = folder.id === note.userNoteFolderId
			if (deleted) {
				NotesTable.dispose(note)
			}
			return !deleted
		})
	},
	removeFolder(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		// Remove folder and Collection removed folder id
		const removedFolderIds: string[] = []
		TreeUtils.forEach([folder], (folder) => {
			// Remove current folder
			TreeUtils.pull(state.folders, folder)
			// Add removed folder
			state.removedFolders.push(folder)
			// Update storage folder
			FoldersTable.remove(folder)
			removedFolderIds.push(folder.id)
		})
		// Remove notes
		state.notes = state.notes.filter((note) => {
			const removed = removedFolderIds.includes(note.userNoteFolderId)
			if (removed) {
				// Add removed note
				state.removedNotes.push(note)
				// Update storage note
				NotesTable.remove(note)
			}
			return !removed
		})
		// Set activity folder as parent if the folder is active
		HomeActions.goParentFolder(state, action)
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
			FoldersTable.update(target)
			TreeUtils.forEach(
				target.children,
				(child, index, parent) => {
					child.lvl = parent!.lvl + 1
					FoldersTable.update(child)
				},
				target
			)
		}
	},
	newFile(state: HomeState, action: HomeAction) {
		const folder = action.value as UserNoteFolderVO
		const newNote: UserNoteFileVO = {
			id: Math.round(performance.now() * 10) + '',
			name: `New File(${state.notes.length + 1})`,
			content: '',
			isLatest: 0,
			deleteFlag: 0,
			isFavorite: 0,
			userNoteFolderId: folder.id,
			isFile: true,
			isAdd: true,
			isEdit: false
		}
		state.notes.push(newNote)
		const files = (folder.children || []).concat(
			state.notes.filter((note) => note.userNoteFolderId === folder.id) as []
		)
		state.activeFile = newNote
		state.activeFiles = files
		state.filterFiles = files
		state.activeFolder = folder
		state.keyword = ''
	},
	addFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		file.isAdd = false
		NotesTable.insert(file)
	},
	renameFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		file.isEdit = true
	},
	updateFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		file.isEdit = false
		NotesTable.update(file)
	},
	restoreFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		// Remove removed note
		pull(state.removedNotes, file)
		// Update storage folder
		NotesTable.restore(file)
		// Add note
		state.notes.push(file)
		// Refresh
		action.value = {}
		HomeActions.refresh(state, action)
	},
	deleteFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		pull(state.removedNotes, file)
		NotesTable.dispose(file)
	},
	removeFile(state: HomeState, action: HomeAction) {
		const file = action.value as UserNoteFileVO
		// Add removed note
		state.removedNotes.push(file)
		// Remove note
		pull(state.notes, file)
		// Update note
		NotesTable.remove(file)
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
		NotesTable.update(target)
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
			const folder = action.value as UserNoteFolderVO
			const focusInput = action.target as HTMLInputElement
			const folderName = focusInput?.value
			if (folderName == null || folderName === '') {
				// The folder is empty
				focusInput.value = folder.name
				focusInput.select()
			} else if (TreeUtils.find(state.folders, (f) => f.id !== folder.id && f.name === folderName)) {
				// The folder is exist
				return {
					key: 'add',
					value: {
						title: 'Add Folder Failure',
						description: `The folder name "${folderName}" is existing, Please rename.`,
						variant: 'destructive'
					}
				}
			} else {
				// Set folder
				folder.name = folderName
			}
		}
	},
	updateFolder: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const folder = action.value as UserNoteFolderVO
			const focusInput = action.target as HTMLInputElement
			const folderName = focusInput?.value
			if (folderName == null || folderName === '') {
				// The folder is empty
				focusInput.value = folder.name
				focusInput.select()
			} else if (TreeUtils.find(state.folders, (f) => f.id !== folder.id && f.name === folderName)) {
				// The folder is exist
				return {
					key: 'add',
					value: {
						title: 'Rename Folder Failure',
						description: `The folder name "${folderName}" is existing, Please rename.`,
						variant: 'destructive'
					}
				}
			} else {
				// Set folder name
				folder.name = folderName
			}
		}
	},
	restoreFolder: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const folder = action.value as UserNoteFolderVO
			if (!TreeUtils.find(state.folders, (f) => f.id === folder.pid)) {
				return {
					key: 'add',
					value: {
						title: 'Restore Folder Failure',
						description: `The parent folder of this folder "${folder.name}" is not exists, Please try again.`,
						variant: 'destructive'
					}
				}
			}
			if (TreeUtils.find(state.folders, (f) => f.name === folder.name)) {
				return {
					key: 'add',
					value: {
						title: 'Restore Folder Failure',
						description: `The folder name "${folder.name}" is exists, Please rename.`,
						variant: 'destructive'
					}
				}
			}
		},
		after(state: HomeState, action: HomeAction): ToasterAction | void {
			const folder = action.value as UserNoteFolderVO
			return {
				key: 'add',
				value: {
					title: 'Restore Folder Success',
					description: `The folder "${folder.name}" is restored.`,
					variant: 'primary'
				}
			}
		}
	},
	removeFolder: {
		after(state: HomeState, action: HomeAction): ToasterAction | void {
			const folder = action.value as UserNoteFolderVO
			return {
				key: 'add',
				value: {
					title: 'Remove Folder Success',
					description: `The folder "${folder.name}" is removed.`,
					variant: 'primary'
				}
			}
		}
	},
	addFile: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const folder = action.value as UserNoteFolderVO
			const noteName = `New File(${state.notes.length + 1})`
			if (state.notes.find((note) => note.userNoteFolderId === folder.id && note.name === noteName)) {
				// The note name is exist
				return {
					key: 'add',
					value: {
						title: 'New File Failure',
						description: `The file name "${noteName}" is existing, Please rename.`,
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
			if (fileName == null || fileName === '') {
				// The file name is empty
				focusInput.value = file.name
				focusInput.select()
			} else if (state.notes.find((note) => note.id !== file.id && note.name === fileName)) {
				// The file name is exist
				return {
					key: 'add',
					value: {
						title: 'Rename File Failure',
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
	restoreFile: {
		before(state: HomeState, action: HomeAction): ToasterAction | void {
			const file = action.value as UserNoteFileVO
			if (!TreeUtils.find(state.folders, (f) => f.id === file.userNoteFolderId)) {
				return {
					key: 'add',
					value: {
						title: 'Restore File Failure',
						description: `The folder of this file "${file.name}" is not exists, Please try again.`,
						variant: 'destructive'
					}
				}
			}
			if (state.notes.find((f) => f.name === file.name)) {
				return {
					key: 'add',
					value: {
						title: 'Restore File Failure',
						description: `The file name "${file.name}" is exists, Please rename.`,
						variant: 'destructive'
					}
				}
			}
		},
		after(state: HomeState, action: HomeAction): ToasterAction | void {
			const file = action.value as UserNoteFileVO
			return {
				key: 'add',
				value: {
					title: 'Restore File Success',
					description: `The file "${file.name}" is restored.`,
					variant: 'primary'
				}
			}
		}
	},
	removeFile: {
		after(state: HomeState, action: HomeAction): ToasterAction | void {
			const file = action.value as UserNoteFileVO
			return {
				key: 'add',
				value: {
					title: 'Remove File Success',
					description: `The file "${file.name}" is removed.`,
					variant: 'primary'
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
