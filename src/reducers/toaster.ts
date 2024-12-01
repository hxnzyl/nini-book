'use client'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'
import { ToastProviderProps } from '@radix-ui/react-toast'
import { ReactNode } from 'react'

export type ToasterProps = ToastProps & {
	id?: string
	title?: ReactNode
	description?: ReactNode
	action?: ToastActionElement
}

export interface ToasterState extends ToastProviderProps {
	toasts: ToasterProps[]
	maxToastSize: number
}

export interface ToasterAction {
	key: keyof typeof ToasterActions
	value?: ToasterProps
}

/**
 * Toaster Actions
 */
const ToasterActions = {
	add(state: ToasterState, action: ToasterAction) {
		const { value } = action
		if (value) {
			if (value.id == null) {
				// Auto generator id
				value.id = Math.round(performance.now() * 10 + state.toasts.length) + ''
			}
			state.toasts = [value, ...state.toasts.slice(0, state.maxToastSize - 1)]
		} else {
			throw new Error('ToasterAction.value must be ToasterProps when you want to add the toast.')
		}
	},
	update(state: ToasterState, action: ToasterAction) {
		const { value } = action
		if (value && value.id) {
			state.toasts = state.toasts.map((toast) => (toast.id === value.id ? { ...toast, ...value } : toast))
		} else {
			throw new Error('ToasterAction.value.id must be defined when you want to update the toast props.')
		}
	},
	dismiss(state: ToasterState, action: ToasterAction) {
		const { value } = action
		state.toasts =
			value && value.id
				? state.toasts.map((toast) => (toast.id === value.id ? { ...toast, open: false } : toast))
				: state.toasts.map((toast) => ({ ...toast, open: false }))
	},
	remove(state: ToasterState, action: ToasterAction) {
		const { value } = action
		state.toasts = value ? state.toasts.filter((toast) => toast.id !== value.id) : []
	}
}

/**
 * Toaster Reducer
 *
 * @param state
 * @param action
 * @returns
 */
export function ToasterReducer(state: ToasterState, action: ToasterAction) {
	ToasterActions[action.key](state, action)
	return { ...state }
}
