import { createContext, Dispatch, SetStateAction, useContext } from 'react'

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
