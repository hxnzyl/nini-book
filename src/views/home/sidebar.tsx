'use client'

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
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { HomeContext } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { UserNotePO } from '@/types/po/UserNote'
import { SideMenu, SideMenuFolders, SideMenuItems } from '@/views/home/side-menu'
import { BookOpen, Bot, Columns2, Columns3, Command, PanelLeft, Settings2, SquareTerminal } from 'lucide-react'
import { ComponentProps, useContext, useEffect, useState } from 'react'

const user = {
	name: 'shadcn',
	email: 'm@example.com',
	avatar: '/avatars/shadcn.jpg'
}

const notes: UserNotePO[] = [
	{
		name: 'William Smith',
		email: 'williamsmith@example.com',
		subject: 'Meeting Tomorrow',
		date: '09:34 AM',
		content:
			'Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.'
	},
	{
		name: 'Alice Smith',
		email: 'alicesmith@example.com',
		subject: 'Re: Project Update',
		date: 'Yesterday',
		content: "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps."
	},
	{
		name: 'Bob Johnson',
		email: 'bobjohnson@example.com',
		subject: 'Weekend Plans',
		date: '2 days ago',
		content:
			"Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?"
	},
	{
		name: 'Emily Davis',
		email: 'emilydavis@example.com',
		subject: 'Re: Question about Budget',
		date: '2 days ago',
		content:
			"I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?"
	},
	{
		name: 'Michael Wilson',
		email: 'michaelwilson@example.com',
		subject: 'Important Announcement',
		date: '1 week ago',
		content:
			"Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future."
	},
	{
		name: 'Sarah Brown',
		email: 'sarahbrown@example.com',
		subject: 'Re: Feedback on Proposal',
		date: '1 week ago',
		content:
			"Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?"
	},
	{
		name: 'David Lee',
		email: 'davidlee@example.com',
		subject: 'New Project Idea',
		date: '1 week ago',
		content:
			"I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?"
	},
	{
		name: 'Olivia Wilson',
		email: 'oliviawilson@example.com',
		subject: 'Vacation Plans',
		date: '1 week ago',
		content:
			"Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave."
	},
	{
		name: 'James Martin',
		email: 'jamesmartin@example.com',
		subject: 'Re: Conference Registration',
		date: '1 week ago',
		content:
			"I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end."
	},
	{
		name: 'Sophia White',
		email: 'sophiawhite@example.com',
		subject: 'Team Dinner',
		date: '1 week ago',
		content:
			"To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences."
	},
	{
		name: 'Sophia Black',
		email: 'sophiablack@example.com',
		subject: 'Team Dinner',
		date: '1 week ago',
		content:
			"To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences."
	}
]

const menus: SideMenuItems[] = [
	{
		title: 'Dashboard',
		children: [
			{
				title: 'Directory',
				url: '#',
				icon: SquareTerminal,
				children: [
					{
						title: 'History',
						url: '#'
					},
					{
						title: 'Starred',
						url: '#'
					},
					{
						title: 'Settings',
						url: '#'
					}
				]
			},
			{
				title: 'Models',
				url: '#',
				icon: Bot,
				children: [
					{
						title: 'Genesis',
						url: '#'
					},
					{
						title: 'Explorer',
						url: '#'
					},
					{
						title: 'Quantum',
						url: '#'
					}
				]
			},
			{
				title: 'Documentation',
				url: '#',
				icon: BookOpen,
				children: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2,
				children: [
					{
						title: 'General',
						url: '#'
					},
					{
						title: 'Team',
						url: '#'
					},
					{
						title: 'Billing',
						url: '#'
					},
					{
						title: 'Limits',
						url: '#'
					}
				]
			}
		]
	}
]

const folders: SideMenuFolders[] = [
	{
		title: 'Files',
		children: [
			['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
			['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
			['lib', ['util.ts']],
			['public', 'favicon.ico', 'vercel.svg'],
			['.eslintrc.json'],
			['.gitignore'],
			['next.config.js'],
			['tailwind.config.js'],
			['package.json'],
			['README.md']
		]
	}
]

export function HomeSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	// Note: I'm using state to show active item.
	// IRL you should use the url/router.
	const { isMobile, setOpen } = useSidebar()

	const [activeMenu, setActiveMenu] = useState(menus[0])
	const { activeNote, setActiveNote } = useContext(HomeContext)

	const [sidebarWidth, setSidebarWidth] = useState(isMobile ? ['0px', '0px', '0px'] : ['550px', '250px', '300px'])

	const setColumns1 = () => (
		setSidebarWidth(['calc(var(--sidebar-width-icon))', 'calc(var(--sidebar-width-icon))', '0px']), setOpen(true)
	)

	const setColumns2 = () => (
		setSidebarWidth(['calc(var(--sidebar-width-icon) + 300px)', 'calc(var(--sidebar-width-icon))', '300px']),
		setOpen(true)
	)

	const setColumns3 = () => (setSidebarWidth(['550px', '250px', '300px']), setOpen(true))

	useEffect(() => {
		setSidebarWidth(isMobile ? ['0px', '0px', '0px'] : ['550px', '250px', '300px'])
	}, [isMobile])

	return (
		<div className="home-sidebar" style={{ '--sidebar-width': sidebarWidth[0] } as React.CSSProperties}>
			<Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
				{/** Menu list */}
				<div className="home-sidebar-menus" style={{ '--sidebar-width': sidebarWidth[1] } as React.CSSProperties}>
					<Sidebar collapsible="none" className="border-r">
						<SidebarHeader>
							<SidebarMenu>
								<SidebarMenuItem>
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
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarHeader>
						<SidebarContent>
							<ScrollArea>
								<SideMenu items={menus} folders={folders} />
							</ScrollArea>
						</SidebarContent>
						<SidebarFooter>
							{isMobile || (
								<div
									className={cn(
										'flex items-center justify-center',
										sidebarWidth[1] == '250px' ? 'flex-row' : 'flex-col'
									)}
								>
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
							)}
							<NavUser user={user} />
						</SidebarFooter>
					</Sidebar>
				</div>
				{/** Note list */}
				<div className="home-sidebar-notes" style={{ '--sidebar-width': sidebarWidth[2] } as React.CSSProperties}>
					<Sidebar collapsible="none">
						<SidebarHeader className="gap-3.5 border-b p-4">
							<div className="flex w-full items-center justify-between">
								<div className="text-base font-medium text-foreground">{activeMenu.title}</div>
								<Label className="flex items-center gap-2 text-sm">
									<span>Unreads</span>
									<Switch className="shadow-none" />
								</Label>
							</div>
							<SidebarInput placeholder="Type to search..." />
						</SidebarHeader>
						<SidebarContent>
							<ScrollArea>
								<SidebarGroup className="px-0">
									<SidebarGroupContent>
										{notes.map((note) => (
											<a
												href="#"
												key={note.email}
												onClick={() => setActiveNote(note)}
												className={cn(
													'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
													activeNote && note.email === activeNote.email ? '!bg-sidebar-ring !text-sidebar-accent' : ''
												)}
											>
												<div className="flex w-full items-center gap-2">
													<span>{note.name}</span>
													<span className="ml-auto text-xs">{note.date}</span>
												</div>
												<span className="font-medium">{note.subject}</span>
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
