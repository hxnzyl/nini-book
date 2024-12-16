'use client'

import { Input } from '@/components/ui/input'
import { useHome } from '@/contexts/home'
import { useAutoSelect } from '@/hooks/use-auto-select'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'

export function HomeSidebarFolderInput({ file }: { file: Partial<UserNoteFolderVO & UserNoteFileVO> }) {
	const { dispatch } = useHome()
	const inputRef = useAutoSelect()
	const key = file.isAdd ? (file.isFolder ? 'addFolder' : 'addFile') : file.isFolder ? 'updateFolder' : 'updateFile'
	return (
		<Input
			ref={inputRef}
			defaultValue={file.name}
			className="h-6 px-2 py-1 my-1 w-full text-primary bg-primary-foreground shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
			onBlur={(event) => dispatch({ key, value: file, target: event.currentTarget })}
			onKeyDown={(event) => event.key === 'Enter' && dispatch({ key, value: file, target: event.currentTarget })}
		/>
	)
}
