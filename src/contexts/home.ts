import { HomeAction, HomeState } from '@/reducers/home'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export const SIDEBAR_WIDTH = ['36rem', '16rem', '20rem']
export const SIDEBAR_ICON_WIDTH = '3rem'

export const HomeContext = createContext({} as HomeContext)

export interface HomeContext {
	state: HomeState
	stateDispatch: Dispatch<HomeAction>
	sidebarWidth: string[]
	setSidebarWidth: Dispatch<SetStateAction<string[]>>
	isActive: (folders?: UserNoteFolderVO | MenuVO) => boolean
	isColumns: (type: 1 | 2 | 3) => boolean
}

/**
 * Home Useful
 *
 * @returns
 */
export function useHome() {
	const context = useContext(HomeContext)
	if (!context) {
		throw new Error('useHome must be used within a HomeStateContext.Provider.')
	}

	return context
}
