import { getFolders } from '@/api/folders'
import { SearcherInput, SearcherProvider, SearcherText } from '@/components/searcher'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from '@/components/ui/sidebar'
import { SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import ArrayUtils from '@/lib/array'
import { cn } from '@/lib/utils'
import { ChevronLeft, Folder, FolderSearch, FolderSearch2, RotateCw } from 'lucide-react'
import { useCallback } from 'react'

export function HomeSidebarRight() {
	// parent provider
	const { data, refreshData, state, dispatch, sidebarWidth } = useHome()

	const onBackFolder = useCallback(() => {
		const folder = ArrayUtils.findChildren([data.folders], (folder) => folder.id === state.activeFolder.pid)
		if (folder) {
			dispatch({ type: 'folder', target: folder })
		}
	}, [data.folders, dispatch, state.activeFolder.pid])

	const onRefreshFolder = useCallback(() => {
		refreshData({
			folders: getFolders()
		})
	}, [refreshData])

	return (
		<SearcherProvider style={{ '--sidebar-width': sidebarWidth[2] } as React.CSSProperties}>
			<Sidebar collapsible="none">
				<SidebarHeader className="border-b gap-0" style={{ width: SIDEBAR_WIDTH[2] }}>
					<div className="flex w-full items-center justify-center relative h-12">
						<div
							title="Go Parent Folder"
							className={cn(
								'absolute left-0 flex items-center w-7 h-7 p-1 cursor-pointer rounded-md hover:bg-sidebar-accent',
								state.activeFolder.pid ? '' : 'hidden'
							)}
							onClick={onBackFolder}
						>
							<ChevronLeft />
						</div>
						<div className="text-base font-semibold text-foreground">{state.activeFolder.name}</div>
						<div
							title="Refresh Folder"
							className="absolute right-0 flex items-center w-7 h-7 p-1 cursor-pointer rounded-md hover:bg-sidebar-accent"
							onClick={onRefreshFolder}
						>
							<RotateCw />
						</div>
					</div>
					<SearcherInput
						data-sidebar="input"
						value={state.keyword}
						hidden={!state.activeFiles.length}
						placeholder="Note to search..."
						onSearch={(target, searcher) => dispatch({ type: 'keyword', target, searcher })}
					/>
				</SidebarHeader>
				<SidebarContent style={{ width: SIDEBAR_WIDTH[2] }}>
					<ScrollArea hidden={!state.filterFiles.length}>
						<SidebarGroup className="px-0">
							{state.filterFiles.map((note) => (
								<div
									key={note.id}
									className={cn(
										'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight transition-colors cursor-pointer',
										'last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										note.id === state.activeNote?.id ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
									)}
									onClick={() => dispatch({ type: note.isFolder ? 'folder' : 'file', target: note })}
								>
									<div className="flex w-full items-center gap-2">
										<Folder className={note.isFolder ? '' : 'hidden'} />
										<SearcherText text={note.name} keyword={state.keyword} />
										<span className="ml-auto text-xs">{note.date}</span>
									</div>
									<SearcherText
										hidden={!note.isFile}
										className={'line-clamp-2 w-[260px] whitespace-break-spaces text-xs'}
										text={note.content}
										keyword={state.keyword}
									/>
								</div>
							))}
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
							<span>Not found document.</span>
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
							<span>Not found document.</span>
							<Button>Add Document</Button>
						</div>
					</div>
				</SidebarContent>
			</Sidebar>
		</SearcherProvider>
	)
}
