import { getFolders } from '@/api/folders'
import { SearcherInput, SearcherProvider, SearcherText } from '@/components/searcher'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from '@/components/ui/sidebar'
import { SIDEBAR_WIDTH, useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { ChevronLeft, Folder, FolderSearch, FolderSearch2, RotateCw } from 'lucide-react'
import { useCallback, useState } from 'react'
import { HomeSidebarFolderActionContextMenu } from './sidebar-folder-action-context-menu'
import { HomeSidebarFolderActionDropdownMenu } from './sidebar-folder-action-dropdown-menu'
import { HomeSidebarFolderActionNewContextMenu } from './sidebar-folder-action-new-context-menu'
import { HomeSidebarFolderInput } from './sidebar-folder-input'

export function HomeSidebarRight() {
	const [disabled, setDisabled] = useState(false)
	// parent provider
	const { state, dispatch, sidebarWidth } = useHome()

	const onRefresh = useCallback(() => {
		setDisabled(true)
		getFolders()
			.then(
				(folders) => (
					dispatch({ key: 'refresh', value: { folders: folders[0], removedFolders: folders[1] } }), setDisabled(false)
				)
			)
			.catch(() => setDisabled(false))
	}, [dispatch])

	return (
		<SearcherProvider style={{ '--sidebar-width': sidebarWidth[2] } as React.CSSProperties}>
			<Sidebar collapsible="none">
				<SidebarHeader className="border-b gap-0" style={{ width: SIDEBAR_WIDTH[2] }}>
					<div className="flex w-full items-center justify-center relative h-12">
						<Button
							variant="ghost"
							title="Go Parent Folder"
							className={cn('absolute left-0', state.activeFolder.pid ? '' : 'hidden')}
							onClick={() => dispatch({ key: 'goParentFolder', value: state.activeFolder })}
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
						onSearch={(value, searcher) => dispatch({ key: 'search', value, ...searcher })}
					/>
				</SidebarHeader>
				<SidebarContent style={{ width: SIDEBAR_WIDTH[2] }}>
					<ScrollArea hidden={!state.filterFiles.length}>
						<SidebarGroup className="p-0">
							{state.filterFiles.map((file) => (
								<div
									key={file.id}
									className={cn(
										'relative border-b p-4 text-sm transition-colors cursor-pointer',
										'group/action last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										state.activeFile?.id === file.id ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
									)}
								>
									<HomeSidebarFolderActionContextMenu file={file}>
										<div
											className="flex flex-col gap-2 whitespace-nowrap leading-tight"
											onClick={() => dispatch({ key: file.isFolder ? 'setActiveFolder' : 'activeFile', value: file })}
										>
											<div className="flex w-full items-center  gap-2">
												<Folder className={file.isFolder ? '' : 'hidden'} />
												{file.isFile && (file.isAdd || file.isEdit) ? (
													<HomeSidebarFolderInput file={file} />
												) : (
													<SearcherText text={file.name} keyword={state.keyword} />
												)}
											</div>
											<SearcherText
												hidden={!file.isFile}
												className={'line-clamp-2 w-[260px] whitespace-break-spaces text-xs'}
												text={file.content}
												keyword={state.keyword}
											/>
											<div>
												<span className="text-xs">{file.createTime}</span>
											</div>
										</div>
									</HomeSidebarFolderActionContextMenu>
									<HomeSidebarFolderActionDropdownMenu file={file} className="absolute right-4 top-4" />
								</div>
							))}
						</SidebarGroup>
					</ScrollArea>
					<HomeSidebarFolderActionNewContextMenu file={state.activeFolder}>
						<div className="flex flex-1 items-center justify-center">
							<div
								className={cn(
									'flex flex-col items-center gap-2',
									!state.activeFiles.length || state.filterFiles.length ? 'hidden' : ''
								)}
							>
								<FolderSearch className="w-20 h-20" />
								<span>Not found file.</span>
							</div>
							<div
								className={cn(
									'flex flex-col items-center gap-2',
									!state.activeFolder.id || state.activeFiles.length ? 'hidden' : ''
								)}
							>
								<FolderSearch2 className="w-20 h-20" />
								<span>Not found file.</span>
								<Button
									className={state.activeMenu.isMenu ? 'hidden' : ''}
									onClick={() => dispatch({ key: 'newFile', value: state.activeFolder })}
								>
									New File
								</Button>
							</div>
						</div>
					</HomeSidebarFolderActionNewContextMenu>
				</SidebarContent>
			</Sidebar>
		</SearcherProvider>
	)
}
