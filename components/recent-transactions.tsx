"use client"

import { HomeIcon, UtensilsIcon, CarIcon, WifiIcon, ShoppingCartIcon, DollarSignIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Transaction {
  id: string
  description: string
  category_id: string
  date: string
  amount: number
  categories?: {
    name: string
    icon: string
    color: string
  }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  isLoading: boolean
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "home":
        return HomeIcon
      case "utensils":
        return UtensilsIcon
      case "car":
        return CarIcon
      case "wifi":
        return WifiIcon
      case "shopping-bag":
        return ShoppingCartIcon
      default:
        return DollarSignIcon
    }
  }

  const getCategoryColor = (colorName?: string) => {
    switch (colorName) {
      case "blue":
        return "bg-blue-100 text-blue-700"
      case "green":
        return "bg-green-100 text-green-700"
      case "orange":
        return "bg-orange-100 text-orange-700"
      case "indigo":
        return "bg-indigo-100 text-indigo-700"
      case "pink":
        return "bg-pink-100 text-pink-700"
      case "purple":
        return "bg-purple-100 text-purple-700"
      case "red":
        return "bg-red-100 text-red-700"
      case "yellow":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <DollarSignIcon className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No transactions yet</h3>
        <p className="text-sm text-muted-foreground">Add your first transaction to start tracking your finances</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.slice(0, 5).map((transaction) => {
        const Icon = getCategoryIcon(transaction.categories?.icon)
        const colorClass = getCategoryColor(transaction.categories?.color)

        return (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">{transaction.description}</div>
                <div className="text-xs text-muted-foreground">
                  {transaction.categories?.name || "Uncategorized"} • {formatDate(transaction.date)}
                </div>
              </div>
            </div>
            <div className={`font-medium ${Number(transaction.amount) < 0 ? "text-rose-500" : "text-emerald-500"}`}>
              {Number(transaction.amount) < 0 ? "-" : "+"}${Math.abs(Number(transaction.amount)).toFixed(2)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
