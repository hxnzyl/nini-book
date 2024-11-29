import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { NotebookPen } from 'lucide-react'

export default function HomeHeader() {
	const { state, stateDispatch } = useHome()

	return (
		<>
			<header className={cn('sticky top-0 border-b bg-background px-4', state.activeNote ? '' : 'hidden')}>
				<div className="flex items-center h-16">
					<input
						value={state.activeNote?.name || ''}
						type="text"
						placeholder="Note Subject..."
						className="flex w-full text-2xl text-foreground focus:outline-none"
						onChange={(e) =>
							stateDispatch({ key: 'setActiveNote', value: { ...state.activeNote, name: e.target.value } })
						}
					/>
				</div>
			</header>
			<div
				className={cn('flex w-full h-full justify-center items-center text-accent', state.activeNote ? 'hidden' : '')}
			>
				<NotebookPen className="w-24 h-24" />
			</div>
		</>
	)
}
