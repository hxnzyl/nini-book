import { UserNotePO } from '@/types/po/UserNote'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export const SIDEBAR_WIDTH = ['550px', '250px', '300px']

export interface HomeContext {
	activeNote: UserNotePO
	setActiveNote: Dispatch<SetStateAction<UserNotePO>>
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
