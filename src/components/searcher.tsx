import SearcherUtils from '@/lib/searcher'
import { cn } from '@/lib/utils'
import { escape } from 'lodash-es'
import { ALargeSmall, Regex, WholeWord } from 'lucide-react'
import { ComponentProps, Dispatch, SetStateAction, createContext, useContext, useRef, useState } from 'react'
import { Input } from './ui/input'

interface SearcherContext {
	matchCase: boolean
	setMatchCase: Dispatch<SetStateAction<boolean>>
	matchWholeWord: boolean
	setMatchWholeWord: Dispatch<SetStateAction<boolean>>
	useRegularExpression: boolean
	setUseRegularExpression: Dispatch<SetStateAction<boolean>>
}

export interface SearcherProps {
	matchCase?: boolean
	matchWholeWord?: boolean
	useRegularExpression?: boolean
}

export const SearcherContext = createContext({} as SearcherContext)

export function useSearcher() {
	const context = useContext(SearcherContext)
	if (!context) {
		throw new Error('useSearcher must be used within a SearcherProvider.')
	}

	return context
}

export function SearcherProvider({
	hidden,
	className,
	children,
	matchCase = false,
	matchWholeWord = false,
	useRegularExpression = false,
	...props
}: ComponentProps<'div'> & Readonly<SearcherProps>) {
	const [matchCaseState, setMatchCase] = useState(matchCase)
	const [matchWholeWordState, setMatchWholeWord] = useState(matchWholeWord)
	const [useRegularExpressionState, setUseRegularExpression] = useState(useRegularExpression)

	const searcherContext = {
		matchCase: matchCaseState,
		setMatchCase,
		matchWholeWord: matchWholeWordState,
		setMatchWholeWord,
		useRegularExpression: useRegularExpressionState,
		setUseRegularExpression
	}

	return (
		<SearcherContext.Provider value={searcherContext}>
			<div className={cn(className, hidden ? 'hidden' : '')} {...props}>
				{children}
			</div>
		</SearcherContext.Provider>
	)
}

export function SearcherInput({
	hidden,
	className,
	onSearch,
	...props
}: ComponentProps<'input'> & {
	hidden?: boolean
	className?: string
	onSearch?: (target: string, searcher: Required<SearcherProps>) => unknown
}) {
	const { matchCase, setMatchCase, matchWholeWord, setMatchWholeWord, useRegularExpression, setUseRegularExpression } =
		useSearcher()

	const inputRef = useRef<HTMLInputElement>(null)

	const onChange = (searcher?: SearcherProps) =>
		onSearch?.(inputRef.current?.value as string, { matchCase, matchWholeWord, useRegularExpression, ...searcher })

	return (
		<div className={cn('relative py-1', hidden ? 'hidden' : '')}>
			<Input
				ref={inputRef}
				className={cn(
					'h-8 w-full bg-background shadow-none pr-24',
					'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
					className
				)}
				onChange={() => onChange()}
				{...props}
			/>
			<div className="absolute top-0 bottom-0 right-3 flex gap-0.5 items-center">
				<div
					className={cn(
						'flex items-center justify-center w-6 h-6 p-1 cursor-pointer rounded-md hover:bg-sidebar-accent',
						matchCase ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
					)}
					onClick={() => (setMatchCase(!matchCase), onChange({ matchCase: !matchCase }))}
					title="Match Case"
				>
					<ALargeSmall />
				</div>
				<div
					className={cn(
						'flex items-center justify-center w-6 h-6 p-1 cursor-pointer rounded-md hover:bg-sidebar-accent',
						matchWholeWord ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
					)}
					onClick={() => (setMatchWholeWord(!matchWholeWord), onChange({ matchWholeWord: !matchWholeWord }))}
					title="Match Whole Word"
				>
					<WholeWord />
				</div>
				<div
					className={cn(
						'flex items-center justify-center w-6 h-6 p-1 cursor-pointer rounded-md hover:bg-sidebar-accent',
						useRegularExpression ? '!bg-sidebar-primary !text-sidebar-primary-foreground' : ''
					)}
					onClick={() => (
						setUseRegularExpression(!useRegularExpression), onChange({ useRegularExpression: !useRegularExpression })
					)}
					title="Use Regular Expression"
				>
					<Regex />
				</div>
			</div>
		</div>
	)
}

export function SearcherText({
	hidden,
	text,
	keyword,
	className,
	...props
}: ComponentProps<'span'> & {
	hidden?: boolean
	text?: string
	keyword?: string
	className?: string
}) {
	const { matchCase, matchWholeWord, useRegularExpression } = useSearcher()
	if (text == null || text === '' || keyword == null || keyword === '') {
		// Empty text or Empty keyword
		return (
			<span className={cn(className, hidden ? 'hidden' : '')} {...props}>
				{text}
			</span>
		)
	}
	if (!matchCase || matchWholeWord || useRegularExpression) {
		const regexp = SearcherUtils.regexp(keyword, true, { matchCase, matchWholeWord, useRegularExpression })
		if (regexp && typeof regexp !== 'string') {
			const __html = escape(text).replace(regexp, '<span class="text-red-500 font-semibold">$1</span>')
			return (
				<span className={cn(className, hidden ? 'hidden' : '')} dangerouslySetInnerHTML={{ __html }} {...props}></span>
			)
		}
	}
	return (
		<span className={cn(className, hidden ? 'hidden' : '')} {...props}>
			{text.split(keyword).map((txt, key) => (
				<span key={key}>
					{key > 0 && <span className="text-red-500 font-semibold">{keyword}</span>}
					<span>{txt}</span>
				</span>
			))}
		</span>
	)
}
