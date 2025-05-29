import type React from "react"
import Metadata from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "FinTrack - Financial Management Dashboard",
	description: "Track, analyze, and manage your finances in a visual and interactive way",
	generator: 'v0.dev'
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="./favicon.svg" type="image/svg+xml" />
			</head>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<AuthProvider>
						{children}
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
