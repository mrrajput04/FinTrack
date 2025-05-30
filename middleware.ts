import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database"

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()
	const supabase = createMiddlewareClient<Database>({ req, res })

	try {
		const {
			data: { session },
		} = await supabase.auth.getSession()

		// If no session and trying to access protected routes
		if (
			!session &&
			(req.nextUrl.pathname.startsWith("/dashboard") ||
				req.nextUrl.pathname.startsWith("/accounts") ||
				req.nextUrl.pathname.startsWith("/transactions") ||
				req.nextUrl.pathname.startsWith("/budgets") ||
				req.nextUrl.pathname.startsWith("/goals") ||
				req.nextUrl.pathname.startsWith("/profile") ||
				req.nextUrl.pathname.startsWith("/reports"))
		) {
			const redirectUrl = req.nextUrl.clone()
			redirectUrl.pathname = "/login"
			redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
			return NextResponse.redirect(redirectUrl)
		}

		// If session exists and trying to access auth routes, redirect to dashboard
		if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
			const redirectUrl = req.nextUrl.clone()
			redirectUrl.pathname = "/dashboard"
			return NextResponse.redirect(redirectUrl)
		}

		return res
	} catch (error) {
		console.error("Middleware error:", error)
		return res
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)"],
}
