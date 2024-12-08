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
	parent,
	folder,
	children
}: Readonly<{
	parent?: UserNoteFolderVO
	folder: UserNoteFolderVO
	children: ReactNode
}>) {
	const { state, stateDispatch } = useHome()
	const [openState, setOpenState] = useState(false)
	return (
		<ContextMenu onOpenChange={setOpenState}>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className={openState ? '' : 'hidden'}>
				<ContextMenuGroup>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<Plus />
							<span>New</span>
						</ContextMenuSubTrigger>
						<ContextMenuPortal>
							<ContextMenuSubContent>
								<ContextMenuItem onSelect={() => stateDispatch({ key: 'newDocument', value: folder })}>
									<File />
									<span>New Document</span>
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem onSelect={() => stateDispatch({ key: 'newFolder', value: folder })}>
									<Folder />
									<span>New Folder</span>
								</ContextMenuItem>
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
				</ContextMenuGroup>
				<ContextMenuGroup className={folder.lvl == 1 ? 'hidden' : ''}>
					<ContextMenuItem onSelect={() => stateDispatch({ key: 'renameFolder', value: folder })}>
						<FolderPen />
						<span>Rename</span>
					</ContextMenuItem>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<MoveRight />
							<span>Move</span>
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<HomeSidebarFolderActionContextMenuSub
								parent={parent}
								target={folder}
								folders={state.folders}
								onClose={() => setOpenState(false)}
							/>
						</ContextMenuSubContent>
					</ContextMenuSub>
					<ContextMenuItem
						className="bg-red-50 text-red-500"
						onSelect={() => stateDispatch({ key: 'removeFolder', value: folder })}
					>
						<Trash2 />
						<span>Remove</span>
					</ContextMenuItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}

function HomeSidebarFolderActionContextMenuSub({
	parent,
	target,
	folders,
	onClose
}: Readonly<{
	parent?: UserNoteFolderVO
	target: UserNoteFolderVO
	folders: UserNoteFolderVO[]
	onClose: () => void
}>) {
	const { stateDispatch } = useHome()
	return folders.map((folder) =>
		!folder.children.length ? (
			<ContextMenuItem
				key={folder.id}
				onSelect={() => stateDispatch({ key: 'moveFolder', value: [parent || folder, target, folder] })}
			>
				<Folder />
				<span>{folder.name}</span>
			</ContextMenuItem>
		) : (
			<ContextMenuSub key={folder.id}>
				<ContextMenuSubTrigger
					onClick={() => (onClose(), stateDispatch({ key: 'moveFolder', value: [parent || folder, target, folder] }))}
				>
					<Folder />
					<span>{folder.name}</span>
				</ContextMenuSubTrigger>
				<ContextMenuSubContent>
					<HomeSidebarFolderActionContextMenuSub
						target={target}
						parent={parent}
						folders={folder.children}
						onClose={onClose}
					/>
				</ContextMenuSubContent>
			</ContextMenuSub>
		)
	)
}
