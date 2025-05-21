"use client"

import { CreditCardIcon, BuildingIcon, TrendingUpIcon, WalletIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Account {
  id: string
  name: string
  type: string
  institution: string
  balance: number
}

interface AccountSummaryProps {
  accounts: Account[]
  isLoading: boolean
}

export function AccountSummary({ accounts, isLoading }: AccountSummaryProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
      case "savings":
        return BuildingIcon
      case "credit":
        return CreditCardIcon
      case "investment":
        return TrendingUpIcon
      default:
        return WalletIcon
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-700"
      case "savings":
        return "bg-green-100 text-green-700"
      case "credit":
        return "bg-purple-100 text-purple-700"
      case "investment":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <WalletIcon className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No accounts yet</h3>
        <p className="text-sm text-muted-foreground">Add your first account to start tracking your finances</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => {
        const Icon = getAccountIcon(account.type)
        const colorClass = getAccountColor(account.type)

        return (
          <div key={account.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{account.name}</div>
                <div className="text-xs text-muted-foreground">{account.institution || "No institution"}</div>
              </div>
            </div>
            <div className={`text-right font-medium ${account.balance < 0 ? "text-rose-500" : ""}`}>
              {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toFixed(2)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
