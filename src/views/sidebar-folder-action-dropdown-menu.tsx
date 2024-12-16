import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { HomeSidebarFolderActionNewMenuItems } from './sidebar-folder-action-new-menu-items'

export function HomeSidebarFolderActionDropdownMenu({ file }: { file: UserNoteFolderVO }) {
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
					<HomeSidebarFolderActionNewMenuItems comp="DropdownMenu" file={file} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
