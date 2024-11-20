'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { ChevronRight, File, Folder, LucideIcon } from 'lucide-react'

export interface SideMenuItem {
	title: string
	url: string
	icon?: LucideIcon
	children?: SideMenuItem[]
}

export interface SideMenuItems {
	title: string
	children?: SideMenuItem[]
}

export type SideMenuFolder = string | string[] | SideMenuFolder[]

export interface SideMenuFolders {
	title: string
	children: SideMenuFolder[]
}

export interface SideMenuProps {
	items: SideMenuItems[]
	folders: SideMenuFolders[]
}

export function SideMenu({ items, folders }: SideMenuProps) {
	return (
		<SidebarGroup>
			{items.map(({ title, children }, key1) => (
				<SidebarGroupContent key={key1}>
					<SidebarGroupLabel>{title}</SidebarGroupLabel>
					<SidebarMenu>
						{children?.map((item, key2) => (
							<Collapsible key={`item_${key1}_${key2}`} defaultOpen={key1 === 0} asChild className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.children?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<a href={subItem.url}>
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			))}
			{folders.map(({ title, children }, key1) => (
				<SidebarGroupContent key={key1}>
					<SidebarGroupLabel>{title}</SidebarGroupLabel>
					<SidebarMenu>
						{children?.map((item, key2) => (
							<SideFolder key={`fold_${key1}_${key2}`} folder={item}></SideFolder>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			))}
		</SidebarGroup>
	)
}

function SideFolder({ folder }: { folder: SideMenuFolder }) {
	const [name, ...files] = Array.isArray(folder) ? folder : [folder]
	if (files.length > 0) {
		return (
			<Collapsible
				className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen={name === 'app'}
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
	} else {
		return (
			<SidebarMenuButton className="data-[active=true]:bg-transparent">
				<File />
				{name}
			</SidebarMenuButton>
		)
	}
}
