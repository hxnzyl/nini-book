import { HomeAction, HomeState } from '@/reducers/home'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export const SIDEBAR_WIDTH = ['36rem', '16rem', '20rem']
export const SIDEBAR_ICON_WIDTH = '3rem'

export const SIDEBAR_COLUMNS: string[][] = [
	['0px', '0px', '0px'],
	[SIDEBAR_ICON_WIDTH, SIDEBAR_ICON_WIDTH, '0px'],
	[`calc(${SIDEBAR_ICON_WIDTH} + ${SIDEBAR_WIDTH[2]})`, SIDEBAR_ICON_WIDTH, SIDEBAR_WIDTH[2]],
	SIDEBAR_WIDTH
]

export const HomeContext = createContext({} as HomeContext)

export interface HomeContext {
	state: HomeState
	dispatch: Dispatch<HomeAction>
	sidebarColumns: 0 | 1 | 2 | 3
	setSidebarColumns: (columns: 0 | 1 | 2 | 3) => void
	sidebarWidth: string[]
	setSidebarWidth: Dispatch<SetStateAction<string[]>>
	isActive: (folderOrMenu?: UserNoteFolderVO | MenuVO) => boolean
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
