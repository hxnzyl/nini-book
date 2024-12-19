'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar'
import { useHome } from '@/contexts/home'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, Folder } from 'lucide-react'
import { HomeSidebarFolderActionContextMenu } from './sidebar-folder-action-context-menu'
import { HomeSidebarFolderActionDropdownMenu } from './sidebar-folder-action-dropdown-menu'
import { HomeSidebarFolderInput } from './sidebar-folder-input'

export function HomeSidebarFolder({
	current,
	folders,
	className
}: {
	current?: UserNoteFolderVO
	folders: UserNoteFolderVO[]
	className?: string
}) {
	const { dispatch, isActive } = useHome()

	return folders.map((folder) => (
		<SidebarMenuItem key={folder.id} className={className}>
			{folder.isAdd || folder.isEdit ? (
				<HomeSidebarFolderInput file={folder} />
			) : folder.children?.length ? (
				<Collapsible className="group/collapsible [&[data-state=open]>button>svg]:rotate-90" defaultOpen>
					<HomeSidebarFolderActionContextMenu parent={current} file={folder}>
						<SidebarMenuButton className="group/action transition-colors py-0" isActive={isActive(folder)}>
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
							<HomeSidebarFolder current={folder} folders={folder.children} />
						</SidebarMenuSub>
					</CollapsibleContent>
				</Collapsible>
			) : (
				<HomeSidebarFolderActionContextMenu parent={current} file={folder}>
					{/** button.py-0 and div.py-2.text-sm: issue clicking padding is invalid */}
					<SidebarMenuButton
						onClick={() => dispatch({ key: 'setActiveFolderAsMenu', value: folder })}
						className="group/action transition-colors py-0"
						isActive={isActive(folder)}
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
