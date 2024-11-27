declare global {
	type ArrayTree<T = unknown> = T & {
		children?: ArrayTree<T>[]
	}

	type PromiseValue<T> = T extends Promise<infer U> ? U : T

	type PromiseProps<T> = {
		[P in keyof T]?: Promise<T[P]>
	}

	interface BooleanObject<T = unknown> {
		[key: T]: boolean
	}

	interface UnknownObject {
		[key: string]: unknown
	}
}

// no module
export {}
