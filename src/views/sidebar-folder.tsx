'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar'
import { useHome } from '@/contexts/home'
import { useAutoSelect } from '@/hooks/use-auto-select'
import { cn } from '@/lib/utils'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ChevronRight, Folder } from 'lucide-react'
import { ComponentProps } from 'react'
import { HomeSidebarFolderActionContextMenu, HomeSidebarFolderActionDropdownMenu } from './sidebar-folder-action'

export function HomeSidebarFolder({
	parent,
	folders,
	...props
}: ComponentProps<'li'> & {
	parent?: UserNoteFolderVO
	folders: UserNoteFolderVO[]
}) {
	const { stateDispatch, isActive } = useHome()
	return folders.map((folder) => (
		<SidebarMenuItem key={folder.id} {...props}>
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
								onClick={() => stateDispatch({ key: 'setActiveFolderAsMenu', value: folder })}
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
						<HomeSidebarFolderActionDropdownMenu file={folder} />
					</SidebarMenuButton>
				</HomeSidebarFolderActionContextMenu>
			)}
		</SidebarMenuItem>
	))
}

export function HomeSidebarFolderInput({ file }: { file: Partial<UserNoteFolderVO & UserNoteFileVO> }) {
	const { stateDispatch } = useHome()
	const inputRef = useAutoSelect()
	const key = file.isAdd ? (file.isFolder ? 'addFolder' : 'addFile') : file.isFolder ? 'updateFolder' : 'updateFile'
	return (
		<Input
			ref={inputRef}
			defaultValue={file.name}
			className="h-6 px-2 py-1 my-1 w-full text-primary bg-primary-foreground shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
			onBlur={(event) => stateDispatch({ key, value: file, target: event.currentTarget })}
			onKeyDown={(event) => event.key === 'Enter' && stateDispatch({ key, value: file, target: event.currentTarget })}
		/>
	)
}
