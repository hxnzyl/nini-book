declare global {
	interface BooleanObject<T = any> {
		[key: T]: boolean
	}
	type ArrayTree<T = any> = T & {
		children?: ArrayTree<T>[]
	}
}

// no module
export {}
