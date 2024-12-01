'use client'

import { ToasterAction, ToasterState } from '@/reducers/toaster'
import { createContext, Dispatch, useContext } from 'react'

export const ToasterContext = createContext({} as ToasterContext)

export interface ToasterContext {
	toaster: ToasterState
	toasterDispatch: Dispatch<ToasterAction>
}

export function useToaster() {
	const context = useContext(ToasterContext)
	if (!context) {
		throw new Error('useToaster must be used within a ToasterContext.Provider.')
	}

	return context
}
