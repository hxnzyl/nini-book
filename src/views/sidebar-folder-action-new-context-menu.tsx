import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { ReactNode } from 'react'
import { HomeSidebarFolderActionNewMenuItems } from './sidebar-folder-action-new-menu-items'

export function HomeSidebarFolderActionNewContextMenu({
	file,
	children
}: Readonly<{
	file: Partial<UserNoteFolderVO & UserNoteFileVO>
	children: ReactNode
}>) {
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<HomeSidebarFolderActionNewMenuItems comp="ContextMenu" file={file} />
			</ContextMenuContent>
		</ContextMenu>
	)
}
