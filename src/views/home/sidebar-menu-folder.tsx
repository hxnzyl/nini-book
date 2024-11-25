'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, FileText, Folder, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export function SidebarMenuFolder({
	folders,
	isActive,
	onChange
}: {
	folders: UserNoteFolderVO
	isActive: (folders?: UserNoteFilesVO) => boolean
	onChange: (folders: UserNoteFolderVO) => void
}) {
	const folderChildren: UserNoteFolderVO[] = folders.children || []
	return !folderChildren.length ? (
		<SidebarMenuItem>
			<SidebarMenuButton
				onClick={() => onChange(folders)}
				className={cn(
					'group/action transition-colors',
					isActive(folders) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
				)}
			>
				<Folder />
				<div className="flex-1">{folders.name}</div>
				<SidebarMenuAction />
			</SidebarMenuButton>
		</SidebarMenuItem>
	) : (
		<SidebarMenuItem>
			<Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
				{/** button.py-0 and div.py-2.text-sm: issue clicking padding is invalid */}
				<SidebarMenuButton
					className={cn(
						'group/action transition-colors py-0',
						isActive(folders) ? '!bg-sidebar-ring !text-sidebar-accent' : ''
					)}
				>
					<CollapsibleTrigger asChild>
						<ChevronRight className="transition-transform hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md" />
					</CollapsibleTrigger>
					<div className="flex flex-1 gap-2 py-2 text-sm" onClick={() => onChange(folders)}>
						<Folder className="w-4 h-4" />
						<span>{folders.name}</span>
					</div>
					<SidebarMenuAction />
				</SidebarMenuButton>
				<CollapsibleContent>
					<SidebarMenuSub className="mr-0 pr-0">
						{folderChildren.map((children, key) => (
							<SidebarMenuFolder key={key} folders={children} onChange={onChange} isActive={isActive} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	)
}

function SidebarMenuAction() {
	const [openState, setOpenState] = useState(false)
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
