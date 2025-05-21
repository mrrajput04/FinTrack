"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChartIcon } from "@radix-ui/react-icons"

interface BudgetOverviewProps {
  userId: string | undefined
  dateRange: { from: Date; to: Date }
}

interface Budget {
  id: string
  category_id: string
  amount: number
  categories: {
    name: string
    color: string
  }
  spent: number
  percentage: number
}

export function BudgetOverview({ userId, dateRange }: BudgetOverviewProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fromDate = dateRange.from.toISOString().split("T")[0]
        const toDate = dateRange.to.toISOString().split("T")[0]

        // Get budgets
        const { data: budgetsData, error: budgetsError } = await supabase
          .from("budgets")
          .select(`
            id,
            category_id,
            amount,
            categories (
              name,
              color
            )
          `)
          .eq("user_id", userId)

        if (budgetsError) throw budgetsError

        // Get transactions for each budget to calculate spending
        const budgetsWithSpending = await Promise.all(
          budgetsData?.map(async (budget) => {
            const { data: transactions, error: transactionsError } = await supabase
              .from("transactions")
              .select("amount")
              .eq("user_id", userId)
              .eq("category_id", budget.category_id)
              .lt("amount", 0) // Only expenses (negative amounts)
              .gte("date", fromDate)
              .lte("date", toDate)

            if (transactionsError) throw transactionsError

            const spent = transactions?.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0
            const percentage = budget.amount > 0 ? Math.round((spent / Number(budget.amount)) * 100) : 0

            return {
              ...budget,
              spent,
              percentage,
            }
          }) || [],
        )

        setBudgets(budgetsWithSpending)
      } catch (error) {
        console.error("Error fetching budget data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId, dateRange])

  const getBudgetColorClass = (colorName?: string) => {
    switch (colorName) {
      case "blue":
        return "bg-blue-500"
      case "green":
        return "bg-green-500"
      case "orange":
        return "bg-orange-500"
      case "indigo":
        return "bg-indigo-500"
      case "pink":
        return "bg-pink-500"
      case "purple":
        return "bg-purple-500"
      case "red":
        return "bg-red-500"
      case "yellow":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <PieChartIcon className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No budgets yet</h3>
        <p className="text-sm text-muted-foreground">Create your first budget to start tracking your spending</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => (
        <div key={budget.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{budget.categories?.name || "Unnamed Budget"}</div>
            <div className="text-sm">
              ${budget.spent.toFixed(2)} / ${Number(budget.amount).toFixed(2)}
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={getBudgetColorClass(budget.categories?.color)}
              style={{ width: `${Math.min(100, budget.percentage)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{budget.percentage}% used</span>
            <span>${(Number(budget.amount) - budget.spent).toFixed(2)} remaining</span>
          </div>
        </div>
      ))}
    </div>
  )
}
