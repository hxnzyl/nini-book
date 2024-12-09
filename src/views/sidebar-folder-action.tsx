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
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
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
	file,
	children
}: Readonly<{
	parent?: UserNoteFolderVO
	file: Partial<UserNoteFolderVO & UserNoteFileVO>
	children: ReactNode
}>) {
	const { state, stateDispatch } = useHome()
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
								<ContextMenuItem
									onSelect={() => stateDispatch({ key: 'newFile', value: file.isFolder ? file : state.activeFolder })}
								>
									<File />
									<span>New File</span>
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem
									onSelect={() => stateDispatch({ key: 'newFolder', value: file.isFolder ? file : state.activeFolder })}
								>
									<Folder />
									<span>New Folder</span>
								</ContextMenuItem>
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
				</ContextMenuGroup>
				<ContextMenuGroup className={file.lvl == 1 ? 'hidden' : ''}>
					<ContextMenuItem
						onSelect={() => stateDispatch({ key: file.isFolder ? 'renameFolder' : 'renameFile', value: file })}
					>
						<FolderPen />
						<span>Rename</span>
					</ContextMenuItem>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<MoveRight />
							<span>Move</span>
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<HomeSidebarFolderActionContextMenuSub parent={parent} target={file} folders={state.folders} />
						</ContextMenuSubContent>
					</ContextMenuSub>
					<ContextMenuItem
						className="bg-red-50 text-red-500"
						onSelect={() =>
							stateDispatch({
								key: file.isFolder ? 'removeFolder' : 'removeFile',
								value: file
							})
						}
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
	folders
}: Readonly<{
	parent?: UserNoteFolderVO
	target: Partial<UserNoteFolderVO & UserNoteFileVO>
	folders: UserNoteFolderVO[]
}>) {
	const { stateDispatch } = useHome()
	return folders.map((folder) => (
		<>
			<ContextMenuItem
				key={folder.id + '_item'}
				style={{ marginLeft: folder.lvl - 1 + 'rem' }}
				disabled={target.isFolder ? target.id === folder.id : target.userNoteFolderId === folder.id}
				onSelect={() =>
					target.isFolder
						? stateDispatch({ key: 'moveFolder', value: [parent || folder, target, folder] })
						: stateDispatch({ key: 'moveFile', value: [target, folder] })
				}
			>
				<Folder />
				<span>{folder.name}</span>
			</ContextMenuItem>
			<HomeSidebarFolderActionContextMenuSub
				key={folder.id + '_sub'}
				target={target}
				parent={parent}
				folders={folder.children}
			/>
		</>
	))
}
