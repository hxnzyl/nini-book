import { getFolders } from '@/api/folders'
import { SearcherInput, SearcherProvider, SearcherText } from '@/components/searcher'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from '@/components/ui/sidebar'
import { SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { ChevronLeft, Folder, FolderSearch, FolderSearch2, RotateCw } from 'lucide-react'
import { useCallback, useState } from 'react'

export function HomeSidebarRight() {
	const [disabled, setDisabled] = useState(false)
	// parent provider
	const { state, stateDispatch, sidebarWidth } = useHome()

	const onRefresh = useCallback(() => {
		setDisabled(true)
		getFolders()
			.then((folders) => {
				stateDispatch({ key: 'refresh', value: { folders: folders[0], recycleFolders: folders[1] } })
				setDisabled(false)
			})
			.catch(() => {
				setDisabled(false)
			})
	}, [stateDispatch])

	return (
		<SearcherProvider style={{ '--sidebar-width': sidebarWidth[2] } as React.CSSProperties}>
			<Sidebar collapsible="none">
				<SidebarHeader className="border-b gap-0" style={{ width: SIDEBAR_WIDTH[2] }}>
					<div className="flex w-full items-center justify-center relative h-12">
						<Button
							variant="ghost"
							size="sm"
							title="Go Parent Folder"
							className={cn('absolute left-0', state.activeFolder.pid ? '' : 'hidden')}
							onClick={() => stateDispatch({ key: 'setActiveFolderAsParent', value: state.activeFolder })}
							disabled={disabled}
						>
							<ChevronLeft />
						</Button>
						<div className="text-base font-semibold text-foreground">{state.activeFolder.name}</div>
						<Button
							variant="ghost"
							size="icon"
							title="Refresh Folder"
							className="absolute right-0"
							onClick={onRefresh}
							disabled={disabled}
						>
							<RotateCw />
						</Button>
					</div>
					<SearcherInput
						data-sidebar="input"
						value={state.keyword}
						hidden={!state.activeFiles.length}
						placeholder="Note to search..."
						onSearch={(value, searcher) => stateDispatch({ key: 'search', value, ...searcher })}
					/>
				</SidebarHeader>
				<SidebarContent style={{ width: SIDEBAR_WIDTH[2] }}>
					<ScrollArea hidden={!state.filterFiles.length}>
						<SidebarGroup className="px-0">
							{state.filterFiles.map((file) => (
								<div
									key={file.id}
									className={cn(
										'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight transition-colors cursor-pointer',
										'last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										file.id === state.activeFile?.id ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
									)}
									onClick={() => stateDispatch({ key: file.isFolder ? 'setActiveFolder' : 'activeFile', value: file })}
								>
									<div className="flex w-full items-center gap-2">
										<Folder className={file.isFolder ? '' : 'hidden'} />
										<SearcherText text={file.name} keyword={state.keyword} />
										<span className="ml-auto text-xs">{file.date}</span>
									</div>
									<SearcherText
										hidden={!file.isFile}
										className={'line-clamp-2 w-[260px] whitespace-break-spaces text-xs'}
										text={file.content}
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
							<Button>New Document</Button>
						</div>
					</div>
				</SidebarContent>
			</Sidebar>
		</SearcherProvider>
	)
}
