"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

Chart.register(...registerables)

interface IncomeExpenseChartProps {
  userId: string | undefined
  dateRange: { from: Date; to: Date }
}

export function IncomeExpenseChart({ userId, dateRange }: IncomeExpenseChartProps) {
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

        // Get transactions for the date range
        const { data: transactions, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .gte("date", fromDate)
          .lte("date", toDate)
          .order("date", { ascending: true })

        if (error) throw error

        // Process data for chart
        const dates = getDateRange(dateRange.from, dateRange.to)
        const incomeData = Array(dates.length).fill(0)
        const expenseData = Array(dates.length).fill(0)
        const savingsData = Array(dates.length).fill(0)

        transactions?.forEach((transaction) => {
          const date = new Date(transaction.date)
          const index = dates.findIndex(
            (d) =>
              d.getFullYear() === date.getFullYear() &&
              d.getMonth() === date.getMonth() &&
              d.getDate() === date.getDate(),
          )

          if (index !== -1) {
            const amount = Number(transaction.amount)
            if (amount > 0) {
              incomeData[index] += amount
            } else {
              expenseData[index] += Math.abs(amount)
            }
          }
        })

        // Calculate savings (income - expenses)
        for (let i = 0; i < dates.length; i++) {
          savingsData[i] = incomeData[i] - expenseData[i]
        }

        // Create chart
        createChart(
          dates.map((d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })),
          incomeData,
          expenseData,
          savingsData,
        )
      } catch (error) {
        console.error("Error fetching chart data:", error)
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

  const getDateRange = (start: Date, end: Date) => {
    const dates = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  const createChart = (labels: string[], incomeData: number[], expenseData: number[], savingsData: number[]) => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            backgroundColor: "rgba(34, 197, 94, 0.7)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Expenses",
            data: expenseData,
            backgroundColor: "rgba(239, 68, 68, 0.7)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Savings",
            data: savingsData,
            type: "line",
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${value}`,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: $${context.raw as number}`,
            },
          },
        },
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
