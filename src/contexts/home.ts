import { UserNoteFilePO } from '@/types/po/UserNoteFilePO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export const SIDEBAR_WIDTH = '500px'
export const LEFT_SIDEBAR_WIDTH = '200px'
export const RIGHT_SIDEBAR_WIDTH = '300px'
export const ICON_SIDEBAR_WIDTH = 'calc(var(--sidebar-width-icon))'

export interface HomeContext {
	activeNotes: UserNoteFilesVO
	setActiveNotes: Dispatch<SetStateAction<UserNoteFilesVO>>
	activeNote: UserNoteFilePO
	setActiveNote: Dispatch<SetStateAction<UserNoteFilePO>>
	sidebarWidth: string
	setSidebarWidth: Dispatch<SetStateAction<string>>
	leftSidebarWidth: string
	setLeftSidebarWidth: Dispatch<SetStateAction<string>>
	rightSidebarWidth: string
	setRightSidebarWidth: Dispatch<SetStateAction<string>>
	isColumns1: () => boolean
	isColumns2: () => boolean
	isColumns3: () => boolean
	setColumns1: () => void
	setColumns2: () => void
	setColumns3: () => void
}

export const HomeContext = createContext({} as HomeContext)

export function useHome() {
	const context = useContext(HomeContext)
	if (!context) {
		throw new Error('useHome must be used within a HomeContext.Provider.')
	}

	return context
}
