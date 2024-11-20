import { UserNotePO } from '@/types/po/UserNote'
import { Dispatch, SetStateAction, createContext } from 'react'

export interface HomeContext {
	activeNote?: UserNotePO
	setActiveNote: Dispatch<SetStateAction<UserNotePO | undefined>>
}

export const HomeContext = createContext<HomeContext>({} as HomeContext)
