"use client"

import { useEffect, useState } from "react"
import { TargetIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

interface SavingsGoalsProps {
  userId: string | undefined
}

interface SavingsGoal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string
  percentage: number
}

export function SavingsGoals({ userId }: SavingsGoalsProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("savings_goals")
          .select("*")
          .eq("user_id", userId)
          .eq("is_completed", false)
          .order("target_date", { ascending: true })

        if (error) throw error

        const goalsWithPercentage =
          data?.map((goal) => {
            const percentage =
              goal.target_amount > 0 ? Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100) : 0

            return {
              ...goal,
              percentage,
            }
          }) || []

        setGoals(goalsWithPercentage)
      } catch (error) {
        console.error("Error fetching savings goals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
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

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <TargetIcon className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No savings goals yet</h3>
        <p className="text-sm text-muted-foreground">Create your first goal to start tracking your progress</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {goals.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{goal.name}</div>
              <div className="text-xs text-muted-foreground">Target date: {formatDate(goal.target_date)}</div>
            </div>
            <div className="text-sm font-medium">
              ${Number(goal.current_amount).toFixed(2)} / ${Number(goal.target_amount).toFixed(2)}
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${Math.min(100, goal.percentage)}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{goal.percentage}% complete</span>
            <span>${(Number(goal.target_amount) - Number(goal.current_amount)).toFixed(2)} to go</span>
          </div>
        </div>
      ))}
    </div>
  )
}
