'use client'

import { getFolders } from '@/api/folders'
import { getNotes } from '@/api/notes'
import { getMenus, getUser } from '@/api/user'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { HomeContext, HomeReducer, SIDEBAR_WIDTH } from '@/contexts/home'
import { useIsMobile } from '@/hooks/use-mobile'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import HomeEditor from '@/views/home-editor'
import HomeHeader from '@/views/home-header'
import { HomeSidebar } from '@/views/home-sidebar'
import { useCallback, useEffect, useReducer, useState } from 'react'

export default function HomePage() {
	const isMobile = useIsMobile()

	const [state, stateDispatch] = useReducer(HomeReducer, {
		user: {} as UserVO,
		menus: [],
		notes: [],
		folders: {} as UserNoteFolderVO,
		activeNote: { name: '', content: '' },
		activeFolder: {},
		activeFiles: [],
		filterFiles: [],
		keyword: ''
	})

	const [sidebarWidth, setSidebarWidth] = useState(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)

	const isActive = useCallback(
		(notes?: UserNoteFilesVO) => (notes ? notes.id === state.activeFolder.id : !!state.activeFolder.isFolder),
		[state.activeFolder]
	)

	const isColumns = useCallback(
		(type: 1 | 2 | 3) =>
			type === 1
				? sidebarWidth[2] === '0px'
				: type === 2
				? sidebarWidth[1] !== SIDEBAR_WIDTH[1] && sidebarWidth[2] === SIDEBAR_WIDTH[2]
				: sidebarWidth[0] === SIDEBAR_WIDTH[0],
		[sidebarWidth]
	)

	// watch
	useEffect(() => {
		setSidebarWidth(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)
	}, [isMobile])

	// mounted
	useEffect(() => {
		Promise.all([getUser(), getMenus(), getNotes(), getFolders()]).then(([user, menus, notes, folders]) => {
			// Fetch data
			stateDispatch({
				key: 'all',
				value: { user, menus, notes, folders }
			})
		})
	}, [])

	return (
		<HomeContext.Provider value={{ state, stateDispatch, sidebarWidth, setSidebarWidth, isActive, isColumns }}>
			<SidebarProvider>
				<HomeSidebar />
				<SidebarInset>
					<HomeHeader />
					<HomeEditor />
				</SidebarInset>
			</SidebarProvider>
		</HomeContext.Provider>
	)
}
