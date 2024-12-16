'use client'

import { getFolders } from '@/api/folders'
import { getNotes } from '@/api/notes'
import { getMenus, getUser } from '@/api/user'
import { Toaster } from '@/components/toaster'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { HomeContext, SIDEBAR_WIDTH } from '@/contexts/home'
import { ToasterContext } from '@/contexts/toaster'
import { useIsMobile } from '@/hooks/use-mobile'
import { HomeAction, HomeHook, HomeHooks, HomeReducer } from '@/reducers/home'
import { ToasterReducer } from '@/reducers/toaster'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import HomeEditor from '@/views/editor'
import HomeHeader from '@/views/header'
import { HomeSidebar } from '@/views/sidebar'
import { useCallback, useEffect, useReducer, useState } from 'react'

export default function HomePage() {
	const isMobile = useIsMobile()

	const [state, _dispatch] = useReducer(HomeReducer, {
		user: {} as UserVO,
		menus: [],
		notes: [],
		removedNotes: [],
		folders: [],
		removedFolders: [],
		activeMenu: {} as MenuVO,
		activeFile: { name: '', content: '' },
		activeFolder: {},
		activeFiles: [],
		filterFiles: [],
		keyword: ''
	})

	const [toaster, toasterDispatch] = useReducer(ToasterReducer, {
		toasts: [],
		// Max toast size
		maxToastSize: 3
	})

	const dispatch = useCallback(
		(action: HomeAction) => {
			const hook = HomeHooks[action.key as keyof HomeHook]
			// Before dispatch verification
			if (hook && hook.before) {
				const toaster = hook.before(state, action)
				if (toaster) {
					// Show toast
					toasterDispatch(toaster)
					return
				}
			}
			// Clear all toasts
			toasterDispatch({ key: 'remove' })
			// Call original Dispatch
			_dispatch(action)
			// After dispatch verification
			if (hook && hook.after) {
				const toaster = hook.after(state, action)
				if (toaster) {
					// Show toast
					toasterDispatch(toaster)
					return
				}
			}
		},
		[state]
	)

	const [sidebarWidth, setSidebarWidth] = useState(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)

	const isActive = useCallback(
		(folderOrMenu?: UserNoteFolderVO | MenuVO) =>
			folderOrMenu ? folderOrMenu.id === state.activeFolder.id : !!state.activeFolder.isFolder,
		[state.activeFolder]
	)

	const isColumns = useCallback(
		(columnType: 1 | 2 | 3) =>
			columnType === 1
				? sidebarWidth[2] === '0px'
				: columnType === 2
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
			_dispatch({
				key: 'refresh',
				value: { user, menus, notes: notes[0], removedNotes: notes[1], folders: folders[0], removedFolders: folders[1] }
			})
		})
	}, [])

	return (
		<ToasterContext.Provider value={{ toaster, toasterDispatch }}>
			<HomeContext.Provider value={{ state, dispatch, sidebarWidth, setSidebarWidth, isActive, isColumns }}>
				<SidebarProvider>
					<HomeSidebar />
					<SidebarInset>
						<HomeHeader />
						<HomeEditor />
					</SidebarInset>
				</SidebarProvider>
			</HomeContext.Provider>
			<Toaster />
		</ToasterContext.Provider>
	)
}
