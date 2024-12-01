'use client'

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
import { useToaster } from '@/contexts/toaster'
import { cn } from '@/lib/utils'

export function Toaster() {
	const { toaster } = useToaster()
	const { maxToastSize, toasts, ...providerProps } = toaster

	return (
		<ToastProvider {...providerProps}>
			{toasts.slice(0, maxToastSize).map(({ id, title, description, action, ...toastProps }) => (
				<Toast key={id} {...toastProps}>
					<div className="grid gap-1">
						{title && <ToastTitle>{title}</ToastTitle>}
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
					{action}
					<ToastClose />
				</Toast>
			))}
			<ToastViewport className={cn('gap-2 !top-0 !left-0 !bottom-auto', toasts.length > 0 ? '' : 'hidden')} />
		</ToastProvider>
	)
}
