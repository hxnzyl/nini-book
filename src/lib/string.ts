const StringUtils = {
	/**
	 * Returns true if targetString is not null and not balnk
	 */
	isEmpty(targetString?: string) {
		return targetString == null || targetString === ''
	},
	/**
	 * Returns true if searchString appears as a substring of the result of converting this
	 * object to a String, at one or more positions that are
	 * greater than or equal to position; otherwise, returns false.
	 *
	 * @note Case-insensitive
	 *
	 * @param searchString search string
	 * @param position If position is undefined, 0 is assumed, so as to search all of the String.
	 */
	includes(targetString?: string, searchString?: string, position?: number) {
		return (
			targetString != null &&
			searchString != null &&
			targetString.toLowerCase().includes(searchString.toLowerCase(), position)
		)
	}
}

export default StringUtils
