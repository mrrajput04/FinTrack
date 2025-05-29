"use client"

import { useEffect, useState, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDownIcon, AlertTriangleIcon, CreditCardIcon, CalendarIcon } from "lucide-react"

Chart.register(...registerables)

interface EnhancedExpenseBreakdownProps {
  userId: string | undefined
  dateRange: { from: Date; to: Date }
}

interface ExpenseData {
  categories: { name: string; amount: number; color: string; percentage: number; budget?: number }[]
  monthlyTrends: { month: string; amount: number }[]
  weeklyTrends: { week: string; amount: number }[]
  topSpending: { category: string; amount: number; transactions: number; avgTransaction: number }[]
  totalExpenses: number
  averageDaily: number
  highestCategory: string
  budgetAlerts: { category: string; spent: number; budget: number; percentage: number }[]
}

export function EnhancedExpenseBreakdown({ userId, dateRange }: EnhancedExpenseBreakdownProps) {
  const [data, setData] = useState<ExpenseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewType, setViewType] = useState<"monthly" | "weekly">("monthly")
  const categoryChartRef = useRef<HTMLCanvasElement>(null)
  const trendsChartRef = useRef<HTMLCanvasElement>(null)
  const comparisonChartRef = useRef<HTMLCanvasElement>(null)
  const categoryChartInstance = useRef<Chart | null>(null)
  const trendsChartInstance = useRef<Chart | null>(null)
  const comparisonChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchExpenseData = async () => {
      setIsLoading(true)
      try {
        const fromDate = dateRange.from.toISOString().split("T")[0]
        const toDate = dateRange.to.toISOString().split("T")[0]

        // Get expense transactions
        const { data: transactions, error: transactionsError } = await supabase
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
          .lt("amount", 0) // Only expenses (negative amounts)
          .gte("date", fromDate)
          .lte("date", toDate)
          .order("date", { ascending: true })

        if (transactionsError) throw transactionsError

        // Get budgets for comparison
        const { data: budgets, error: budgetsError } = await supabase
          .from("budgets")
          .select(`
            category_id,
            amount,
            categories (
              name
            )
          `)
          .eq("user_id", userId)

        if (budgetsError) throw budgetsError

        // Process data
        const processedData = processExpenseData(transactions || [], budgets || [])
        setData(processedData)

        // Create charts
        setTimeout(() => {
          createCategoryChart(processedData.categories)
          createTrendsChart(viewType === "monthly" ? processedData.monthlyTrends : processedData.weeklyTrends)
          createComparisonChart(processedData.categories)
        }, 100)
      } catch (error) {
        console.error("Error fetching expense data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenseData()

    return () => {
      if (categoryChartInstance.current) categoryChartInstance.current.destroy()
      if (trendsChartInstance.current) trendsChartInstance.current.destroy()
      if (comparisonChartInstance.current) comparisonChartInstance.current.destroy()
    }
  }, [userId, dateRange])

  useEffect(() => {
    if (data) {
      createTrendsChart(viewType === "monthly" ? data.monthlyTrends : data.weeklyTrends)
    }
  }, [viewType, data])

  const processExpenseData = (transactions: any[], budgets: any[]): ExpenseData => {
    const categoryTotals: Record<
      string,
      {
        amount: number
        color: string
        transactions: number
        budget?: number
      }
    > = {}
    const monthlyTotals: Record<string, number> = {}
    const weeklyTotals: Record<string, number> = {}

    let totalExpenses = 0

    // Create budget lookup
    const budgetLookup: Record<string, number> = {}
    budgets.forEach((budget) => {
      if (budget.categories) {
        budgetLookup[budget.categories.name] = Number(budget.amount)
      }
    })

    transactions.forEach((transaction) => {
      const amount = Math.abs(Number(transaction.amount))
      totalExpenses += amount

      // Category breakdown
      if (transaction.categories) {
        const categoryName = transaction.categories.name
        const categoryColor = transaction.categories.color

        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = {
            amount: 0,
            color: categoryColor,
            transactions: 0,
            budget: budgetLookup[categoryName],
          }
        }
        categoryTotals[categoryName].amount += amount
        categoryTotals[categoryName].transactions += 1
      }

      // Monthly trends
      const month = new Date(transaction.date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      monthlyTotals[month] = (monthlyTotals[month] || 0) + amount

      // Weekly trends
      const date = new Date(transaction.date)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const week = weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      weeklyTotals[week] = (weeklyTotals[week] || 0) + amount
    })

    // Convert to arrays and calculate percentages
    const categories = Object.entries(categoryTotals)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        color: data.color,
        percentage: Math.round((data.amount / totalExpenses) * 100),
        budget: data.budget,
      }))
      .sort((a, b) => b.amount - a.amount)

    const monthlyTrends = Object.entries(monthlyTotals)
      .map(([month, amount]) => ({
        month,
        amount,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    const weeklyTrends = Object.entries(weeklyTotals)
      .map(([week, amount]) => ({
        week,
        amount,
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())

    const topSpending = Object.entries(categoryTotals)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        transactions: data.transactions,
        avgTransaction: data.amount / data.transactions,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Calculate budget alerts
    const budgetAlerts = categories
      .filter((cat) => cat.budget && cat.amount > cat.budget * 0.8)
      .map((cat) => ({
        category: cat.name,
        spent: cat.amount,
        budget: cat.budget!,
        percentage: Math.round((cat.amount / cat.budget!) * 100),
      }))

    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    const averageDaily = totalExpenses / days

    return {
      categories,
      monthlyTrends,
      weeklyTrends,
      topSpending,
      totalExpenses,
      averageDaily,
      highestCategory: categories[0]?.name || "N/A",
      budgetAlerts,
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

    const label = viewType === "monthly" ? "month" : "week"
    const dataKey = viewType === "monthly" ? "month" : "week"

    trendsChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: trends.map((t) => t[dataKey]),
        datasets: [
          {
            label: `${viewType === "monthly" ? "Monthly" : "Weekly"} Expenses`,
            data: trends.map((t) => t.amount),
            backgroundColor: "rgba(239, 68, 68, 0.7)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1,
            borderRadius: 4,
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
              label: (context) => `Expenses: $${(context.raw as number).toFixed(2)}`,
            },
          },
        },
      },
    })
  }

  const createComparisonChart = (categories: any[]) => {
    if (!comparisonChartRef.current) return

    if (comparisonChartInstance.current) {
      comparisonChartInstance.current.destroy()
    }

    const ctx = comparisonChartRef.current.getContext("2d")
    if (!ctx) return

    const categoriesWithBudget = categories.filter((cat) => cat.budget)

    if (categoriesWithBudget.length === 0) return

    comparisonChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categoriesWithBudget.map((cat) => cat.name),
        datasets: [
          {
            label: "Spent",
            data: categoriesWithBudget.map((cat) => cat.amount),
            backgroundColor: "rgba(239, 68, 68, 0.7)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1,
          },
          {
            label: "Budget",
            data: categoriesWithBudget.map((cat) => cat.budget),
            backgroundColor: "rgba(34, 197, 94, 0.7)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1,
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
              label: (context) => `${context.dataset.label}: $${(context.raw as number).toFixed(2)}`,
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
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    )
  }

  if (!data) {
    return <div>No expense data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${data.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.averageDaily.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per day spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.highestCategory}</div>
            <p className="text-xs text-muted-foreground">Highest spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Alerts</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.budgetAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Over 80% budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {data.budgetAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Budget Alerts</CardTitle>
            <CardDescription className="text-orange-700">
              Categories approaching or exceeding budget limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.budgetAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <span className="font-medium">{alert.category}</span>
                    <div className="text-sm text-muted-foreground">
                      ${alert.spent.toFixed(2)} of ${alert.budget.toFixed(2)} budget
                    </div>
                  </div>
                  <Badge variant={alert.percentage > 100 ? "destructive" : "secondary"}>{alert.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="top-spending">Top Spending</TabsTrigger>
          <TabsTrigger value="budget-comparison">Budget vs Actual</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Distribution of your spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <canvas ref={categoryChartRef} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>Breakdown with budget comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.categories.slice(0, 6).map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
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
                        <div className="text-right">
                          <div className="font-bold">${category.amount.toFixed(2)}</div>
                          {category.budget && (
                            <div className="text-xs text-muted-foreground">Budget: ${category.budget.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                      {category.budget && (
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full ${category.amount > category.budget ? "bg-red-500" : "bg-blue-500"}`}
                            style={{
                              width: `${Math.min(100, (category.amount / category.budget) * 100)}%`,
                            }}
                          />
                        </div>
                      )}
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Expense Trends</CardTitle>
                  <CardDescription>Track your spending patterns over time</CardDescription>
                </div>
                <Select value={viewType} onValueChange={(value: "monthly" | "weekly") => setViewType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <canvas ref={trendsChartRef} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
              <CardDescription>Your highest expense categories with transaction details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topSpending.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{item.category}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.transactions} transactions • Avg: ${item.avgTransaction.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">${item.amount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((item.amount / data.totalExpenses) * 100)}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget-comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Spending</CardTitle>
              <CardDescription>Compare your actual spending against budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <canvas ref={comparisonChartRef} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
