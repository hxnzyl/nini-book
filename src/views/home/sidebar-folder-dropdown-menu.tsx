'use client'

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
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { Folder } from 'lucide-react'
import { useState } from 'react'

export function HomeSidebarFolderDropdownMenu({ folders }: { folders: UserNoteFolderVO }) {
	const { isActive, stateDispatch } = useHome()
	const [openState, setOpenState] = useState(false)
	const onChange = (folders: UserNoteFolderVO) => (
		setOpenState(false), stateDispatch({ key: 'folders', value: folders })
	)
	return folders.isRecycle ? (
		<></>
	) : (
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
						onSelect={() => onChange(folders)}
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
						<HomeSidebarFolderDropdownMenuSub key={key} folders={children} onChange={onChange} />
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function HomeSidebarFolderDropdownMenuSub({
	folders,
	onChange
}: {
	folders: UserNoteFolderVO
	onChange: (folders: UserNoteFolderVO) => void
}) {
	const { isActive } = useHome()
	return folders.isRecycle ? (
		<></>
	) : !folders.children?.length ? (
		<DropdownMenuItem
			onSelect={() => onChange(folders)}
			className={cn(
				'transition-colors cursor-pointer',
				isActive(folders) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
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
					isActive(folders) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
				)}
			>
				<Folder />
				<span>{folders.name}</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					{folders.children.map((children, key) => (
						<HomeSidebarFolderDropdownMenuSub key={key} folders={children} onChange={onChange} />
					))}
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	)
}
