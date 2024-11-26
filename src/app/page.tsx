'use client'

import { getFolders, getMenus, getNotes, getUser } from '@/api/user'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { HomeAction, HomeContext, HomeData, HomeState, SIDEBAR_WIDTH } from '@/contexts/home'
import { useIsMobile } from '@/hooks/use-mobile'
import StringUtils from '@/lib/string'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { UserVO } from '@/types/vo/UserVO'
import HomeEditor from '@/views/home/editor'
import HomeHeader from '@/views/home/header'
import { HomeSidebar } from '@/views/home/sidebar'
import { Reducer, useCallback, useEffect, useReducer, useState } from 'react'

const homeReducer: Reducer<HomeState, Required<HomeAction>> = (state: HomeState, action: Required<HomeAction>) => {
	const { type, target, data } = action
	let { keyword, activeNote, activeFolder, activeFiles, filterFiles } = state
	if (type === 'menu') {
		// Change from menu
		const menu = target as MenuVO
		const isField = ('is' + menu.name) as keyof UserNoteFileVO
		const files = data.notes.filter((note) => (isField === 'isRecycle' || !note.isRecycle) && note[isField])
		activeNote = files.find((file) => file.isFile)
		activeFiles = filterFiles = files
		activeFolder = { id: menu.id, name: menu.name, isMenu: 1 }
		keyword = ''
	} else if (type === 'folder') {
		// Change from folder
		const folder = target as UserNoteFolderVO
		const files = (folder.children || []).concat(
			data.notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folder.id) as []
		)
		activeNote = files.find((file) => !file.isFolder)
		activeFiles = filterFiles = files
		activeFolder = { id: folder.id, pid: folder.pid, name: folder.name, isFolder: 1 }
		keyword = ''
	} else if (type === 'file') {
		// Change from file
		activeNote = target as UserNoteFileVO
	} else {
		// Change from search
		keyword = target as string
		filterFiles = keyword
			? activeFiles.filter(
					(note) => StringUtils.includes(note.name, keyword) || StringUtils.includes(note.content, keyword)
			  )
			: activeFiles
	}
	return { activeFolder, activeFiles, filterFiles, activeNote, keyword }
}

export default function HomePage() {
	const isMobile = useIsMobile()

	const [data, setData] = useState<HomeData>({
		user: {} as UserVO,
		menus: [],
		notes: [],
		folders: {} as UserNoteFolderVO
	})

	const [state, stateDispatch] = useReducer(homeReducer, {
		activeNote: { name: '', content: '' },
		activeFolder: {},
		activeFiles: [],
		filterFiles: [],
		keyword: ''
	})

	const dispatch = useCallback(
		(action: HomeAction) => ((action.data = data), stateDispatch(action as Required<HomeAction>)),
		[data]
	)

	const [sidebarWidth, setSidebarWidth] = useState(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)

	const isActive = useCallback(
		(notes?: UserNoteFilesVO) => (notes ? notes.id === state.activeFolder.id : !!state.activeFolder.isFolder),
		[state.activeFolder]
	)

	const isColumns = useCallback(
		(type: 1 | 2 | 3) =>
			(type === 1 && sidebarWidth[2] === '0px') ||
			(type === 2 && sidebarWidth[1] !== SIDEBAR_WIDTH[1] && sidebarWidth[2] === SIDEBAR_WIDTH[2]) ||
			(type === 3 && sidebarWidth[0] === SIDEBAR_WIDTH[0]),
		[sidebarWidth]
	)

	const homeContext = { data, state, dispatch, sidebarWidth, setSidebarWidth, isActive, isColumns }

	// mounted
	useEffect(() => {
		Promise.all([getUser(), getMenus(), getNotes(), getFolders()]).then(([user, menus, notes, folders]) => {
			// Fetch data
			setData({ user, menus, notes, folders })
		})
	}, [])

	// watch
	useEffect(() => {
		setSidebarWidth(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)
	}, [isMobile])

	// watch
	useEffect(() => {
		// Initialization
		dispatch({ type: 'folder', target: data.folders })
	}, [data.folders, dispatch])

	return (
		<HomeContext.Provider value={homeContext}>
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
