import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export const SIDEBAR_WIDTH = ['36rem', '16rem', '20rem']
export const SIDEBAR_ICON_WIDTH = '3rem'

export interface HomeContext {
	activeNote?: Partial<UserNoteFileVO>
	setActiveNote: Dispatch<SetStateAction<Partial<UserNoteFileVO> | undefined>>
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
