import { useEffect, useRef } from 'react'

export function useAutoSelect(lifeTime: number = 1000) {
	const inputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		const ms = Date.now()
		const current = inputRef.current
		let parent: HTMLElement | null = current
		function autoSelect() {
			if (Date.now() < lifeTime + ms) {
				while (parent) {
					if (parent.hasAttribute('aria-hidden')) {
						requestAnimationFrame(autoSelect)
						return
					}
					parent = parent.parentElement
				}
			}
			cancelAnimationFrame(autoTimer)
			current?.select()
		}
		const autoTimer = requestAnimationFrame(autoSelect)
		return () => cancelAnimationFrame(autoTimer)
	}, [lifeTime])

	return inputRef
}
