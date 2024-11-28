import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuSeparator,
	ContextMenuShortcut,
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
import { FileText, Folder, Mail, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { ReactNode, useCallback, useState } from 'react'

export function useSidebarFolderAction(folders: UserNoteFolderVO) {
	const { data, setData, isActive, dispatch } = useHome()

	const addFolder = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			const { target } = event
			const { value } = target
			if (performance.now() - folders.time < 1000 / 3 && value === folders.name) {
				target.focus()
				target.select()
			} else {
				if (value != null && value !== '') {
					folders.name = value
				}
				folders.isInput = 0
				setData({ ...data })
			}
		},
		[data, folders, setData]
	)

	const addInput = useCallback(() => {
		folders.children.push({
			id: Math.round(performance.now() * 10) + '',
			name: `New Folder(${folders.children.length + 1})`,
			lvl: folders.lvl + 1,
			isFolder: 1,
			isInput: 1,
			children: [],
			pid: folders.id,
			time: performance.now()
		})
		setData({ ...data })
	}, [data, folders, setData])

	return { addFolder, addInput, isActive, dispatch }
}

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
	const { addInput } = useSidebarFolderAction(folders)

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
								<ContextMenuItem>
									<Mail />
									<span>New Document</span>
									<ContextMenuShortcut>⌘+D</ContextMenuShortcut>
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem onSelect={addInput}>
									<Folder />
									<span>New Folder</span>
								</ContextMenuItem>
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
				</ContextMenuGroup>
				<ContextMenuGroup>
					<ContextMenuItem>
						<Trash2 />
						<span>Delete</span>
					</ContextMenuItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}
