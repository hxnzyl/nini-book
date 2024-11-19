'use client'

import { cn } from '@/lib/utils'
import { Tailwindcss } from '@/types/tailwindcss'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import * as React from 'react'
import { useState } from 'react'

export type ScrollAreaScrollbarProps = React.ForwardRefExoticComponent<
	ScrollAreaPrimitive.ScrollAreaScrollbarProps & { animate?: Tailwindcss.Animate } & React.RefAttributes<HTMLDivElement>
>

const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
	const [fadeIn, setFadeIn] = useState(0)
	return (
		<ScrollAreaPrimitive.Root
			ref={ref}
			className={cn('relative overflow-hidden', className)}
			onPointerEnter={() => setFadeIn(1)}
			onPointerLeave={() => setFadeIn(2)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar animate={fadeIn == 1 ? 'fadeIn' : fadeIn == 2 ? 'fadeOut' : undefined} />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	)
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<ScrollAreaScrollbarProps>
>(({ className, orientation = 'vertical', animate, ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			'flex touch-none select-none transition-colors',
			orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
			orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
			animate && 'duration-1000',
			animate == 'fadeIn' && 'animate-in fade-in',
			animate == 'fadeOut' && 'animate-out fade-out',
			className
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
