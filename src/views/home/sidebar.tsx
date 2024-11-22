'use client'

import { getFolders, getNotes } from '@/api/user'
import { LucideIcon } from '@/components/lucide-icon'
import { NavUser } from '@/components/nav-user'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { ICON_SIDEBAR_WIDTH, SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronRight, Columns2, Columns3, Command, Folder, PanelLeft } from 'lucide-react'
import { ComponentProps, useEffect, useState } from 'react'

const user = {
	name: 'shadcn',
	email: 'm@example.com',
	avatar: '/avatars/shadcn.jpg'
}

const menus: MenuVO[] = [
	{ id: '1', name: 'Latest', icon: 'sparkles' },
	{ id: '2', name: 'Recycle', icon: 'recycle' },
	{ id: '3', name: 'Favorite', icon: 'star' }
]

export function HomeSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const { activeNote, setActiveNote, sidebarWidth, setSidebarWidth, isColumns1, isColumns2, isColumns3 } = useHome()

	const [notes, setNotes] = useState([] as UserNoteFileVO[])
	const [folders, setFolders] = useState({} as UserNoteFolderVO)

	const [activeNotes, setActiveNotes] = useState({} as UserNoteFilesVO)

	const setColumns1 = () => isColumns1() || setSidebarWidth([ICON_SIDEBAR_WIDTH, ICON_SIDEBAR_WIDTH, '0px'])

	const setColumns2 = () =>
		isColumns2() ||
		setSidebarWidth([`calc(${ICON_SIDEBAR_WIDTH} + ${SIDEBAR_WIDTH[2]})`, ICON_SIDEBAR_WIDTH, SIDEBAR_WIDTH[2]])

	const setColumns3 = () => isColumns3() || setSidebarWidth(SIDEBAR_WIDTH)

	const setActiveNotesByFolder = (folder: UserNoteFolderVO) => {
		setActiveNotes({
			id: folder.id,
			name: folder.name,
			files: (folder.children || []).concat(notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folder.id))
		})
	}

	const setActiveNotesByMenu = (menu: MenuVO) => {
		const isField = ('is' + menu.name) as keyof UserNoteFileVO
		setActiveNotes({
			id: menu.id,
			name: menu.name,
			files: notes.filter((note) => (isField === 'isRecycle' || !note.isRecycle) && note[isField])
		})
	}

	// mounted
	useEffect(() => {
		Promise.all([getNotes(), getFolders()]).then(([notes, folders]) => {
			// Fetch notes
			setNotes(notes)
			// Fetch folders
			setFolders(folders)
			// Set default folders
			setActiveNotes({
				id: folders.id,
				name: folders.name,
				files: (folders.children || []).concat(notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folders.id))
			})
		})
	}, [])

	return (
		<div style={{ '--sidebar-width': sidebarWidth[0] } as React.CSSProperties}>
			<Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
				{/** Menu list */}
				<div style={{ '--sidebar-width': sidebarWidth[1] } as React.CSSProperties}>
					<Sidebar collapsible="icon" className="border-r">
						<SidebarHeader>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
										<a href="#">
											<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
												<Command className="size-4" />
											</div>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">Acme Inc</span>
												<span className="truncate text-xs">Enterprise</span>
											</div>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarHeader>
						<SidebarContent>
							<ScrollArea>
								<SidebarGroup>
									<SidebarGroupContent>
										<SidebarMenu>
											{menus.map((menu, key) => (
												<SidebarMenuItem key={key} onClick={() => setActiveNotesByMenu(menu)}>
													<SidebarMenuButton tooltip={menu.name}>
														{menu.icon && <LucideIcon name={menu.icon} />}
														<span className={isColumns3() ? '' : 'hidden'}>{menu.name}</span>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))}
											{isColumns3() ? (
												<SidebarFolder folders={folders} onChange={setActiveNotesByFolder}></SidebarFolder>
											) : (
												<SidebarMenuItem>
													<SidebarMenuButton>
														<Folder />
													</SidebarMenuButton>
												</SidebarMenuItem>
											)}
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
							</ScrollArea>
						</SidebarContent>
						<SidebarFooter>
							<div className={cn('flex items-center justify-center', isColumns3() ? 'flex-row' : 'flex-col')}>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={setColumns1}>
									<PanelLeft />
									<span className="sr-only">Set Columns 1</span>
								</Button>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={setColumns2}>
									<Columns2 />
									<span className="sr-only">Set Columns 2</span>
								</Button>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={setColumns3}>
									<Columns3 />
									<span className="sr-only">Set Columns 3</span>
								</Button>
							</div>
							<NavUser user={user} />
						</SidebarFooter>
					</Sidebar>
				</div>
				{/** Note list */}
				<div style={{ '--sidebar-width': sidebarWidth[2] } as React.CSSProperties}>
					<Sidebar collapsible="none">
						<SidebarHeader className="gap-3.5 border-b p-4" style={{ width: SIDEBAR_WIDTH[2] }}>
							<div className="flex w-full items-center justify-between">
								<div className="text-base font-medium text-foreground">{activeNotes.name}</div>
								<Label className="flex items-center gap-2 text-sm">
									<span>Unreads</span>
									<Switch className="shadow-none" />
								</Label>
							</div>
							<SidebarInput placeholder="Note to search..." />
						</SidebarHeader>
						<SidebarContent style={{ width: SIDEBAR_WIDTH[2] }}>
							<ScrollArea>
								<SidebarGroup className="px-0">
									<SidebarGroupContent>
										{activeNotes.files?.map((note, key) => (
											<a
												href="#"
												key={key}
												onClick={() => setActiveNote(note)}
												className={cn(
													'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
													activeNote && note.id === activeNote.id ? '!bg-sidebar-ring !text-sidebar-accent' : ''
												)}
											>
												<div className="flex w-full items-center gap-2">
													{note.isFolder && <Folder />}
													<span>{note.name}</span>
													<span className="ml-auto text-xs">{note.date}</span>
												</div>
												<span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">{note.content}</span>
											</a>
										))}
									</SidebarGroupContent>
								</SidebarGroup>
							</ScrollArea>
						</SidebarContent>
					</Sidebar>
				</div>
			</Sidebar>
		</div>
	)
}

function SidebarFolder({
	folders,
	onChange
}: {
	folders: UserNoteFolderVO
	onChange: (folders: UserNoteFolderVO) => void
}) {
	const files: UserNoteFilesVO[] = folders.children || []
	return !files.length ? (
		<SidebarMenuItem>
			<SidebarMenuButton className="pl-1.5" onClick={() => onChange(folders)}>
				<Folder className="w-4 h-4" />
				<span>{folders.name}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	) : (
		<Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
			<SidebarMenuItem>
				<SidebarMenuButton>
					<CollapsibleTrigger asChild>
						<ChevronRight className="transition-transform" />
					</CollapsibleTrigger>
					<div className="flex items-center gap-2" onClick={() => onChange(folders)}>
						<Folder className="w-4 h-4" />
						<span>{folders.name}</span>
					</div>
				</SidebarMenuButton>
				<CollapsibleContent>
					<SidebarMenuSub className="mr-0 pr-0">
						{files.map((children, index) => (
							<SidebarFolder key={index} folders={children} onChange={onChange} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	)
}
