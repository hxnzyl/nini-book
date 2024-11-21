import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'

export type LucideIconName = keyof typeof dynamicIconImports

export interface LucideIconProps extends LucideProps {
	name: LucideIconName
}

const LucideIconCaches: Partial<Record<LucideIconName, React.ComponentType>> = {}

export function LucideIcon({ name, ...props }: LucideIconProps) {
	const LucideIconPrivate = (LucideIconCaches[name] = LucideIconCaches[name] || dynamic(dynamicIconImports[name]))

	return <LucideIconPrivate {...props} />
}
