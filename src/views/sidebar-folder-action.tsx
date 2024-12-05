import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { File, FileText, Folder, FolderPen, MoreHorizontal, MoveRight, Plus, Trash2 } from 'lucide-react'
import { ReactNode, useState } from 'react'

export function HomeSidebarFolderActionDropdownMenu() {
	const [openState, setOpenState] = useState(false)
	return (
		<DropdownMenu open={openState} onOpenChange={setOpenState}>
			<DropdownMenuTrigger asChild>
				<div
					className={cn(
						'group-hover/action:visible hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md',
						openState ? 'bg-sidebar-accent text-sidebar-ring' : 'invisible'
					)}
				>
					<MoreHorizontal className="w-4 h-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<FileText />
						<span>Add Note</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function HomeSidebarFolderActionContextMenu({
	folders,
	children
}: Readonly<{
	folders: UserNoteFolderVO
	children: ReactNode
}>) {
	const { stateDispatch } = useHome()

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuGroup>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<Plus />
							<span>New</span>
						</ContextMenuSubTrigger>
						<ContextMenuPortal>
							<ContextMenuSubContent>
								<ContextMenuItem onSelect={() => stateDispatch({ key: 'newDocument', value: folders })}>
									<File />
									<span>New Document</span>
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem onSelect={() => stateDispatch({ key: 'newFolder', value: folders })}>
									<Folder />
									<span>New Folder</span>
								</ContextMenuItem>
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
				</ContextMenuGroup>
				<ContextMenuGroup className={folders.lvl == 1 ? 'hidden' : ''}>
					<ContextMenuItem onSelect={() => stateDispatch({ key: 'renameFolder', value: folders })}>
						<FolderPen />
						<span>Rename</span>
					</ContextMenuItem>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<MoveRight />
							<span>Move</span>
						</ContextMenuSubTrigger>
						<ContextMenuPortal>
							<ContextMenuSubContent>
								<ContextMenuItem>
									<Folder />
									<span>Folder</span>
								</ContextMenuItem>
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
					<ContextMenuItem
						className="bg-red-50 text-red-500"
						onSelect={() => stateDispatch({ key: 'removeFolder', value: folders })}
					>
						<Trash2 />
						<span>Remove</span>
					</ContextMenuItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}
