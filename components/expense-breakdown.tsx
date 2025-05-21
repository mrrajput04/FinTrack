"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

Chart.register(...registerables)

interface ExpenseBreakdownProps {
  userId: string | undefined
  dateRange: { from: Date; to: Date }
}

export function ExpenseBreakdown({ userId, dateRange }: ExpenseBreakdownProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fromDate = dateRange.from.toISOString().split("T")[0]
        const toDate = dateRange.to.toISOString().split("T")[0]

        // Get transactions and categories
        const { data: transactions, error: transactionsError } = await supabase
          .from("transactions")
          .select(`
            amount,
            categories (
              id,
              name,
              color
            )
          `)
          .eq("user_id", userId)
          .lt("amount", 0) // Only expenses (negative amounts)
          .gte("date", fromDate)
          .lte("date", toDate)

        if (transactionsError) throw transactionsError

        // Group expenses by category
        const categoryTotals: Record<string, { total: number; name: string; color: string }> = {}

        transactions?.forEach((transaction) => {
          if (transaction.categories) {
            const categoryId = transaction.categories.id
            const categoryName = transaction.categories.name
            const categoryColor = transaction.categories.color
            const amount = Math.abs(Number(transaction.amount))

            if (!categoryTotals[categoryId]) {
              categoryTotals[categoryId] = { total: 0, name: categoryName, color: categoryColor }
            }

            categoryTotals[categoryId].total += amount
          }
        })

        // Prepare data for chart
        const labels = Object.values(categoryTotals).map((cat) => cat.name)
        const data = Object.values(categoryTotals).map((cat) => cat.total)
        const backgroundColors = Object.values(categoryTotals).map((cat) => {
          // Convert color name to rgba
          const colorMap: Record<string, string> = {
            blue: "rgba(59, 130, 246, 0.7)",
            green: "rgba(16, 185, 129, 0.7)",
            orange: "rgba(245, 158, 11, 0.7)",
            indigo: "rgba(99, 102, 241, 0.7)",
            pink: "rgba(236, 72, 153, 0.7)",
            purple: "rgba(139, 92, 246, 0.7)",
            red: "rgba(239, 68, 68, 0.7)",
            yellow: "rgba(245, 158, 11, 0.7)",
            gray: "rgba(107, 114, 128, 0.7)",
          }
          return colorMap[cat.color] || "rgba(107, 114, 128, 0.7)"
        })

        const borderColors = backgroundColors.map((color) => color.replace("0.7", "1"))

        createChart(labels, data, backgroundColors, borderColors)
      } catch (error) {
        console.error("Error fetching expense breakdown data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [userId, dateRange])

  const createChart = (labels: string[], data: number[], backgroundColors: string[], borderColors: string[]) => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // If no data, show empty chart with message
    if (data.length === 0) {
      labels = ["No expense data"]
      data = [1]
      backgroundColors = ["rgba(229, 231, 235, 0.7)"]
      borderColors = ["rgba(229, 231, 235, 1)"]
    }

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 15,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (labels[0] === "No expense data") {
                  return "No expense data available"
                }

                const label = context.label || ""
                const value = context.raw as number
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${label}: ${percentage}% ($${value.toFixed(2)})`
              },
            },
          },
        },
        cutout: "65%",
      },
    })
  }

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}
