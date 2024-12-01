'use client'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'
import { ReactNode } from 'react'

export interface ToasterState {
	toasts: ToasterProps[]
}

export interface ToasterAction {
	key: ToasterActionsKeys
	value?: ToasterProps
}

type ToasterProps = ToastProps & {
	title?: ReactNode
	description?: ReactNode
	action?: ToastActionElement
}

type ToasterActionsKeys = keyof typeof ToasterActions

/**
 * Toaster Actions
 */
const ToasterActions = {
	add(state: ToasterState, action: ToasterAction) {
		const { value } = action
		if (value) {
			state.toasts = [value, ...state.toasts]
		} else {
			// Warning
		}
	},
	update(state: ToasterState, action: ToasterAction) {
		const { value } = action
		if (value) {
			state.toasts = state.toasts.map((toast) => (toast.id === value.id ? { ...toast, ...value } : toast))
		} else {
			// Warning
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
