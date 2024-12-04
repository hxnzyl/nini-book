'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar'
import { useHome } from '@/contexts/home'
import { useAutoSelect } from '@/hooks/use-auto-select'
import { cn } from '@/lib/utils'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, Folder } from 'lucide-react'
import { ComponentProps } from 'react'
import { HomeSidebarFolderActionContextMenu, HomeSidebarFolderActionDropdownMenu } from './sidebar-folder-action'

export function HomeSidebarFolder({ folders, ...props }: ComponentProps<'li'> & { folders: UserNoteFolderVO[] }) {
	const { stateDispatch, isActive } = useHome()
	return folders.map((folder) => (
		<SidebarMenuItem key={folder.id} {...props}>
			{folder.isAdd || folder.isEdit ? (
				<HomeSidebarFolderInput folder={folder} action={folder.isAdd ? 'addFolder' : 'updateFolder'} />
			) : folder.children?.length ? (
				<Collapsible className="group/collapsible [&[data-state=open]>button>svg]:rotate-90" defaultOpen>
					<HomeSidebarFolderActionContextMenu folders={folder}>
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
								onClick={() => stateDispatch({ key: 'setActiveFolderAsMenu', value: folder })}
							>
								<Folder className="w-4 h-4" />
								<span>{folder.name}</span>
							</div>
							<HomeSidebarFolderActionDropdownMenu />
						</SidebarMenuButton>
					</HomeSidebarFolderActionContextMenu>
					<CollapsibleContent>
						<SidebarMenuSub className="mr-0 pr-0">
							<HomeSidebarFolder folders={folder.children} />
						</SidebarMenuSub>
					</CollapsibleContent>
				</Collapsible>
			) : (
				<HomeSidebarFolderActionContextMenu folders={folder}>
					{/** button.py-0 and div.py-2.text-sm: issue clicking padding is invalid */}
					<SidebarMenuButton
						onClick={() => stateDispatch({ key: 'setActiveFolderAsMenu', value: folder })}
						className={cn(
							'group/action transition-colors py-0',
							isActive(folder) ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
						)}
					>
						<div
							className="flex items-center flex-1 gap-2 py-2 text-sm"
							onClick={() => stateDispatch({ key: 'setActiveFolderAsMenu', value: folder })}
						>
							<Folder className="w-4 h-4" />
							<span>{folder.name}</span>
						</div>
						<HomeSidebarFolderActionDropdownMenu />
					</SidebarMenuButton>
				</HomeSidebarFolderActionContextMenu>
			)}
		</SidebarMenuItem>
	))
}

function HomeSidebarFolderInput({
	folder,
	action
}: {
	folder: UserNoteFolderVO
	action: 'addFolder' | 'updateFolder'
}) {
	const { stateDispatch } = useHome()
	const inputRef = useAutoSelect()
	return (
		<Input
			ref={inputRef}
			defaultValue={folder.name}
			className="h-6 px-2 py-1 my-1 w-full bg-background shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
			onBlur={(event) => stateDispatch({ key: action, value: folder, target: event.currentTarget })}
			onKeyDown={(event) =>
				event.key === 'Enter' && stateDispatch({ key: action, value: folder, target: event.currentTarget })
			}
		/>
	)
}
