"use client"

import { useEffect, useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSignIcon,
  PieChartIcon,
  PlusIcon,
  FilterIcon,
  ArrowRightIcon,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeExpenseChart } from "@/components/income-expense-chart"
import { ExpenseBreakdown } from "@/components/expense-breakdown"
import { AccountSummary } from "@/components/account-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { BudgetOverview } from "@/components/budget-overview"
import { SavingsGoals } from "@/components/savings-goals"
import { DateRangePicker } from "@/components/date-range-picker"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"

export default function DashboardPage() {
  const { user } = useAuth()
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, selectedDateRange])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user?.id)

      if (accountsError) throw accountsError
      setAccounts(accountsData || [])

      // Calculate total balance
      const totalBalance = accountsData?.reduce((sum, account) => sum + Number(account.balance), 0) || 0

      // Fetch transactions for the selected date range
      const fromDate = selectedDateRange.from.toISOString().split("T")[0]
      const toDate = selectedDateRange.to.toISOString().split("T")[0]

      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .gte("date", fromDate)
        .lte("date", toDate)
        .order("date", { ascending: false })

      if (transactionsError) throw transactionsError
      setTransactions(transactionsData || [])

      // Calculate monthly income and expenses
      const income =
        transactionsData?.filter((t) => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0) || 0

      const expenses =
        transactionsData?.filter((t) => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) ||
        0

      // Calculate savings rate
      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

      setStats({
        totalBalance,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        savingsRate,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTransaction = () => {
    setIsAddTransactionOpen(true)
  }

  const handleTransactionAdded = () => {
    fetchData()
    setIsAddTransactionOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker date={selectedDateRange} onDateChange={setSelectedDateRange} />
          <Button onClick={handleAddTransaction}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <FilterIcon className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Your financial flow for the selected period</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <IncomeExpenseChart userId={user?.id} dateRange={selectedDateRange} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Where your money is going</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseBreakdown userId={user?.id} dateRange={selectedDateRange} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Your linked accounts and balances</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSummary accounts={accounts} isLoading={isLoading} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-1" asChild>
                  <a href="/accounts">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Manage Accounts</span>
                  </a>
                </Button>
              </CardFooter>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activity</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <a href="/transactions">
                    <span>View All</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={transactions} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Your spending against budget categories</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetOverview userId={user?.id} dateRange={selectedDateRange} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-1" asChild>
                  <a href="/budgets">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Manage Budgets</span>
                  </a>
                </Button>
              </CardFooter>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Savings Goals</CardTitle>
                <CardDescription>Track progress towards your financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                <SavingsGoals userId={user?.id} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-1" asChild>
                  <a href="/goals">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Manage Goals</span>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View and manage your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>For a detailed view of all your transactions, please visit the Transactions page.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/transactions">Go to Transactions</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Set and track your spending limits by category</CardDescription>
            </CardHeader>
            <CardContent>
              <p>For detailed budget management, please visit the Budgets page.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/budgets">Go to Budgets</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
              <CardDescription>Track progress towards your savings targets</CardDescription>
            </CardHeader>
            <CardContent>
              <p>For detailed goal management, please visit the Goals page.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/goals">Go to Goals</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onTransactionAdded={handleTransactionAdded}
        accounts={accounts}
      />
    </DashboardLayout>
  )
}
