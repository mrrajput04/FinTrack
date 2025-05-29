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
import { motion, AnimatePresence } from "framer-motion"
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
import { FloatingLoader } from "@/components/ui/loading-animations"
import { SparkleEffect } from "@/components/ui/particle-effects"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

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
      // Simulate loading delay for demo
      await new Promise((resolve) => setTimeout(resolve, 1000))

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <FloatingLoader />
          <motion.p
            className="text-lg font-medium text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Loading your financial data...
          </motion.p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <SparkleEffect count={15} className="opacity-30" />

        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
            <motion.h1
              className="text-2xl font-bold"
              whileHover={{
                scale: 1.05,
                color: "transparent",
                backgroundImage: "linear-gradient(45deg, #8B5CF6, #EC4899)",
                backgroundClip: "text",
              }}
              transition={{ duration: 0.3 }}
            >
              Dashboard
            </motion.h1>
            <div className="flex items-center gap-2">
              <DateRangePicker date={selectedDateRange} onDateChange={setSelectedDateRange} />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleAddTransaction}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6" variants={containerVariants}>
            {[
              {
                title: "Total Balance",
                value: `$${stats.totalBalance.toFixed(2)}`,
                description: "Across all accounts",
                icon: DollarSignIcon,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Income",
                value: `$${stats.monthlyIncome.toFixed(2)}`,
                description: "For selected period",
                icon: ArrowDownIcon,
                gradient: "from-green-500 to-emerald-500",
              },
              {
                title: "Expenses",
                value: `$${stats.monthlyExpenses.toFixed(2)}`,
                description: "For selected period",
                icon: ArrowUpIcon,
                gradient: "from-red-500 to-rose-500",
              },
              {
                title: "Savings Rate",
                value: `${stats.savingsRate.toFixed(1)}%`,
                description: "For selected period",
                icon: PieChartIcon,
                gradient: "from-purple-500 to-violet-500",
              },
            ].map((stat, index) => (
              <motion.div key={stat.title} variants={cardVariants}>
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="relative overflow-hidden group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.5,
                        }}
                      >
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-4">
            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="budgets">Budgets</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <FilterIcon className="h-3.5 w-3.5" />
                    <span>Filter</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
                >
                  <motion.div whileHover={{ scale: 1.01 }} className="lg:col-span-4">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Income vs Expenses</CardTitle>
                        <CardDescription>Your financial flow for the selected period</CardDescription>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <IncomeExpenseChart userId={user?.id} dateRange={selectedDateRange} />
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} className="lg:col-span-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>Where your money is going</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ExpenseBreakdown userId={user?.id} dateRange={selectedDateRange} />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
                >
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Account Summary</CardTitle>
                      <CardDescription>Your linked accounts and balances</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AccountSummary accounts={accounts} isLoading={false} />
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
                      <RecentTransactions transactions={transactions} isLoading={false} />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
                >
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
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        <AddTransactionDialog
          open={isAddTransactionOpen}
          onOpenChange={setIsAddTransactionOpen}
          onTransactionAdded={handleTransactionAdded}
          accounts={accounts}
        />
      </div>
    </DashboardLayout>
  )
}
