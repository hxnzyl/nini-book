import { UserNotePO } from '@/types/po/UserNote'
import { Dispatch, SetStateAction, createContext } from 'react'

export interface HomeContext {
	activeNote: UserNotePO
	setActiveNote: Dispatch<SetStateAction<UserNotePO>>
}

export const HomeContext = createContext({} as HomeContext)
