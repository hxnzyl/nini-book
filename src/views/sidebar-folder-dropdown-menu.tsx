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

export function HomeSidebarFolderDropdownMenu({ folders }: { folders: UserNoteFolderVO[] }) {
	const { isActive, stateDispatch } = useHome()
	const [openState, setOpenState] = useState(false)

	const onChange = (folders: UserNoteFolderVO) => (
		setOpenState(false), stateDispatch({ key: 'folders', value: folders })
	)

	return folders.map((folder) => (
		<DropdownMenu key={folder.id} open={openState} onOpenChange={setOpenState}>
			<DropdownMenuTrigger asChild>
				<SidebarMenuItem>
					<Tooltip>
						<TooltipTrigger asChild>
							<SidebarMenuButton
								className={cn(
									'transition-colors',
									isActive() ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
								)}
							>
								<Folder />
							</SidebarMenuButton>
						</TooltipTrigger>
						<TooltipContent side="right" align="center" className="relative overflow-visible" sideOffset={10}>
							{/** left arrow */}
							<div className="absolute -left-[6px] w-2 h-2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary"></div>
							<div>{folder.name}</div>
						</TooltipContent>
					</Tooltip>
				</SidebarMenuItem>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onSelect={() => onChange(folder)}
						className={cn(
							'transition-colors cursor-pointer',
							isActive(folder) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
						)}
					>
						<Folder />
						<span>{folder.name}</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuGroup className="px-1">
					<HomeSidebarFolderDropdownMenuSub folders={folder.children} onChange={onChange} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	))
}

function HomeSidebarFolderDropdownMenuSub({
	folders,
	onChange
}: {
	folders: UserNoteFolderVO[]
	onChange: (folder: UserNoteFolderVO) => void
}) {
	const { isActive } = useHome()
	return folders.map((folder) =>
		!folder.children?.length ? (
			<DropdownMenuItem
				key={folder.id}
				onSelect={() => onChange(folder)}
				className={cn(
					'transition-colors cursor-pointer',
					isActive(folder) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
				)}
			>
				<Folder />
				<span>{folder.name}</span>
			</DropdownMenuItem>
		) : (
			<DropdownMenuSub key={folder.id}>
				<DropdownMenuSubTrigger
					onClick={() => onChange(folder)}
					className={cn(
						'transition-colors cursor-pointer',
						isActive(folder) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
					)}
				>
					<Folder />
					<span>{folder.name}</span>
				</DropdownMenuSubTrigger>
				<DropdownMenuPortal>
					<DropdownMenuSubContent>
						<HomeSidebarFolderDropdownMenuSub folders={folder.children} onChange={onChange} />
					</DropdownMenuSubContent>
				</DropdownMenuPortal>
			</DropdownMenuSub>
		)
	)
}
