'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, Folder } from 'lucide-react'
import { ComponentProps } from 'react'
import {
	HomeSidebarFolderActionContextMenu,
	HomeSidebarFolderActionDropdownMenu,
	useSidebarFolderAction
} from './sidebar-folder-action'

export function HomeSidebarFolder({ folders }: ComponentProps<'li'> & { folders: UserNoteFolderVO }) {
	const { addFolder, isActive, dispatch } = useSidebarFolderAction(folders)

	const folderChildren: UserNoteFolderVO[] = folders.children || []

	return (
		<SidebarMenuItem key={folders.id}>
			{folders.isInput ? (
				<Input
					defaultValue={folders.name}
					className="h-6 px-2 py-1 my-1 w-full bg-background shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
					onBlur={addFolder}
					autoFocus
				/>
			) : !folderChildren.length ? (
				<HomeSidebarFolderActionContextMenu folders={folders}>
					{/** button.py-0 and div.py-2.text-sm: issue clicking padding is invalid */}
					<SidebarMenuButton
						onClick={() => dispatch({ type: 'folder', target: folders })}
						className={cn(
							'group/action transition-colors py-0',
							isActive(folders) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
						)}
					>
						<div
							className="flex items-center flex-1 gap-2 py-2 text-sm"
							onClick={() => dispatch({ type: 'folder', target: folders })}
						>
							<Folder className="w-4 h-4" />
							<span>{folders.name}</span>
						</div>
						<HomeSidebarFolderActionDropdownMenu />
					</SidebarMenuButton>
				</HomeSidebarFolderActionContextMenu>
			) : (
				<Collapsible className="group/collapsible [&[data-state=open]>button>svg]:rotate-90" defaultOpen>
					<HomeSidebarFolderActionContextMenu folders={folders}>
						<SidebarMenuButton
							className={cn(
								'group/action transition-colors py-0',
								isActive(folders) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
							)}
						>
							<CollapsibleTrigger asChild>
								<ChevronRight className="transition-transform hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md" />
							</CollapsibleTrigger>
							<div
								className="flex items-center flex-1 gap-2 py-2 text-sm"
								onClick={() => dispatch({ type: 'folder', target: folders })}
							>
								<Folder className="w-4 h-4" />
								<span>{folders.name}</span>
							</div>
							<HomeSidebarFolderActionDropdownMenu />
						</SidebarMenuButton>
					</HomeSidebarFolderActionContextMenu>
					<CollapsibleContent>
						<SidebarMenuSub className="mr-0 pr-0">
							{folderChildren.map((children) => (
								<HomeSidebarFolder key={children.id} folders={children} />
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</Collapsible>
			)}
		</SidebarMenuItem>
	)
}
