import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { CircleCheckBig } from 'lucide-react'

export default function HomeHeader() {
	const { state, stateDispatch } = useHome()

	return (
		<header
			className={cn(
				'flex items-center h-16 sticky top-0 border-b bg-background px-4',
				state.activeFile ? '' : 'hidden'
			)}
		>
			<input
				value={state.activeFile?.name || ''}
				type="text"
				placeholder="Note Subject..."
				className="flex w-full text-2xl text-foreground focus:outline-none"
				onChange={(e) => stateDispatch({ key: 'activeFile', value: { ...state.activeFile, name: e.target.value } })}
			/>
			<CircleCheckBig />
		</header>
	)
}
