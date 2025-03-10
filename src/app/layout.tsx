import '@/assets/globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ReactNode } from 'react'

const geistSans = localFont({
	src: '../assets/fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})

const geistMono = localFont({
	src: '../assets/fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export const metadata: Metadata = {
	title: 'Nini Book',
	description: 'Generated by Nini'
}

export default function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en">
			{/* <head>
				<script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
			</head> */}
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>{children}</body>
		</html>
	)
}
