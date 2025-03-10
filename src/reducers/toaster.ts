'use client'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'
import { ReactNode } from 'react'

export interface ToasterProps extends ToastProps {
	id?: string
	description?: ReactNode
	action?: ToastActionElement
}

export interface ToasterState extends ToasterProps {
	toasts: ToasterProps[]
	maxToastSize: number
}

export type ToasterAction = ReducerAction<ToasterState, keyof typeof ToasterActions>

/**
 * Toaster Actions
 */
const ToasterActions = {
	add(state: ToasterState, action: ToasterAction) {
		const { value } = action
		if (value) {
			if (!value.id) {
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
	if (action.key in ToasterActions) {
		ToasterActions[action.key as keyof typeof ToasterActions](state, action)
	} else {
		// Refresh Data, keyof ToasterState
		state[action.key as keyof ToasterState] = action.value as never
	}
	return { ...state }
}
