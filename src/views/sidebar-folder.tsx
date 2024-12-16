'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar'
import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, Folder } from 'lucide-react'
import { HomeSidebarFolderActionContextMenu } from './sidebar-folder-action-context-menu'
import { HomeSidebarFolderActionDropdownMenu } from './sidebar-folder-action-dropdown-menu'
import { HomeSidebarFolderInput } from './sidebar-folder-input'

export function HomeSidebarFolder({ parent, folders }: { parent?: UserNoteFolderVO; folders: UserNoteFolderVO[] }) {
	const { dispatch, isActive } = useHome()

	return folders.map((folder) => (
		<SidebarMenuItem key={folder.id}>
			{folder.isAdd || folder.isEdit ? (
				<HomeSidebarFolderInput file={folder} />
			) : folder.children?.length ? (
				<Collapsible className="group/collapsible [&[data-state=open]>button>svg]:rotate-90" defaultOpen>
					<HomeSidebarFolderActionContextMenu parent={parent} file={folder}>
						<SidebarMenuButton
							className={cn(
								'group/action transition-colors py-0',
								isActive(folder) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
							)}
						>
							<CollapsibleTrigger asChild>
								<ChevronRight className="transition-transform hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md" />
							</CollapsibleTrigger>
							<div
								className="flex items-center flex-1 gap-2 py-2 text-sm"
								onClick={() => dispatch({ key: 'setActiveFolderAsMenu', value: folder })}
							>
								<Folder className="w-4 h-4" />
								<span>{folder.name}</span>
							</div>
							<HomeSidebarFolderActionDropdownMenu file={folder} />
						</SidebarMenuButton>
					</HomeSidebarFolderActionContextMenu>
					<CollapsibleContent>
						<SidebarMenuSub className="mr-0 pr-0">
							<HomeSidebarFolder parent={folder} folders={folder.children} />
						</SidebarMenuSub>
					</CollapsibleContent>
				</Collapsible>
			) : (
				<HomeSidebarFolderActionContextMenu parent={parent} file={folder}>
					{/** button.py-0 and div.py-2.text-sm: issue clicking padding is invalid */}
					<SidebarMenuButton
						onClick={() => dispatch({ key: 'setActiveFolderAsMenu', value: folder })}
						className={cn(
							'group/action transition-colors py-0',
							isActive(folder) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
						)}
					>
						<div
							className="flex items-center flex-1 gap-2 py-2 text-sm"
							onClick={() => dispatch({ key: 'setActiveFolderAsMenu', value: folder })}
						>
							<Folder className="w-4 h-4" />
							<span>{folder.name}</span>
						</div>
						<HomeSidebarFolderActionDropdownMenu file={folder} />
					</SidebarMenuButton>
				</HomeSidebarFolderActionContextMenu>
			)}
		</SidebarMenuItem>
	))
}
