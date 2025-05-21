"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type AuthContextType = {
	user: User | null
	session: Session | null
	isLoading: boolean
	signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
	signIn: (email: string, password: string) => Promise<{ error: any }>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		// Get session from supabase
		const getSession = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()
			setSession(session)
			setUser(session?.user ?? null)
			setIsLoading(false)
		}

		getSession()

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
			setUser(session?.user ?? null)
			setIsLoading(false)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	const signUp = async (email: string, password: string, fullName: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
				},
			},
		})

		if (!error) {
			// Create a user record in our users table
			await supabase.from("users").insert([
				{
					id: (await supabase.auth.getUser()).data.user?.id,
					email,
					full_name: fullName,
				},
			])
		}

		return { error }
	}

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (!error) {
			router.push("/dashboard")
		}

		return { error }
	}

	const signOut = async () => {
		await supabase.auth.signOut()
		router.push("/login")
	}

	const value = {
		user,
		session,
		isLoading,
		signUp,
		signIn,
		signOut,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
