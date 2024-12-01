'use client'

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
import { useToaster } from '@/contexts/toaster'

export function Toaster() {
	const { toaster } = useToaster()

	return (
		<ToastProvider>
			{toaster.toasts.map(({ id, title, description, action, ...props }) => (
				<Toast key={id} {...props}>
					<div className="grid gap-1">
						{title && <ToastTitle>{title}</ToastTitle>}
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
					{action}
					<ToastClose />
				</Toast>
			))}
			<ToastViewport className="gap-2" />
		</ToastProvider>
	)
}
