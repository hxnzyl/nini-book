import { LucideIcon } from '@/components/lucide-icon'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SIDEBAR_ICON_WIDTH, SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { Columns2, Columns3, Command, PanelLeft } from 'lucide-react'
import { useCallback } from 'react'
import { HomeSidebarFolder } from './sidebar-folder'
import { HomeSidebarFolderActionNewContextMenu } from './sidebar-folder-action-new-context-menu'
import { HomeSidebarFolderDropdownMenu } from './sidebar-folder-dropdown-menu'
import { HomeSidebarUser } from './sidebar-user'

const sideWidthStatic: string[][] = [
	[SIDEBAR_ICON_WIDTH, SIDEBAR_ICON_WIDTH, '0px'],
	[`calc(${SIDEBAR_ICON_WIDTH} + ${SIDEBAR_WIDTH[2]})`, SIDEBAR_ICON_WIDTH, SIDEBAR_WIDTH[2]],
	SIDEBAR_WIDTH
]

export function HomeSidebarLeft() {
	const { setOpen } = useSidebar()

	// parent provider
	const { state, dispatch, sidebarWidth, setSidebarWidth, isColumns } = useHome()

	const setColumns = useCallback(
		(columnType: 1 | 2 | 3) =>
			isColumns(columnType) || (setSidebarWidth(sideWidthStatic[columnType - 1]), setOpen(columnType !== 1)),
		[isColumns, setOpen, setSidebarWidth]
	)

	return (
		<div style={{ '--sidebar-width': sidebarWidth[1] } as React.CSSProperties}>
			<Sidebar collapsible="icon" className="overflow-hidden border-r">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" className="md:h-8 md:p-0">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Acme Inc</span>
									<span className="truncate text-xs">Enterprise</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<ScrollArea>
						<SidebarGroup>
							<SidebarMenu>
								{state.menus.map((menu) => (
									<SidebarMenuItem key={menu.id} onClick={() => dispatch({ key: 'setActiveMenu', value: menu })}>
										<Tooltip>
											<TooltipTrigger asChild>
												<SidebarMenuButton
													className={cn(
														'transition-colors',
														menu.id === state.activeMenu.id
															? '!bg-sidebar-primary !text-sidebar-primary-foreground'
															: ''
													)}
												>
													{menu.icon && <LucideIcon name={menu.icon} />}
													<span>{menu.name}</span>
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
								{isColumns(3) ? <HomeSidebarFolder folders={state.folders} /> : <HomeSidebarFolderDropdownMenu />}
							</SidebarMenu>
						</SidebarGroup>
					</ScrollArea>
					<HomeSidebarFolderActionNewContextMenu
						file={state.activeFolder.isMenu ? state.folders[0] : state.activeFolder}
					>
						<div className="flex-1"></div>
					</HomeSidebarFolderActionNewContextMenu>
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
					<HomeSidebarUser />
				</SidebarFooter>
			</Sidebar>
		</div>
	)
}
