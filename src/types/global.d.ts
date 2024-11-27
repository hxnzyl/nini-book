declare global {
	type ArrayTree<T = unknown> = T & {
		children?: ArrayTree<T>[]
	}

	interface BooleanObject<T = unknown> {
		[key: T]: boolean
	}

	interface UnknownObject {
		[key: string]: unknown 
	}
}

// no module
export { }

