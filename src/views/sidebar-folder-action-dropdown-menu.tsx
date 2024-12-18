import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { DropdownMenuPortal } from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { HomeSidebarFolderActionNewMenuItems } from './sidebar-folder-action-new-menu-items'

export function HomeSidebarFolderActionDropdownMenu({
	file,
	className
}: {
	file: Partial<UserNoteFileVO & UserNoteFolderVO>
	className?: string
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div
					className={cn(
						'group-hover/action:visible hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md',
						'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-ring data-[state=closed]:invisible',
						className
					)}
				>
					<MoreHorizontal className="w-4 h-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent side="right" align="start">
					<DropdownMenuGroup>
						<HomeSidebarFolderActionNewMenuItems comp="DropdownMenu" file={file} />
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	)
}
