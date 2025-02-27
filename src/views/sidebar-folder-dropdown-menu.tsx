import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { File, Folder } from 'lucide-react'

export function HomeSidebarFolderDropdownMenu({ className }: { className?: string }) {
	const { state, isActive } = useHome()

	return state.folders.map((folder) => (
		<DropdownMenu key={folder.id}>
			<DropdownMenuTrigger asChild>
				<SidebarMenuItem className={className}>
					<Tooltip>
						<TooltipTrigger asChild>
							<SidebarMenuButton className="transition-colors" isActive={isActive()}>
								<Folder />
							</SidebarMenuButton>
						</TooltipTrigger>
						<TooltipContent side="right" align="center" className="relative overflow-visible" sideOffset={10}>
							{/** left arrow */}
							<div className="absolute -left-[6px] w-2 h-2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary"></div>
							<div>{folder.name}</div>
						</TooltipContent>
					</Tooltip>
				</SidebarMenuItem>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" align="start">
				<HomeSidebarFolderDropdownMenuGroup folder={folder} />
			</DropdownMenuContent>
		</DropdownMenu>
	))
}

function HomeSidebarFolderDropdownMenuGroup({ folder }: { folder: UserNoteFolderVO }) {
	const { state, dispatch, isActive } = useHome()

	return (
		<DropdownMenuGroup className={folder.pid ? 'border-l border-sidebar-border ml-3.5 pl-2' : ''}>
			<DropdownMenuItem
				onSelect={() => dispatch({ key: 'setActiveFolder', value: folder })}
				className={cn(
					'transition-colors cursor-pointer',
					!state.activeFile && isActive(folder) ? '!bg-sidebar-accent !text-sidebar-accent-foreground' : ''
				)}
			>
				<Folder />
				<span>{folder.name}</span>
			</DropdownMenuItem>
			{folder.children.map((child) => (
				<HomeSidebarFolderDropdownMenuGroup key={child.id} folder={child} />
			))}
			<DropdownMenuGroup className="border-l border-sidebar-border ml-3.5 pl-2">
				{state.notes
					.filter((note) => note.userNoteFolderId === folder.id)
					.map((note) => (
						<DropdownMenuItem
							key={note.id}
							onSelect={() => dispatch({ key: 'activeFile', value: note })}
							className={cn(
								'transition-colors cursor-pointer',
								note.id === state.activeFile?.id ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
							)}
						>
							<File />
							<span>{note.name}</span>
						</DropdownMenuItem>
					))}
			</DropdownMenuGroup>
		</DropdownMenuGroup>
	)
}
