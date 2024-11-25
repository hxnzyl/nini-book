const ArrayUtils = {
	/**
	 * Recursive Find for Children
	 *
	 * @param list
	 * @param predicate
	 * @returns
	 */
	findChildren<T = any>(
		list: ArrayTree<T>[] | undefined,
		predicate: (value: ArrayTree<T>, index: number) => boolean
	): ArrayTree<T> | undefined {
		let l = list?.length
		if (list && l) {
			for (let i = 0; i < l; i++) {
				if (predicate(list[i], i)) {
					return list[i]
				}
				let findIt = ArrayUtils.findChildren(list[i].children, predicate)
				if (findIt !== undefined) {
					return findIt
				}
			}
		}
	}
}

export default ArrayUtils
