import { HighlightText } from '@/components/highlight-text'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput
} from '@/components/ui/sidebar'
import { SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import ArrayUtils from '@/lib/array'
import { cn } from '@/lib/utils'
import { ChevronLeft, Folder, FolderSearch, FolderSearch2, RotateCw } from 'lucide-react'
import { useCallback } from 'react'

export function HomeSidebarRight() {
	// parent provider
	const { data, state, dispatch, sidebarWidth } = useHome()

	const onBackFolder = useCallback(() => {
		const folder = ArrayUtils.findChildren([data.folders], (folder) => folder.id === state.activeFolder.pid)
		if (folder) {
			dispatch({ type: 'folder', target: folder })
		}
	}, [data.folders, dispatch, state.activeFolder.pid])

	const onRefreshFolder = useCallback(() => {
		// @TODO
	}, [])

	return (
		<div style={{ '--sidebar-width': sidebarWidth[2] } as React.CSSProperties}>
			<Sidebar collapsible="none">
				<SidebarHeader className="border-b gap-0" style={{ width: SIDEBAR_WIDTH[2] }}>
					<div className="flex w-full items-center justify-center relative h-12">
						<a
							href="#"
							title="Go Parent Folder"
							className={cn('absolute left-0', state.activeFolder.pid ? '' : 'hidden')}
							onClick={onBackFolder}
						>
							<ChevronLeft />
						</a>
						<div className="text-base font-semibold text-foreground">{state.activeFolder.name}</div>
						<a href="#" title="Refresh Folder" className="absolute right-0" onClick={onRefreshFolder}>
							<RotateCw className="w-5 h-5" />
						</a>
					</div>
					<div className={cn('flex items-center h-10', state.activeFiles.length > 1 ? '' : 'hidden')}>
						<SidebarInput
							value={state.keyword}
							placeholder="Note to search..."
							onChange={(e) => dispatch({ type: 'keyword', target: e.target.value })}
						/>
					</div>
				</SidebarHeader>
				<SidebarContent style={{ width: SIDEBAR_WIDTH[2] }}>
					<ScrollArea hidden={!state.filterFiles.length}>
						<SidebarGroup className="px-0">
							<SidebarGroupContent>
								{state.filterFiles.map((note) => (
									<a
										href="#"
										key={note.id}
										onClick={() => dispatch({ type: note.isFolder ? 'folder' : 'file', target: note })}
										className={cn(
											'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
											note.id === state.activeNote?.id ? '!bg-sidebar-ring !text-sidebar-accent' : ''
										)}
									>
										<div className="flex w-full items-center gap-2">
											<Folder className={note.isFolder ? '' : 'hidden'} />
											<HighlightText text={note.name} keyword={state.keyword} />
											<span className="ml-auto text-xs">{note.date}</span>
										</div>
										{note.isFile && (
											<HighlightText
												className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs"
												text={note.content}
												keyword={state.keyword}
											/>
										)}
									</a>
								))}
							</SidebarGroupContent>
						</SidebarGroup>
					</ScrollArea>
					<div
						className={cn(
							'flex flex-1 items-center justify-center',
							!state.activeFiles.length || state.filterFiles.length ? 'hidden' : ''
						)}
					>
						<div className="flex flex-col items-center gap-2">
							<FolderSearch className="w-20 h-20" />
							<span>Not found note.</span>
						</div>
					</div>
					<div
						className={cn(
							'flex flex-1 items-center justify-center',
							!state.activeFolder.id || state.activeFiles.length ? 'hidden' : ''
						)}
					>
						<div className="flex flex-col items-center gap-2">
							<FolderSearch2 className="w-20 h-20" />
							<span>Not found note.</span>
							<Button>Add Note</Button>
						</div>
					</div>
				</SidebarContent>
			</Sidebar>
		</div>
	)
}
