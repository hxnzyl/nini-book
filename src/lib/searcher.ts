import { SearcherProps } from '@/components/searcher'
import { escape, escapeRegExp } from 'lodash-es'

const SearcherUtils = {
	/**
	 * Return RegExp based on keyword and SearcherProps
	 *
	 * @param keyword
	 * @param htmlEscape
	 * @param props
	 * @returns
	 */
	regexp(keyword: string, htmlEscape: boolean, { matchCase, matchWholeWord, useRegularExpression }: SearcherProps) {
		if (!matchCase || matchWholeWord || useRegularExpression) {
			try {
				if (htmlEscape) keyword = escape(keyword)
				const flags = matchCase ? undefined : 'i'
				const whole = matchWholeWord ? '\\b' : ''
				const pattern = useRegularExpression ? keyword : escapeRegExp(keyword)
				return new RegExp(`${whole}(${pattern})${whole}`, flags)
			} catch (e) {
				return null
			}
		}
		return keyword
	},

	/**
	 * Return the filtered items based on keyword and SearcherProps
	 *
	 * @param items
	 * @param fields
	 * @param keyword
	 * @param props
	 * @returns
	 */
	filter<T>(items: T[], fields: (keyof T)[], keyword: string, props: SearcherProps) {
		if (keyword != null && keyword !== '') {
			const regexp = SearcherUtils.regexp(keyword, false, props)
			return regexp == null
				? []
				: typeof regexp === 'string'
				? items.filter((item) =>
						fields.some((field) => typeof item[field] === 'string' && item[field].includes(keyword))
				  )
				: items.filter((item) => fields.some((field) => typeof item[field] === 'string' && regexp.test(item[field])))
		}
		return items
	}
}

export default SearcherUtils
