declare global {
	type ArrayTree<T = unknown> = T & {
		id: string
		pid: string
		lvl: number
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

	interface ReducerAction<V = unknown, K = string, T = Element> {
		key: K | keyof V
		value: Partial<V> | V[keyof V]
		target?: T
	}

	type ReducerHook<S, A, K = A['key'], T = void> = {
		[key in K]?: {
			before?: (state: S, action: A) => T | void
			after?: (state: S, action: A) => T | void
		}
	}
}

// no module
export {}
