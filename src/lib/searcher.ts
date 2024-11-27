import { SearcherProps } from '@/components/searcher'
import { escape } from 'lodash-es'

const SearcherUtils = {
	/**
	 * Return RegExp based on keyword and SearcherProps
	 *
	 * @param keyword
	 * @param props
	 * @returns
	 */
	regexp(keyword: string, props: SearcherProps): RegExp | string {
		// Case Sensitive
		const caseIn = props.matchCase ? undefined : 'i'
		try {
			return props.matchWholeWord
				? new RegExp(`\\b(${escape(keyword)})\\b`, caseIn)
				: props.useRegularExpression
				? new RegExp(`(${keyword})`, caseIn)
				: keyword
		} catch (e) {}
		return keyword
	},

	/**
	 * Filter items based on keyword and SearcherProps
	 *
	 * @param items
	 * @param fields
	 * @param keyword
	 * @param props
	 * @returns
	 */
	filter<T>(items: T[], fields: (keyof T)[], keyword: string, props: SearcherProps) {
		if (keyword != null && keyword !== '') {
			const regexp = SearcherUtils.regexp(keyword, props)
			return typeof regexp === 'string'
				? items.filter((item) => fields.some((field) => item[field] != null && (item[field] as string).includes(keyword)))
				: items.filter((item) => fields.some((field) => item[field] != null && regexp.test(item[field] as string)))
		}
		return items
	}
}

export default SearcherUtils
