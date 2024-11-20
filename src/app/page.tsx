'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { HomeContext } from '@/contexts/home'
import { UserNotePO } from '@/types/po/UserNote'
import HomeEditor from '@/views/home/editor'
import { HomeSidebar } from '@/views/home/sidebar'
import { CSSProperties, useState } from 'react'

export default function HomePage() {
	const [activeNote, setActiveNote] = useState<UserNotePO>({ subject: '', content: '' })

	return (
		<HomeContext.Provider value={{ activeNote, setActiveNote }}>
			<SidebarProvider style={{ '--sidebar-width': '350px' } as CSSProperties}>
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
