"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WalletIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const { signIn } = useAuth()
	const router = useRouter()
	const { toast } = useToast()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const { error } = await signIn(email, password)

			if (error) {
				toast({
					variant: "destructive",
					title: "Login failed",
					description: error.message,
				})
				return
			}

			toast({
				title: "Login successful",
				description: "Welcome back to FinTrack!",
			})

			// The router.push is now handled in the signIn function
			// but we can add a fallback here
			setTimeout(() => {
				router.push("/dashboard")
			}, 100)
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Login failed",
				description: error.message,
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-2">
						<WalletIcon className="h-10 w-10 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold">FinTrack</CardTitle>
					<CardDescription>Enter your email and password to login to your account</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link href="/forgot-password" className="text-xs text-primary hover:underline">
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Logging in..." : "Login"}
						</Button>
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link href="/signup" className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
