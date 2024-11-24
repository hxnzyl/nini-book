import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function findChildren<T = any>(
	list: ArrayTree<T>[] | undefined,
	predicate: (value: ArrayTree<T>, index: number) => boolean
): ArrayTree<T> | undefined {
	let l = list?.length
	if (list && l) {
		for (let i = 0; i < l; i++) {
			if (predicate(list[i], i)) {
				return list[i]
			}
			let findIt = findChildren(list[i].children, predicate)
			if (findIt !== undefined) {
				return findIt
			}
		}
	}
}
