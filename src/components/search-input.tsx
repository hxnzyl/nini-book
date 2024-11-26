import StringUtils from '@/lib/string'
import { cn } from '@/lib/utils'
import { escape } from 'lodash-es'
import { ComponentProps, useState } from 'react'
import { LucideIcon, LucideIconName } from './lucide-icon'
import { Input } from './ui/input'

interface SearchSettings {
	matchCase?: boolean
	matchWholeWord?: boolean
	useRegularExpression?: boolean
}

/**
 *
 * @param param0
 */
export function SearchInput({
	hidden,
	className,
	matchCase = false,
	matchWholeWord = false,
	useRegularExpression = false,
	...props
}: Readonly<
	ComponentProps<typeof Input> & {
		hidden?: boolean
		className?: string
	} & SearchSettings
>) {
	const [settings, setSettings] = useState([
		{ name: 'matchCase', value: matchCase, icon: 'a-large-small' },
		{ name: 'matchWholeWord', value: matchWholeWord, icon: 'whole-word' },
		{ name: 'useRegularExpression', value: useRegularExpression, icon: 'regex' }
	])

	const toggleSettings = (key: number) => {
		const unSettings = settings.slice(0)
		unSettings[key] = { ...settings[key], value: !settings[key].value }
		setSettings(unSettings)
	}

	return (
		<div className={cn('relative flex items-center', className, hidden ? 'hidden' : '')}>
			<Input
				className="h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring pr-24"
				{...props}
			/>
			<div className="absolute right-3 flex gap-0.5 items-center">
				{settings.map((setting, key) => (
					<div
						key={key}
						className={cn(
							'flex items-center justify-center w-6 h-6 p-1 rounded-md cursor-pointer hover:bg-sidebar-accent',
							setting.value ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
						)}
						onClick={() => toggleSettings(key)}
					>
						<LucideIcon name={setting.icon as LucideIconName} />
					</div>
				))}
			</div>
		</div>
	)
}

/**
 * Search Result based on keyword
 *
 * @param param0
 * @returns
 */
export function SearchResult({
	text,
	keyword,
	className,
	matchCase = false,
	matchWholeWord = false,
	useRegularExpression = false
}: Readonly<{ text?: string; keyword?: string; className?: string } & SearchSettings>) {
	if (StringUtils.isEmpty(text) || StringUtils.isEmpty(keyword)) {
		// Empty text or Empty keyword
		return <span className={className}>{text}</span>
	}
	if (matchCase) {
		// Case Insensitive
		const __html = escape(text).replace(
			new RegExp(`(${escape(keyword)})`, 'i'),
			'<span class="text-red-500 font-semibold">$1</span>'
		)
		return <span className={className} dangerouslySetInnerHTML={{ __html }}></span>
	}
	// Case Sensitive
	return (
		<span className={className}>
			{text.split(keyword).map((txt, key) => (
				<span key={key}>
					{key > 0 && <span className="text-red-500 font-semibold">{keyword}</span>}
					<span>{txt}</span>
				</span>
			))}
		</span>
	)
}
