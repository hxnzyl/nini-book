'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import {
	HomeContext,
	ICON_SIDEBAR_WIDTH,
	LEFT_SIDEBAR_WIDTH,
	RIGHT_SIDEBAR_WIDTH,
	SIDEBAR_WIDTH
} from '@/contexts/home'
import { useIsMobile } from '@/hooks/use-mobile'
import { UserNoteFilePO } from '@/types/po/UserNoteFilePO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import HomeEditor from '@/views/home/editor'
import { HomeSidebar } from '@/views/home/sidebar'
import { useEffect, useState } from 'react'

export default function HomePage() {
	const isMobile = useIsMobile()

	const [activeNote, setActiveNote] = useState<UserNoteFilePO>({ title: '', content: '' })
	const [activeNotes, setActiveNotes] = useState<UserNoteFilesVO>({ name: 'My Folder' })

	const [sidebarWidth, setSidebarWidth] = useState(isMobile ? '0px' : SIDEBAR_WIDTH)
	const [leftSidebarWidth, setLeftSidebarWidth] = useState(isMobile ? '0px' : LEFT_SIDEBAR_WIDTH)
	const [rightSidebarWidth, setRightSidebarWidth] = useState(isMobile ? '0px' : RIGHT_SIDEBAR_WIDTH)

	const isColumns1 = () => rightSidebarWidth === '0px'
	const isColumns2 = () => leftSidebarWidth !== LEFT_SIDEBAR_WIDTH && rightSidebarWidth === RIGHT_SIDEBAR_WIDTH
	const isColumns3 = () => sidebarWidth === SIDEBAR_WIDTH

	const setColumns1 = () =>
		isColumns1() ||
		(setSidebarWidth(ICON_SIDEBAR_WIDTH), setLeftSidebarWidth(ICON_SIDEBAR_WIDTH), setRightSidebarWidth('0px'))

	const setColumns2 = () =>
		isColumns2() ||
		(setSidebarWidth(`calc(${ICON_SIDEBAR_WIDTH} + ${RIGHT_SIDEBAR_WIDTH})`),
		setLeftSidebarWidth(ICON_SIDEBAR_WIDTH),
		setRightSidebarWidth(RIGHT_SIDEBAR_WIDTH))

	const setColumns3 = () =>
		isColumns3() ||
		(setSidebarWidth(SIDEBAR_WIDTH), setLeftSidebarWidth(LEFT_SIDEBAR_WIDTH), setRightSidebarWidth(RIGHT_SIDEBAR_WIDTH))

	const homeContext = {
		activeNotes,
		setActiveNotes,
		activeNote,
		setActiveNote,
		sidebarWidth,
		setSidebarWidth,
		leftSidebarWidth,
		setLeftSidebarWidth,
		rightSidebarWidth,
		setRightSidebarWidth,
		isColumns1,
		isColumns2,
		isColumns3,
		setColumns1,
		setColumns2,
		setColumns3
	}

	useEffect(() => {
		setSidebarWidth(isMobile ? '0px' : SIDEBAR_WIDTH)
		setLeftSidebarWidth(isMobile ? '0px' : LEFT_SIDEBAR_WIDTH)
		setRightSidebarWidth(isMobile ? '0px' : RIGHT_SIDEBAR_WIDTH)
	}, [isMobile])

	return (
		<HomeContext.Provider value={homeContext}>
			<SidebarProvider>
				<HomeSidebar />
				<SidebarInset>
					<header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
						<SidebarTrigger className="-ml-1 md:hidden" />
						<Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
						<input
							value={activeNote.title}
							type="text"
							placeholder="Note Subject..."
							className="flex w-full text-2xl text-foreground focus:outline-none"
							onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
						/>
					</header>
					<HomeEditor />
				</SidebarInset>
			</SidebarProvider>
		</HomeContext.Provider>
	)
}
