'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { UserNoteFilesVO } from '@/types/vo/UserNoteFilesVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, Folder } from 'lucide-react'
import { SidebarContextMenuAction } from './sidebar-context-menu-action'

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
			<SidebarContextMenuAction>
				<SidebarMenuButton
					onClick={() => onChange(folders)}
					className={cn(
						'group/action transition-colors',
						isActive(folders) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
					)}
				>
					<Folder />
					<div className="flex-1">{folders.name}</div>
				</SidebarMenuButton>
				<SidebarMenuAction />
			</SidebarContextMenuAction>
		</SidebarMenuItem>
	) : (
		<SidebarMenuItem>
			<Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
				{/** button.py-0 and div.py-2.text-sm: issue clicking padding is invalid */}
				<SidebarContextMenuAction>
					<SidebarMenuButton
						className={cn(
							'group/action transition-colors py-0',
							isActive(folders) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
						)}
					>
						<CollapsibleTrigger asChild>
							<ChevronRight className="transition-transform hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md" />
						</CollapsibleTrigger>
						<div className="flex flex-1 gap-2 py-2 text-sm" onClick={() => onChange(folders)}>
							<Folder className="w-4 h-4" />
							<span>{folders.name}</span>
						</div>
					</SidebarMenuButton>
					<SidebarMenuAction />
				</SidebarContextMenuAction>
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
