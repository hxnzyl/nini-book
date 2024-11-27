const StringUtils = {
	/**
	 * Returns true if searchString appears as a substring of the result of converting targetString
	 * object to a String, at one or more positions that are
	 * greater than or equal to position; otherwise, returns false.
	 *
	 * @note Case-insensitive
	 *
	 * @param targetString target string
	 * @param searchString search string
	 * @param position If position is undefined, 0 is assumed, so as to search all of the String.
	 */
	includes(targetString?: string, searchString?: string, position?: number) {
		return (
			targetString != null &&
			targetString !== '' &&
			searchString != null &&
			searchString !== 'nll' &&
			targetString.toLowerCase().includes(searchString.toLowerCase(), position)
		)
	}
}

export default StringUtils
