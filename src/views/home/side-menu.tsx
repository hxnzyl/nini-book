'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub
} from '@/components/ui/sidebar'
import { useHome } from '@/contexts/home'
import { ChevronRight, Folder, LucideIcon } from 'lucide-react'

export interface SideMenuItem {
	title: string
	url: string
	icon?: LucideIcon
	children?: SideMenuItem[]
}

export type SideMenuFolder = string | string[] | SideMenuFolder[]

export interface SideMenuProps {
	items: SideMenuItem[]
	folders: SideMenuFolder[]
}

export function SideMenu({ items, folders }: SideMenuProps) {
	const { isColumns3 } = useHome()
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				{items.map((item, key1) => (
					<SidebarMenu key={key1}>
						<SidebarMenuItem>
							<SidebarMenuButton tooltip={item.title}>
								{item.icon && <item.icon />}
								<span className={isColumns3() ? '' : 'hidden'}>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				))}
				<SidebarMenu>
					{isColumns3() ? (
						<SideFolder folder={folders}></SideFolder>
					) : (
						<SidebarMenuItem>
							<SidebarMenuButton>
								<Folder />
							</SidebarMenuButton>
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

function SideFolder({ folder }: { folder: SideMenuFolder }) {
	const [name, ...files] = Array.isArray(folder) ? folder : [folder]
	return (
		<Collapsible
			className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
			defaultOpen={name === 'app'}
			asChild
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRight className="transition-transform" />
						<Folder />
						{name}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{files.map((file, index) => (
							<SideFolder key={index} folder={file} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	)
}
