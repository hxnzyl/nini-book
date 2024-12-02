const TreeUtils = {
	/**
	 * Recursive Each for Tree
	 *
	 * @param list
	 * @param each
	 * @returns
	 */
	forEach<T = unknown>(list: ArrayTree<T>[] | undefined, each: (value: ArrayTree<T>, index: number) => boolean | void) {
		if (list != null) {
			const l = list.length
			if (l > 0) {
				for (let i = 0; i < l; i++) {
					if (each(list[i], i) !== false) {
						TreeUtils.forEach(list[i].children, each)
					}
				}
			}
		}
	},
	/**
	 * Recursive Map for Tree
	 *
	 * @param list
	 * @param map
	 * @returns
	 */
	map<T = unknown, V = unknown>(
		list: ArrayTree<T>[] | undefined,
		map: (value: ArrayTree<T>, index: number) => ArrayTree<V>
	) {
		const values: ArrayTree<V>[] = []
		if (list != null) {
			const l = list.length
			if (l > 0) {
				for (let i = 0; i < l; i++) {
					values[i] = map(list[i], i)
					values[i].children = TreeUtils.map(list[i].children, map)
				}
			}
		}
		return values
	},
	/**
	 * Generator Tree
	 *
	 * @param list
	 * @param map
	 * @returns
	 */
	from<T = unknown, V = unknown>(
		list: ArrayTree<T>[] | undefined,
		map: (value: T, index: number) => ArrayTree<V>
	): ArrayTree<V>[] {
		if (list != null) {
			const l = list.length
			if (l > 0) {
				const concat = (t: ArrayTree<T>, i: number, v?: ArrayTree<V>): ArrayTree<V> | [] =>
					(v = map(t, i))
						? { ...v, children: list.reduce((s, c, j) => (c.pid === t.id ? s.concat(concat(c, j) as []) : s), []) }
						: []
				return list.reduce((s, t, i) => (t.lvl === 1 ? s.concat(concat(t, i) as []) : s), [])
			}
		}
		return []
	},
	/**
	 * Recursive Find for Tree
	 *
	 * @param list
	 * @param find
	 * @returns
	 */
	find<T = unknown>(
		list: ArrayTree<T>[] | undefined,
		find: (value: ArrayTree<T>, index: number) => boolean
	): ArrayTree<T> | undefined {
		if (list != null) {
			const l = list.length
			if (l > 0) {
				for (let i = 0; i < l; i++) {
					if (find(list[i], i)) {
						return list[i]
					}
					const findIt = TreeUtils.find(list[i].children, find)
					if (findIt !== undefined) {
						return findIt
					}
				}
			}
		}
	}
}

export default TreeUtils
