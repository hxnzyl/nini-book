'use client'

import { getFolders, getNotes } from '@/api/user'
import { LucideIcon } from '@/components/lucide-icon'
import { NavUser } from '@/components/nav-user'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
	SidebarMenuSub,
	useSidebar
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ICON_SIDEBAR_WIDTH, SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, Columns2, Columns3, Command, FileText, Folder, MoreHorizontal, PanelLeft } from 'lucide-react'
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
	const { setOpen } = useSidebar()
	const { activeNote, setActiveNote, sidebarWidth, setSidebarWidth, isColumns1, isColumns2, isColumns3 } = useHome()

	const [notes, setNotes] = useState([] as UserNoteFileVO[])
	const [folders, setFolders] = useState({} as UserNoteFolderVO)

	const [activeNotes, setActiveNotes] = useState({} as UserNoteFilesVO)

	const setColumns1 = () =>
		isColumns1() || (setSidebarWidth([ICON_SIDEBAR_WIDTH, ICON_SIDEBAR_WIDTH, '0px']), setOpen(false))

	const setColumns2 = () =>
		isColumns2() ||
		(setSidebarWidth([`calc(${ICON_SIDEBAR_WIDTH} + ${SIDEBAR_WIDTH[2]})`, ICON_SIDEBAR_WIDTH, SIDEBAR_WIDTH[2]]),
		setOpen(true))

	const setColumns3 = () => isColumns3() || (setSidebarWidth(SIDEBAR_WIDTH), setOpen(true))

	const isActiveNotes = (notes?: UserNoteFilesVO) => (notes ? notes.id === activeNotes.id : !!activeNotes.isFolder)

	const setActiveNotesByFolder = (folder: UserNoteFolderVO) => {
		if (activeNotes.id !== folder.id) {
			setActiveNotes({
				id: folder.id,
				name: folder.name,
				isFolder: 1,
				files: (folder.children || []).concat(
					notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folder.id)
				)
			})
		}
	}

	const setActiveNotesByMenu = (menu: MenuVO) => {
		if (activeNotes.id !== menu.id) {
			const isField = ('is' + menu.name) as keyof UserNoteFileVO
			setActiveNotes({
				id: menu.id,
				name: menu.name,
				files: notes.filter((note) => (isField === 'isRecycle' || !note.isRecycle) && note[isField])
			})
		}
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
				isFolder: 1,
				files: (folders.children || []).concat(
					notes.filter((note) => !note.isRecycle && note.userNoteFolderId === folders.id)
				)
			})
		})
	}, [])

	return (
		<div style={{ '--sidebar-width': sidebarWidth[0] } as React.CSSProperties}>
			<Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
				{/** Menu list */}
				<div style={{ '--sidebar-width': sidebarWidth[1] } as React.CSSProperties}>
					<Sidebar collapsible="icon" className="overflow-hidden border-r">
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
													<Tooltip>
														<TooltipTrigger asChild>
															<SidebarMenuButton
																className={cn(
																	'transition-colors',
																	isActiveNotes(menu) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
																)}
															>
																{menu.icon && <LucideIcon name={menu.icon} />}
																<span hidden={isColumns1() || isColumns2()}>{menu.name}</span>
															</SidebarMenuButton>
														</TooltipTrigger>
														<TooltipContent
															side="right"
															align="center"
															className="relative overflow-visible"
															sideOffset={10}
														>
															{/** left arrow */}
															<div className="absolute -left-[6px] w-2 h-2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary"></div>
															<div>{menu.name}</div>
														</TooltipContent>
													</Tooltip>
												</SidebarMenuItem>
											))}
											{isColumns3() ? (
												<SidebarMenuFolder
													folders={folders}
													isActive={isActiveNotes}
													onChange={setActiveNotesByFolder}
												/>
											) : (
												<SidebarDropdownMenuFolder
													folders={folders}
													isActive={isActiveNotes}
													onChange={setActiveNotesByFolder}
												/>
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
												onClick={() => note.isFile && setActiveNote(note)}
												className={cn(
													'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
													note.id === activeNote.id ? '!bg-sidebar-ring !text-sidebar-accent' : ''
												)}
											>
												<div className="flex w-full items-center gap-2">
													{note.isFolder && <Folder />}
													<span>{note.name}</span>
													<span className="ml-auto text-xs">{note.date}</span>
												</div>
												{note.isFile && (
													<span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">{note.content}</span>
												)}
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

function SidebarMenuFolder({
	folders,
	isActive,
	onChange
}: {
	folders: UserNoteFolderVO
	isActive: (folders?: UserNoteFilesVO) => boolean
	onChange: (folders: UserNoteFolderVO) => void
}) {
	const files: UserNoteFilesVO[] = folders.children || []
	return !files.length ? (
		<SidebarMenuItem onClick={() => onChange(folders)}>
			<SidebarMenuButton
				className={cn(
					'group/action transition-colors',
					isActive(folders) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
				)}
			>
				<Folder />
				<div className="flex-1">{folders.name}</div>
				<SidebarMenuFolderAction />
			</SidebarMenuButton>
		</SidebarMenuItem>
	) : (
		<SidebarMenuItem>
			<Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
				<SidebarMenuButton
					className={cn(
						'group/action transition-colors',
						isActive(folders) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
					)}
				>
					<CollapsibleTrigger asChild>
						<ChevronRight className="transition-transform" />
					</CollapsibleTrigger>
					<div className="flex flex-1  items-center gap-2" onClick={() => onChange(folders)}>
						<Folder className="w-4 h-4" />
						<span>{folders.name}</span>
					</div>
					<SidebarMenuFolderAction />
				</SidebarMenuButton>
				<CollapsibleContent>
					<SidebarMenuSub className="mr-0 pr-0">
						{files.map((children, key) => (
							<SidebarMenuFolder key={key} folders={children} onChange={onChange} isActive={isActive} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	)
}

function SidebarMenuFolderAction() {
	const [openState, setOpenState] = useState(true)
	return (
		<DropdownMenu open={openState} onOpenChange={setOpenState}>
			<DropdownMenuTrigger
				className={cn(
					'group-hover/action:visible hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md',
					openState ? 'bg-sidebar-accent text-sidebar-ring' : 'invisible'
				)}
				asChild
			>
				<MoreHorizontal />
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<FileText />
						<span>新建文档</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function SidebarDropdownMenuFolder({
	folders,
	isActive,
	onChange
}: {
	folders: UserNoteFolderVO
	isActive: (folders?: UserNoteFilesVO) => boolean
	onChange: (folders: UserNoteFolderVO) => void
}) {
	const [openState, setOpenState] = useState(false)
	const onChangeSub = (folders: UserNoteFolderVO) => (setOpenState(false), onChange(folders))
	return (
		<DropdownMenu open={openState} onOpenChange={setOpenState}>
			<DropdownMenuTrigger asChild>
				<SidebarMenuItem>
					<Tooltip>
						<TooltipTrigger asChild>
							<SidebarMenuButton
								className={cn('transition-colors', isActive() ? '!bg-sidebar-ring !text-sidebar-accent' : '')}
							>
								<Folder />
							</SidebarMenuButton>
						</TooltipTrigger>
						<TooltipContent side="right" align="center" className="relative overflow-visible" sideOffset={10}>
							{/** left arrow */}
							<div className="absolute -left-[6px] w-2 h-2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary"></div>
							<div>{folders.name}</div>
						</TooltipContent>
					</Tooltip>
				</SidebarMenuItem>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => onChange(folders)}
						className={cn(
							'transition-colors cursor-pointer',
							isActive(folders) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
						)}
					>
						<Folder />
						<span>{folders.name}</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuGroup className="px-1">
					{folders.children?.map((children, key) => (
						<SidebarDropdownMenuFolderSub key={key} folders={children} onChange={onChangeSub} isActive={isActive} />
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function SidebarDropdownMenuFolderSub({
	folders,
	isActive,
	onChange
}: {
	folders: UserNoteFolderVO
	isActive: (folders?: UserNoteFilesVO) => boolean
	onChange: (folders: UserNoteFolderVO) => void
}) {
	const files: UserNoteFilesVO[] = folders.children || []
	return !files.length ? (
		<DropdownMenuItem
			onClick={() => onChange(folders)}
			className={cn(
				'transition-colors cursor-pointer',
				isActive(folders) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
			)}
		>
			<Folder />
			<span>{folders.name}</span>
		</DropdownMenuItem>
	) : (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger
				onClick={() => onChange(folders)}
				className={cn(
					'transition-colors cursor-pointer',
					isActive(folders) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
				)}
			>
				<Folder />
				<span>{folders.name}</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					{files.map((children, key) => (
						<SidebarDropdownMenuFolderSub key={key} folders={children} onChange={onChange} isActive={isActive} />
					))}
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	)
}
