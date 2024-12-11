import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
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
import {
	ArchiveRestore,
	File,
	FileText,
	Folder,
	FolderPen,
	MoreHorizontal,
	MoveRight,
	Plus,
	Trash2
} from 'lucide-react'
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
				<ContextMenuGroup className={file.deleteFlag ? 'hidden' : ''}>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<Plus />
							<span>New</span>
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<HomeSidebarFolderNewContextMenuItems file={file} />
						</ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuGroup>
				<ContextMenuGroup className={file.deleteFlag || file.lvl == 1 ? 'hidden' : ''}>
					<ContextMenuSeparator />
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
							<HomeSidebarFolderMoveContextMenuItems parent={parent} target={file} folders={state.folders} />
						</ContextMenuSubContent>
					</ContextMenuSub>
					<ContextMenuSeparator />
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
				<ContextMenuGroup className={file.deleteFlag ? '' : 'hidden'}>
					<ContextMenuItem
						onSelect={() => stateDispatch({ key: file.isFolder ? 'restoreFolder' : 'restoreFile', value: file })}
					>
						<ArchiveRestore />
						<span>Restore</span>
					</ContextMenuItem>
					<ContextMenuItem
						className="bg-red-50 text-red-500"
						onSelect={() =>
							stateDispatch({
								key: file.isFolder ? 'deleteFolder' : 'deleteFile',
								value: file
							})
						}
					>
						<Trash2 />
						<span>Delete</span>
					</ContextMenuItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}

export function HomeSidebarFolderNewContextMenu({
	file,
	children
}: Readonly<{
	file: Partial<UserNoteFolderVO & UserNoteFileVO>
	children: ReactNode
}>) {
	return file.isMenu ? (
		<></>
	) : (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<HomeSidebarFolderNewContextMenuItems file={file} />
			</ContextMenuContent>
		</ContextMenu>
	)
}

export function HomeSidebarFolderNewContextMenuItems({
	file
}: Readonly<{
	file: Partial<UserNoteFolderVO & UserNoteFileVO>
}>) {
	const { state, stateDispatch } = useHome()
	return (
		<>
			<ContextMenuItem
				onSelect={() => stateDispatch({ key: 'newFile', value: file.isFolder ? file : state.activeFolder })}
			>
				<File />
				<span>New File</span>
			</ContextMenuItem>
			<ContextMenuItem
				onSelect={() => stateDispatch({ key: 'newFolder', value: file.isFolder ? file : state.activeFolder })}
			>
				<Folder />
				<span>New Folder</span>
			</ContextMenuItem>
		</>
	)
}

export function HomeSidebarFolderMoveContextMenuItems({
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
		<div key={folder.id}>
			<ContextMenuItem
				disabled={target.isFolder ? target.id === folder.id : target.userNoteFolderId === folder.id}
				onSelect={() =>
					target.isFolder
						? stateDispatch({ key: 'moveFolder', value: [parent || folder, target, folder] })
						: stateDispatch({ key: 'moveFile', value: [target, folder] })
				}
			>
				<Folder style={{ marginLeft: folder.lvl - 1 + 'rem' }} />
				<span>{folder.name}</span>
			</ContextMenuItem>
			<HomeSidebarFolderMoveContextMenuItems target={target} parent={parent} folders={folder.children} />
		</div>
	))
}
