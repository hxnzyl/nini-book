import { useHome } from '@/contexts/home'
import { cn } from '@/lib/utils'
import { CircleCheckBig } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomeHeader() {
	const { state, stateDispatch } = useHome()
	const [value, setValue] = useState('')
	const [defaultValue, setDefaultValue] = useState('')

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.currentTarget.value)
	}

	const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget
		if (value === '') {
			setValue(defaultValue)
		}
		stateDispatch({
			key: 'updateFile',
			value: state.activeFile,
			target: e.currentTarget
		})
	}

	useEffect(() => {
		const value = state.activeFile?.name || ''
		setValue(value)
		setDefaultValue(value)
	}, [state.activeFile])

	return (
		<header
			className={cn(
				'flex items-center gap-2 h-16 sticky top-0 border-b bg-background px-4',
				state.activeFile ? '' : 'hidden'
			)}
		>
			<input
				value={value}
				type="text"
				placeholder="Note Subject"
				maxLength={64}
				className="w-full inline-block text-2xl text-foreground appearance-none outline-none"
				style={{ width: (value.length || 12) + 'ch' }}
				onChange={onChange}
				onBlur={onBlur}
			/>
			<div
				className={cn('flex items-center gap-2 text-sm text-muted-foreground', state.activeFile?.id ? '' : 'hidden')}
			>
				<CircleCheckBig className="w-4 h-4" />
				<span>The last modification occurred at {state.activeFile?.updateTime}</span>
			</div>
		</header>
	)
}
