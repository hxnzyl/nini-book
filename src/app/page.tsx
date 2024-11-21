'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { HomeContext, SIDEBAR_WIDTH } from '@/contexts/home'
import { useIsMobile } from '@/hooks/use-mobile'
import { UserNotePO } from '@/types/po/UserNote'
import HomeEditor from '@/views/home/editor'
import { HomeSidebar } from '@/views/home/sidebar'
import { useEffect, useState } from 'react'

export default function HomePage() {
	const isMobile = useIsMobile()
	const [activeNote, setActiveNote] = useState<UserNotePO>({ subject: '', content: '' })
	const [sidebarWidth, setSidebarWidth] = useState(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)

	const isColumns1 = () => sidebarWidth[2] === '0px'
	const isColumns2 = () => sidebarWidth[1] !== SIDEBAR_WIDTH[1] && sidebarWidth[2] === SIDEBAR_WIDTH[2]
	const isColumns3 = () => sidebarWidth[0] === SIDEBAR_WIDTH[0]

	const homeContext = { activeNote, setActiveNote, sidebarWidth, setSidebarWidth, isColumns1, isColumns2, isColumns3 }

	useEffect(() => {
		setSidebarWidth(isMobile ? ['0px', '0px', '0px'] : SIDEBAR_WIDTH)
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
							value={activeNote.subject}
							type="text"
							placeholder="Note Subject..."
							className="flex w-full text-2xl text-foreground focus:outline-none"
							onChange={(e) => setActiveNote({ ...activeNote, subject: e.target.value })}
						/>
					</header>
					<HomeEditor />
				</SidebarInset>
			</SidebarProvider>
		</HomeContext.Provider>
	)
}
