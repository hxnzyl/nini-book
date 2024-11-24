import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { NotebookPen } from 'lucide-react'

export default function HomeHeader() {
	const { activeNote, setActiveNote } = useHome()

	return (
		<>
			<header
				className={cn(
					'sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4',
					activeNote ? '' : 'hidden'
				)}
			>
				<input
					value={activeNote?.name || ''}
					type="text"
					placeholder="Note Subject..."
					className="flex w-full text-2xl text-foreground focus:outline-none"
					onChange={(e) => setActiveNote({ ...activeNote, name: e.target.value })}
				/>
			</header>
			<div className={cn('flex w-full h-full justify-center items-center text-accent', activeNote ? 'hidden' : '')}>
				<NotebookPen className="w-24 h-24" />
			</div>
		</>
	)
}
