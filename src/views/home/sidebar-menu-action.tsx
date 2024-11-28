import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { FileText, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export function SidebarMenuAction() {
	const [openState, setOpenState] = useState(false)
	return (
		<DropdownMenu open={openState} onOpenChange={setOpenState}>
			<DropdownMenuTrigger
				className={cn(
					'group-hover/action:visible hover:bg-sidebar-accent hover:text-sidebar-ring rounded-md',
					openState ? 'bg-sidebar-accent text-sidebar-ring' : 'invisible'
				)}
			>
				<MoreHorizontal />
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
