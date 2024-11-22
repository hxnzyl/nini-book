import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export const SIDEBAR_WIDTH = ['500px', '200px', '300px']
export const ICON_SIDEBAR_WIDTH = 'calc(var(--sidebar-width-icon))'

export interface HomeContext {
	activeNote: UserNoteFileVO
	setActiveNote: Dispatch<SetStateAction<UserNoteFileVO>>
	sidebarWidth: string[]
	setSidebarWidth: Dispatch<SetStateAction<string[]>>
	isColumns1: () => boolean
	isColumns2: () => boolean
	isColumns3: () => boolean
}

export const HomeContext = createContext({} as HomeContext)

export function useHome() {
	const context = useContext(HomeContext)
	if (!context) {
		throw new Error('useHome must be used within a HomeContext.Provider.')
	}

	return context
}
