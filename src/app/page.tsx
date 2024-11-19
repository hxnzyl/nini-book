'use client'

import { AppSidebar } from '@/components/app-sidebar'
import QuillEditor from '@/components/quill/editor'
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
import { CSSProperties } from 'react'

export default function HomePage() {
	return (
		<SidebarProvider style={{ '--sidebar-width': '350px' } as CSSProperties}>
			<AppSidebar />
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
				<QuillEditor />
			</SidebarInset>
		</SidebarProvider>
	)
}
