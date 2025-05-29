"use client"

import { useEffect, useState, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUpIcon, RepeatIcon, CalendarIcon, DollarSignIcon } from "lucide-react"

Chart.register(...registerables)

interface IncomeBreakdownProps {
  userId: string | undefined
  dateRange: { from: Date; to: Date }
}

interface IncomeData {
  categories: { name: string; amount: number; color: string; percentage: number }[]
  monthlyTrends: { month: string; amount: number }[]
  recurringVsOneTime: { recurring: number; oneTime: number }
  topSources: { source: string; amount: number; type: string }[]
  totalIncome: number
  growth: number
}

export function IncomeBreakdown({ userId, dateRange }: IncomeBreakdownProps) {
  const [data, setData] = useState<IncomeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const categoryChartRef = useRef<HTMLCanvasElement>(null)
  const trendsChartRef = useRef<HTMLCanvasElement>(null)
  const categoryChartInstance = useRef<Chart | null>(null)
  const trendsChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchIncomeData = async () => {
      setIsLoading(true)
      try {
        const fromDate = dateRange.from.toISOString().split("T")[0]
        const toDate = dateRange.to.toISOString().split("T")[0]

        // Get income transactions
        const { data: transactions, error } = await supabase
          .from("transactions")
          .select(`
            amount,
            date,
            description,
            categories (
              id,
              name,
              color,
              type
            )
          `)
          .eq("user_id", userId)
          .gt("amount", 0) // Only income (positive amounts)
          .gte("date", fromDate)
          .lte("date", toDate)
          .order("date", { ascending: true })

        if (error) throw error

        // Process data
        const processedData = processIncomeData(transactions || [])
        setData(processedData)

        // Create charts
        setTimeout(() => {
          createCategoryChart(processedData.categories)
          createTrendsChart(processedData.monthlyTrends)
        }, 100)
      } catch (error) {
        console.error("Error fetching income data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncomeData()

    return () => {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy()
      }
      if (trendsChartInstance.current) {
        trendsChartInstance.current.destroy()
      }
    }
  }, [userId, dateRange])

  const processIncomeData = (transactions: any[]): IncomeData => {
    const categoryTotals: Record<string, { amount: number; color: string }> = {}
    const monthlyTotals: Record<string, number> = {}
    const sources: Record<string, { amount: number; type: string }> = {}

    let totalIncome = 0
    let recurringIncome = 0
    let oneTimeIncome = 0

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount)
      totalIncome += amount

      // Category breakdown
      if (transaction.categories) {
        const categoryName = transaction.categories.name
        const categoryColor = transaction.categories.color

        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = { amount: 0, color: categoryColor }
        }
        categoryTotals[categoryName].amount += amount
      }

      // Monthly trends
      const month = new Date(transaction.date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      monthlyTotals[month] = (monthlyTotals[month] || 0) + amount

      // Top sources
      const source = transaction.description
      if (!sources[source]) {
        sources[source] = { amount: 0, type: "income" }
      }
      sources[source].amount += amount

      // Recurring vs One-time (simplified logic)
      const isRecurring = /salary|wage|payroll|monthly|weekly/i.test(transaction.description)
      if (isRecurring) {
        recurringIncome += amount
      } else {
        oneTimeIncome += amount
      }
    })

    // Convert to arrays and calculate percentages
    const categories = Object.entries(categoryTotals)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        color: data.color,
        percentage: Math.round((data.amount / totalIncome) * 100),
      }))
      .sort((a, b) => b.amount - a.amount)

    const monthlyTrends = Object.entries(monthlyTotals)
      .map(([month, amount]) => ({
        month,
        amount,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    const topSources = Object.entries(sources)
      .map(([source, data]) => ({
        source,
        amount: data.amount,
        type: data.type,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Calculate growth (simplified)
    const growth =
      monthlyTrends.length > 1
        ? ((monthlyTrends[monthlyTrends.length - 1].amount - monthlyTrends[0].amount) / monthlyTrends[0].amount) * 100
        : 0

    return {
      categories,
      monthlyTrends,
      recurringVsOneTime: { recurring: recurringIncome, oneTime: oneTimeIncome },
      topSources,
      totalIncome,
      growth,
    }
  }

  const createCategoryChart = (categories: any[]) => {
    if (!categoryChartRef.current || categories.length === 0) return

    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy()
    }

    const ctx = categoryChartRef.current.getContext("2d")
    if (!ctx) return

    const colors = categories.map((cat) => {
      const colorMap: Record<string, string> = {
        blue: "rgba(59, 130, 246, 0.8)",
        green: "rgba(16, 185, 129, 0.8)",
        orange: "rgba(245, 158, 11, 0.8)",
        purple: "rgba(139, 92, 246, 0.8)",
        pink: "rgba(236, 72, 153, 0.8)",
        indigo: "rgba(99, 102, 241, 0.8)",
        red: "rgba(239, 68, 68, 0.8)",
        yellow: "rgba(245, 158, 11, 0.8)",
      }
      return colorMap[cat.color] || "rgba(107, 114, 128, 0.8)"
    })

    categoryChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categories.map((cat) => cat.name),
        datasets: [
          {
            data: categories.map((cat) => cat.amount),
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.8", "1")),
            borderWidth: 2,
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
                const label = context.label || ""
                const value = context.raw as number
                const percentage = categories[context.dataIndex].percentage
                return `${label}: ${percentage}% ($${value.toFixed(2)})`
              },
            },
          },
        },
        cutout: "60%",
      },
    })
  }

  const createTrendsChart = (trends: any[]) => {
    if (!trendsChartRef.current || trends.length === 0) return

    if (trendsChartInstance.current) {
      trendsChartInstance.current.destroy()
    }

    const ctx = trendsChartRef.current.getContext("2d")
    if (!ctx) return

    trendsChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: trends.map((t) => t.month),
        datasets: [
          {
            label: "Monthly Income",
            data: trends.map((t) => t.amount),
            borderColor: "rgba(34, 197, 94, 1)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgba(34, 197, 94, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 6,
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
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `Income: $${(context.raw as number).toFixed(2)}`,
            },
          },
        },
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
        <Skeleton className="h-[200px]" />
      </div>
    )
  }

  if (!data) {
    return <div>No income data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {data.growth > 0 ? "+" : ""}
              {data.growth.toFixed(1)}% from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Income</CardTitle>
            <RepeatIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.recurringVsOneTime.recurring.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((data.recurringVsOneTime.recurring / data.totalIncome) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">One-time Income</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.recurringVsOneTime.oneTime.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((data.recurringVsOneTime.oneTime / data.totalIncome) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income Sources</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="sources">Top Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income by Category</CardTitle>
                <CardDescription>Distribution of your income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <canvas ref={categoryChartRef} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Detailed view of income categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              {
                                blue: "#3b82f6",
                                green: "#10b981",
                                orange: "#f59e0b",
                                purple: "#8b5cf6",
                                pink: "#ec4899",
                                indigo: "#6366f1",
                                red: "#ef4444",
                                yellow: "#f59e0b",
                              }[category.color] || "#6b7280",
                          }}
                        />
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary">{category.percentage}%</Badge>
                      </div>
                      <span className="font-bold">${category.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income Trends</CardTitle>
              <CardDescription>Track your income growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <canvas ref={trendsChartRef} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Income Sources</CardTitle>
              <CardDescription>Your highest earning income sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{source.source}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((source.amount / data.totalIncome) * 100)}% of total income
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${source.amount.toFixed(2)}</div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
