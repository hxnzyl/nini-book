'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { HomeContext } from '@/contexts/home'
import HomeEditor from '@/views/home/editor'
import { HomeSidebar } from '@/views/home/sidebar'
import { CSSProperties, useState } from 'react'

export default function HomePage() {
	const [activeNote, setActiveNote] = useState()

	return (
		<HomeContext.Provider value={{ activeNote, setActiveNote }}>
			<SidebarProvider style={{ '--sidebar-width': '350px' } as CSSProperties}>
				<HomeSidebar />
				<SidebarInset>
					<header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
						<SidebarTrigger className="-ml-1 md:hidden" />
						<Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Inbox</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</header>
					<HomeEditor />
				</SidebarInset>
			</SidebarProvider>
		</HomeContext.Provider>
	)
}
