import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useHome } from '@/contexts/home'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { File, Folder } from 'lucide-react'

export function HomeSidebarFolderActionNewMenuItems({
	file,
	comp
}: Readonly<{
	file: Partial<UserNoteFolderVO & UserNoteFileVO>
	comp: 'DropdownMenu' | 'ContextMenu'
}>) {
	const { state, dispatch } = useHome()
	const CompItem = comp === 'DropdownMenu' ? DropdownMenuItem : ContextMenuItem
	return (
		<>
			<CompItem onSelect={() => dispatch({ key: 'newFile', value: file.isFolder ? file : state.activeFolder })}>
				<File />
				<span>New File</span>
			</CompItem>
			<CompItem onSelect={() => dispatch({ key: 'newFolder', value: file.isFolder ? file : state.activeFolder })}>
				<Folder />
				<span>New Folder</span>
			</CompItem>
		</>
	)
}
