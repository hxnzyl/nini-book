'use client'

import { LucideIcon } from '@/components/lucide-icon'
import { NavUser } from '@/components/nav-user'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuSub
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { RIGHT_SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { UserNoteFilePO } from '@/types/po/UserNoteFilePO'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronRight, Columns2, Columns3, Command, Folder, PanelLeft } from 'lucide-react'
import { ComponentProps } from 'react'

const user = {
	name: 'shadcn',
	email: 'm@example.com',
	avatar: '/avatars/shadcn.jpg'
}

const menus: MenuVO[] = [
	{
		title: 'Directory',
		icon: 'square-terminal',
		children: [
			{
				title: 'History'
			},
			{
				title: 'Starred'
			},
			{
				title: 'Settings'
			}
		]
	},
	{
		title: 'Models',
		icon: 'bot',
		children: [
			{
				title: 'Genesis'
			},
			{
				title: 'Explorer'
			},
			{
				title: 'Quantum'
			}
		]
	},
	{
		title: 'Documentation',
		icon: 'book-open',
		children: [
			{
				title: 'Introduction'
			},
			{
				title: 'Get Started'
			},
			{
				title: 'Tutorials'
			},
			{
				title: 'Changelog'
			}
		]
	},
	{
		title: 'Settings',
		icon: 'settings-2',
		children: [
			{
				title: 'General'
			},
			{
				title: 'Team'
			},
			{
				title: 'Billing'
			},
			{
				title: 'Limits'
			}
		]
	}
]

const notes: UserNoteFilePO[] = [
	{
		title: 'Meeting Tomorrow',
		date: '09:34 AM',
		content:
			'Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.'
	},
	{
		title: 'Re: Project Update',
		date: 'Yesterday',
		content: "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps."
	},
	{
		title: 'Weekend Plans',
		date: '2 days ago',
		content:
			"Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?"
	},
	{
		title: 'Re: Question about Budget',
		date: '2 days ago',
		content:
			"I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?"
	},
	{
		title: 'Important Announcement',
		date: '1 week ago',
		content:
			"Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future."
	},
	{
		title: 'Re: Feedback on Proposal',
		date: '1 week ago',
		content:
			"Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?"
	},
	{
		title: 'New Project Idea',
		date: '1 week ago',
		content:
			"I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?"
	},
	{
		title: 'Vacation Plans',
		date: '1 week ago',
		content:
			"Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave."
	},
	{
		title: 'Re: Conference Registration',
		date: '1 week ago',
		content:
			"I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end."
	},
	{
		title: 'Team Dinner',
		date: '1 week ago',
		content:
			"To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences."
	},
	{
		title: 'Team Dinner',
		date: '1 week ago',
		content:
			"To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences."
	}
]

const folder: UserNoteFolderVO = {
	name: 'My Folder',
	children: [
		{
			name: 'Folder 1'
		},
		{
			name: 'Folder 2'
		}
	]
}

export function HomeSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const {
		activeNotes,
		activeNote,
		setActiveNote,
		sidebarWidth,
		leftSidebarWidth,
		rightSidebarWidth,
		isColumns3,
		setColumns1,
		setColumns2,
		setColumns3
	} = useHome()

	return (
		<div style={{ '--sidebar-width': sidebarWidth } as React.CSSProperties}>
			<Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
				{/** Menu list */}
				<div style={{ '--sidebar-width': leftSidebarWidth } as React.CSSProperties}>
					<Sidebar collapsible="icon" className="border-r">
						<SidebarHeader>
							<SidebarMenu>
								<SidebarMenu>
									<SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
										<a href="#">
											<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
												<Command className="size-4" />
											</div>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">Acme Inc</span>
												<span className="truncate text-xs">Enterprise</span>
											</div>
										</a>
									</SidebarMenuButton>
								</SidebarMenu>
							</SidebarMenu>
						</SidebarHeader>
						<SidebarContent>
							<ScrollArea>
								<SidebarGroup>
									<SidebarGroupContent>
										{menus.map((item, key1) => (
											<SidebarMenu key={key1}>
												<SidebarMenu>
													<SidebarMenuButton tooltip={item.title}>
														{item.icon && <LucideIcon name={item.icon} />}
														<span className={isColumns3() ? '' : 'hidden'}>{item.title}</span>
													</SidebarMenuButton>
												</SidebarMenu>
											</SidebarMenu>
										))}
										<SidebarMenu>
											{isColumns3() ? (
												<SidebarFolder folder={folder}></SidebarFolder>
											) : (
												<SidebarMenu>
													<SidebarMenuButton>
														<Folder />
													</SidebarMenuButton>
												</SidebarMenu>
											)}
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
							</ScrollArea>
						</SidebarContent>
						<SidebarFooter>
							<div className={cn('flex items-center justify-center', isColumns3() ? 'flex-row' : 'flex-col')}>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={setColumns1}>
									<PanelLeft />
									<span className="sr-only">Set Columns 1</span>
								</Button>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={setColumns2}>
									<Columns2 />
									<span className="sr-only">Set Columns 2</span>
								</Button>
								<Button variant="ghost" size="icon" className="h-7 w-7" onClick={setColumns3}>
									<Columns3 />
									<span className="sr-only">Set Columns 3</span>
								</Button>
							</div>
							<NavUser user={user} />
						</SidebarFooter>
					</Sidebar>
				</div>
				{/** Note list */}
				<div style={{ '--sidebar-width': rightSidebarWidth } as React.CSSProperties}>
					<Sidebar collapsible="none">
						<SidebarHeader className="gap-3.5 border-b p-4" style={{ width: RIGHT_SIDEBAR_WIDTH }}>
							<div className="flex w-full items-center justify-between">
								<div className="text-base font-medium text-foreground">{activeNotes.name}</div>
								<Label className="flex items-center gap-2 text-sm">
									<span>Unreads</span>
									<Switch className="shadow-none" />
								</Label>
							</div>
							<SidebarInput placeholder="Note to search..." />
						</SidebarHeader>
						<SidebarContent style={{ width: RIGHT_SIDEBAR_WIDTH }}>
							<ScrollArea>
								<SidebarGroup className="px-0">
									<SidebarGroupContent>
										{notes.map((note, key) => (
											<a
												href="#"
												key={key}
												onClick={() => setActiveNote(note)}
												className={cn(
													'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
													activeNote && note.title === activeNote.title ? '!bg-sidebar-ring !text-sidebar-accent' : ''
												)}
											>
												<div className="flex w-full items-center gap-2">
													<span>{note.title}</span>
													<span className="ml-auto text-xs">{note.date}</span>
												</div>
												<span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">{note.content}</span>
											</a>
										))}
									</SidebarGroupContent>
								</SidebarGroup>
							</ScrollArea>
						</SidebarContent>
					</Sidebar>
				</div>
			</Sidebar>
		</div>
	)
}

function SidebarFolder({ folder }: { folder: UserNoteFolderVO }) {
	const { setActiveNotes } = useHome()
	return !folder.children || !folder.children.length ? (
		<SidebarMenu>
			<SidebarMenuButton
				className="pl-1.5"
				onClick={() => setActiveNotes({ name: folder.name, files: folder.children })}
			>
				<Folder className="w-4 h-4" />
				<span>{folder.name}</span>
			</SidebarMenuButton>
		</SidebarMenu>
	) : (
		<Collapsible
			className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
			defaultOpen
			asChild
		>
			<SidebarMenu>
				<SidebarMenuButton>
					<CollapsibleTrigger asChild>
						<ChevronRight className="transition-transform" />
					</CollapsibleTrigger>
					<div
						className="flex items-center gap-2"
						onClick={() => setActiveNotes({ name: folder.name, files: folder.children })}
					>
						<Folder className="w-4 h-4" />
						<span>{folder.name}</span>
					</div>
				</SidebarMenuButton>
				<CollapsibleContent>
					<SidebarMenuSub>
						{folder.children?.map((child, index) => (
							<SidebarFolder key={index} folder={child} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenu>
		</Collapsible>
	)
}
