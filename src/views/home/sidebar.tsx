'use client'

import { HighlightText } from '@/components/highlight-text'
import { LucideIcon } from '@/components/lucide-icon'
import { NavUser } from '@/components/nav-user'
import { Button } from '@/components/ui/button'
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
    useSidebar
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SIDEBAR_ICON_WIDTH, SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import ArrayUtils from '@/lib/array'
import { cn } from '@/lib/utils'
import { MenuVO } from '@/types/vo/MenuVO'
import {
    ChevronLeft,
    Columns2,
    Columns3,
    Command,
    Folder,
    FolderSearch,
    FolderSearch2,
    PanelLeft,
    RotateCw
} from 'lucide-react'
import { ComponentProps, useCallback } from 'react'
import { SidebarDropdownMenuFolder } from './sidebar-dropdown-menu-folder'
import { SidebarMenuFolder } from './sidebar-menu-folder'

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

const sideWidthStatic: string[][] = [
	[SIDEBAR_ICON_WIDTH, SIDEBAR_ICON_WIDTH, '0px'],
	[`calc(${SIDEBAR_ICON_WIDTH} + ${SIDEBAR_WIDTH[2]})`, SIDEBAR_ICON_WIDTH, SIDEBAR_WIDTH[2]],
	SIDEBAR_WIDTH
]

export function HomeSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const { setOpen } = useSidebar()

	// parent provider
	const { data, state, dispatch, sidebarWidth, setSidebarWidth, isActive, isColumns } = useHome()

	const setColumns = useCallback(
		(type: 1 | 2 | 3) => isColumns(type) || (setSidebarWidth(sideWidthStatic[type - 1]), setOpen(type !== 1)),
		[isColumns, setOpen, setSidebarWidth]
	)

	const onBackFolder = useCallback(() => {
		const folder = ArrayUtils.findChildren([data.folders], (folder) => folder.id === state.activeFolder.pid)
		if (folder) {
			dispatch({ type: 'folder', target: folder })
		}
	}, [data.folders, dispatch, state.activeFolder.pid])

	const onRefreshFolder = useCallback(() => {
		// @TODO
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
												<SidebarMenuItem key={key} onClick={() => dispatch({ type: 'menu', target: menu })}>
													<Tooltip>
														<TooltipTrigger asChild>
															<SidebarMenuButton className={cn('transition-colors', isActive(menu) ? '!bg-sidebar-ring !text-sidebar-accent' : '')}>
																{menu.icon && <LucideIcon name={menu.icon} />}
																<span hidden={isColumns(1) || isColumns(2)}>{menu.name}</span>
															</SidebarMenuButton>
														</TooltipTrigger>
														<TooltipContent side="right" align="center" className="relative overflow-visible" sideOffset={10}>
															{/** left arrow */}
															<div className="absolute -left-[6px] w-2 h-2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary"></div>
															<div>{menu.name}</div>
														</TooltipContent>
													</Tooltip>
												</SidebarMenuItem>
											))}
											{isColumns(3) ? (
												<SidebarMenuFolder
													folders={data.folders}
													isActive={isActive}
													onChange={(target) => dispatch({ type: 'folder', target })}
												/>
											) : (
												<SidebarDropdownMenuFolder
													folders={data.folders}
													isActive={isActive}
													onChange={(target) => dispatch({ type: 'folder', target })}
												/>
											)}
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
							</ScrollArea>
						</SidebarContent>
						<SidebarFooter>
							<div className={cn('flex items-center justify-center', isColumns(3) ? 'flex-row' : 'flex-col')}>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setColumns(1)}>
									<PanelLeft />
									<span className="sr-only">Set Columns 1</span>
								</Button>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setColumns(2)}>
									<Columns2 />
									<span className="sr-only">Set Columns 2</span>
								</Button>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setColumns(3)}>
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
							<div className="flex w-full items-center justify-center relative">
								<a
									href="#"
									title="Go Parent Folder"
									className={cn('absolute left-0', state.activeFolder.pid ? '' : 'hidden')}
									onClick={onBackFolder}
								>
									<ChevronLeft />
								</a>
								<div className="text-base font-semibold text-foreground">{state.activeFolder.name}</div>
								<a href="#" title="Refresh Folder" className="absolute right-0" onClick={onRefreshFolder}>
									<RotateCw className="w-5 h-5" />
								</a>
							</div>
							<SidebarInput
								value={state.keyword}
								className={state.activeFiles.length > 1 ? '' : 'hidden'}
								placeholder="Note to search..."
								onChange={(e) => dispatch({ type: 'keyword', target: e.target.value })}
							/>
						</SidebarHeader>
						<SidebarContent style={{ width: SIDEBAR_WIDTH[2] }}>
							<ScrollArea hidden={!state.filterFiles.length}>
								<SidebarGroup className="px-0">
									<SidebarGroupContent>
										{state.filterFiles.map((note) => (
											<a
												href="#"
												key={note.id}
												onClick={() => dispatch({ type: note.isFolder ? 'folder' : 'file', target: note })}
												className={cn(
													'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
													note.id === state.activeNote?.id ? '!bg-sidebar-ring !text-sidebar-accent' : ''
												)}
											>
												<div className="flex w-full items-center gap-2">
													<Folder className={note.isFolder ? '' : 'hidden'} />
													<HighlightText text={note.name} keyword={state.keyword} />
													<span className="ml-auto text-xs">{note.date}</span>
												</div>
												{note.isFile && (
													<HighlightText
														className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs"
														text={note.content}
														keyword={state.keyword}
													/>
												)}
											</a>
										))}
									</SidebarGroupContent>
								</SidebarGroup>
							</ScrollArea>
							<div
								className={cn(
									'flex flex-1 items-center justify-center',
									!state.activeFiles.length || state.filterFiles.length ? 'hidden' : ''
								)}
							>
								<div className="flex flex-col items-center gap-2">
									<FolderSearch className="w-20 h-20" />
									<span>Not found note.</span>
								</div>
							</div>
							<div className={cn('flex flex-1 items-center justify-center', state.activeFiles.length ? 'hidden' : '')}>
								<div className="flex flex-col items-center gap-2">
									<FolderSearch2 className="w-20 h-20" />
									<span>Not found note.</span>
									<Button>Add Note</Button>
								</div>
							</div>
						</SidebarContent>
					</Sidebar>
				</div>
			</Sidebar>
		</div>
	)
}
