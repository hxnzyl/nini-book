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
import { useHome } from '@/contexts/home'
import { Folder, Mail, Plus, Trash2 } from 'lucide-react'
import { ReactNode } from 'react'

export function SidebarContextMenuAction({ children }: { children: ReactNode }) {
	const { data } = useHome()
	const addFolder = () => {}

	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
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
								<ContextMenuItem onSelect={addFolder}>
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
