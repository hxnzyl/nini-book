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
import { useHome } from '@/contexts/home'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ArchiveRestore, Folder, FolderPen, MoveRight, Plus, Trash2 } from 'lucide-react'
import { ReactNode } from 'react'
import { HomeSidebarFolderActionNewMenuItems } from './sidebar-folder-action-new-menu-items'

export function HomeSidebarFolderActionContextMenu({
	parent,
	file,
	children
}: Readonly<{
	parent?: UserNoteFolderVO
	file: Partial<UserNoteFolderVO & UserNoteFileVO>
	children: ReactNode
}>) {
	const { state, dispatch } = useHome()
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuGroup className={file.lvl == 1 ? '' : 'hidden'}>
					<HomeSidebarFolderActionNewMenuItems comp="ContextMenu" file={file} />
				</ContextMenuGroup>
				<ContextMenuGroup className={file.deleteFlag || file.lvl == 1 ? 'hidden' : ''}>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<Plus />
							<span>New</span>
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<HomeSidebarFolderActionNewMenuItems comp="ContextMenu" file={file} />
						</ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuGroup>
				<ContextMenuGroup className={file.deleteFlag || file.lvl == 1 ? 'hidden' : ''}>
					<ContextMenuSeparator />
					<ContextMenuItem
						onSelect={() => dispatch({ key: file.isFolder ? 'renameFolder' : 'renameFile', value: file })}
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
							<HomeSidebarFolderActionMoveContextMenuGroup parent={parent} target={file} folders={state.folders} />
						</ContextMenuSubContent>
					</ContextMenuSub>
					<ContextMenuSeparator />
					<ContextMenuItem
						className="bg-red-50 text-red-500"
						onSelect={() => dispatch({ key: file.isFolder ? 'removeFolder' : 'removeFile', value: file })}
					>
						<Trash2 />
						<span>Remove</span>
					</ContextMenuItem>
				</ContextMenuGroup>
				<ContextMenuGroup className={file.deleteFlag ? '' : 'hidden'}>
					<ContextMenuItem
						onSelect={() => dispatch({ key: file.isFolder ? 'restoreFolder' : 'restoreFile', value: file })}
					>
						<ArchiveRestore />
						<span>Restore</span>
					</ContextMenuItem>
					<ContextMenuItem
						className="bg-red-50 text-red-500"
						onSelect={() => dispatch({ key: file.isFolder ? 'deleteFolder' : 'deleteFile', value: file })}
					>
						<Trash2 />
						<span>Delete</span>
					</ContextMenuItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}

function HomeSidebarFolderActionMoveContextMenuGroup({
	parent,
	target,
	folders
}: Readonly<{
	parent?: UserNoteFolderVO
	target: Partial<UserNoteFolderVO & UserNoteFileVO>
	folders: UserNoteFolderVO[]
}>) {
	const { dispatch } = useHome()
	return folders.map((folder) => (
		<ContextMenuGroup key={folder.id}>
			<ContextMenuItem
				disabled={target.isFolder ? target.id === folder.id : target.userNoteFolderId === folder.id}
				onSelect={() =>
					target.isFolder
						? dispatch({ key: 'moveFolder', value: [parent || folder, target, folder] })
						: dispatch({ key: 'moveFile', value: [target, folder] })
				}
			>
				<Folder style={{ marginLeft: (folder.lvl - 1) / 2 + 'rem' }} />
				<span>{folder.name}</span>
			</ContextMenuItem>
			<HomeSidebarFolderActionMoveContextMenuGroup target={target} parent={parent} folders={folder.children} />
		</ContextMenuGroup>
	))
}
