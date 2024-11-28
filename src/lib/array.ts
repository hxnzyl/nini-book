const ArrayUtils = {
	/**
	 * Recursive Find for Children
	 *
	 * @param list
	 * @param predicate
	 * @returns
	 */
	findChildren<T = unknown>(
		list: ArrayTree<T>[] | undefined,
		predicate: (value: ArrayTree<T>, index: number) => boolean
	): ArrayTree<T> | undefined {
		if (!list) {
			return
		}
		const l = list.length
		if (!l) {
			return
		}
		for (let i = 0; i < l; i++) {
			if (predicate(list[i], i)) {
				return list[i]
			}
			const findIt = ArrayUtils.findChildren(list[i].children, predicate)
			if (findIt !== undefined) {
				return findIt
			}
		}
	}
}

export default ArrayUtils
