const TreeUtils = {
	/**
	 * Recursive Each for Tree
	 *
	 * @param list
	 * @param each
	 * @returns
	 */
	forEach<T = unknown>(
		list: ArrayTree<T>[] | undefined,
		each: (value: ArrayTree<T>, index: number, parent?: ArrayTree<T>) => boolean | void,
		parent?: ArrayTree<T>
	) {
		if (list != null) {
			const l = list.length
			if (l > 0) {
				for (let i = 0; i < l; i++) {
					if (each(list[i], i, parent) !== false) {
						TreeUtils.forEach(list[i].children, each, list[i])
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
		map: (value: ArrayTree<T>, index: number, parent?: ArrayTree<T>) => V,
		parent?: ArrayTree<T>
	) {
		const vs: V[] = []
		if (list != null) {
			const l = list.length
			if (l > 0) {
				for (let i = 0; i < l; i++) {
					vs[i] = {
						...map(list[i], i, parent),
						children: TreeUtils.map(list[i].children, map, list[i])
					}
				}
			}
		}
		return vs
	},
	/**
	 * Generator Tree
	 *
	 * @param list
	 * @param map
	 * @returns
	 */
	from<T = unknown, V = unknown>(list: ArrayTree<T>[] | undefined, map: (value: T, index: number, p?: T) => V): V[] {
		if (list != null) {
			const l = list.length
			if (l > 0) {
				const concat = (t: ArrayTree<T>, i: number, p?: ArrayTree<T>, v?: V): V | [] =>
					(v = map(t, i, p))
						? {
								...v,
								children: list.reduce((s, c, j) => (c.pid === t.id ? s.concat(concat(c, j, t) as []) : s), [])
						  }
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
		find: (value: ArrayTree<T>, index: number, parent?: ArrayTree<T>) => boolean,
		parent?: ArrayTree<T>
	): ArrayTree<T> | undefined {
		if (list != null) {
			const l = list.length
			if (l > 0) {
				for (let i = 0; i < l; i++) {
					if (find(list[i], i, parent)) {
						return list[i]
					}
					const findIt = TreeUtils.find(list[i].children, find, parent)
					if (findIt !== undefined) {
						return findIt
					}
				}
			}
		}
	},
	/**
	 * Recursive Pull for Tree
	 *
	 * @param list
	 * @param value
	 * @returns
	 */
	pull<T = unknown>(list: ArrayTree<T>[] | undefined, value: ArrayTree<T>) {
		if (list != null) {
			const l = list.length
			if (l > 0) {
				for (let i = 0; i < l; i++) {
					if (list[i] === value) {
						list.splice(i, 1)
						return true
					}
					if (TreeUtils.pull(list[i].children, value) === true) {
						return true
					}
				}
			}
		}
		return false
	}
}

export default TreeUtils
