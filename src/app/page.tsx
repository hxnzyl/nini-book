'use client'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { HomeContext, SIDEBAR_WIDTH } from '@/contexts/home'
import { useIsMobile } from '@/hooks/use-mobile'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import HomeEditor from '@/views/home/editor'
import HomeHeader from '@/views/home/header'
import { HomeSidebar } from '@/views/home/sidebar'
import { useCallback, useEffect, useState } from 'react'

export default function HomePage() {
	const isMobile = useIsMobile()
	const [activeNote, setActiveNote] = useState<Partial<UserNoteFileVO> | undefined>({ name: '', content: '' })
	const [sidebarWidth, setSidebarWidth] = useState(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)

	const isColumns1 = useCallback(() => sidebarWidth[2] === '0px', [sidebarWidth])
	const isColumns2 = useCallback(
		() => sidebarWidth[1] !== SIDEBAR_WIDTH[1] && sidebarWidth[2] === SIDEBAR_WIDTH[2],
		[sidebarWidth]
	)
	const isColumns3 = useCallback(() => sidebarWidth[0] === SIDEBAR_WIDTH[0], [sidebarWidth])

	const homeContext = { activeNote, setActiveNote, sidebarWidth, setSidebarWidth, isColumns1, isColumns2, isColumns3 }

	// watch
	useEffect(() => {
		setSidebarWidth(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)
	}, [isMobile])

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
