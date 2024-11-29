import { Sidebar } from '@/components/ui/sidebar'
import { useHome } from '@/contexts/home'
import { HomeSidebarLeft } from './sidebar-left'
import { HomeSidebarRight } from './sidebar-right'

export function HomeSidebar() {
	const { sidebarWidth } = useHome()
	return (
		<div style={{ '--sidebar-width': sidebarWidth[0] } as React.CSSProperties}>
			<Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row">
				<HomeSidebarLeft />
				<HomeSidebarRight />
			</Sidebar>
		</div>
	)
}
