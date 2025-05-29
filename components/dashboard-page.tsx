"use client"

import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  DollarSignIcon,
  FilterIcon,
  PieChartIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSummary } from "@/components/account-summary"
import { BudgetOverview } from "@/components/budget-overview"
import { ExpenseBreakdown } from "@/components/expense-breakdown"
import { IncomeExpenseChart } from "@/components/income-expense-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { SavingsGoals } from "@/components/savings-goals"
import { DateRangePicker } from "@/components/date-range-picker"
import { IncomeBreakdown } from "@/components/income-breakdown"
import { EnhancedExpenseBreakdown } from "@/components/enhanced-expense-breakdown"
import { useAuth } from "@/contexts/auth-context"

export function DashboardPage() {
  const { user } = useAuth()
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <WalletIcon className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">FinTrack</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form className="relative hidden md:block">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-64 rounded-lg bg-background pl-8 md:w-80"
            />
          </form>
          <DateRangePicker date={selectedDateRange} onDateChange={setSelectedDateRange} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,580.25</div>
              <p className="text-xs text-muted-foreground">+$1,245.65 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,395.00</div>
              <p className="text-xs text-muted-foreground">+$234.50 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,865.40</div>
              <p className="text-xs text-muted-foreground">-$125.30 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34.8%</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income Analysis</TabsTrigger>
              <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <FilterIcon className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-3.5 w-3.5" />
                <span>Add Transaction</span>
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
                  <IncomeExpenseChart />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Where your money is going</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseBreakdown />
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
                  <AccountSummary />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-1">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Add Account</span>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="lg:col-span-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activity</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <span>View All</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <RecentTransactions />
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
                  <BudgetOverview />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-1">
                    <SettingsIcon className="h-3.5 w-3.5" />
                    <span>Manage Budgets</span>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Savings Goals</CardTitle>
                  <CardDescription>Track progress towards your financial goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <SavingsGoals />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-1">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Add New Goal</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="income" className="space-y-4">
            <IncomeBreakdown userId={user?.id} dateRange={selectedDateRange} />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
            <EnhancedExpenseBreakdown userId={user?.id} dateRange={selectedDateRange} />
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>A complete history of your financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 pb-4">
                  <Input placeholder="Search transactions..." className="max-w-sm" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Category</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All Categories</DropdownMenuItem>
                      <DropdownMenuItem>Food & Dining</DropdownMenuItem>
                      <DropdownMenuItem>Shopping</DropdownMenuItem>
                      <DropdownMenuItem>Housing</DropdownMenuItem>
                      <DropdownMenuItem>Transportation</DropdownMenuItem>
                      <DropdownMenuItem>Entertainment</DropdownMenuItem>
                      <DropdownMenuItem>Health & Fitness</DropdownMenuItem>
                      <DropdownMenuItem>Travel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Account</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All Accounts</DropdownMenuItem>
                      <DropdownMenuItem>Checking Account</DropdownMenuItem>
                      <DropdownMenuItem>Savings Account</DropdownMenuItem>
                      <DropdownMenuItem>Credit Card</DropdownMenuItem>
                      <DropdownMenuItem>Investment Account</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </div>
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr_100px_100px_80px] gap-2 p-4 font-medium">
                    <div>Description</div>
                    <div>Category</div>
                    <div>Date</div>
                    <div className="text-right">Amount</div>
                  </div>
                  {transactions.map((transaction, index) => (
                    <div key={index} className="grid grid-cols-[1fr_100px_100px_80px] gap-2 border-t p-4">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-muted-foreground">{transaction.category}</div>
                      <div className="text-muted-foreground">{transaction.date}</div>
                      <div
                        className={`text-right font-medium ${transaction.amount < 0 ? "text-rose-500" : "text-emerald-500"}`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <div className="text-sm text-muted-foreground">Page 1 of 10</div>
                <Button>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Management</CardTitle>
                <CardDescription>Set and track your spending limits by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.map((budget, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full bg-${budget.color}-500`}></div>
                          <span className="font-medium">{budget.category}</span>
                        </div>
                        <div className="text-sm">
                          ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full bg-${budget.color}-500`}
                          style={{ width: `${Math.min(100, (budget.spent / budget.limit) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round((budget.spent / budget.limit) * 100)}% used</span>
                        <span>${(budget.limit - budget.spent).toFixed(2)} remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-1">
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Create New Budget</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Goals</CardTitle>
                <CardDescription>Track progress towards your savings targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{goal.name}</div>
                          <div className="text-xs text-muted-foreground">Target date: {goal.targetDate}</div>
                        </div>
                        <div className="text-sm font-medium">
                          ${goal.saved.toFixed(2)} / ${goal.target.toFixed(2)}
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, (goal.saved / goal.target) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round((goal.saved / goal.target) * 100)}% complete</span>
                        <span>${(goal.target - goal.saved).toFixed(2)} to go</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-1">
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Add New Goal</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Sample data
const transactions = [
  { description: "Salary Deposit", category: "Income", date: "May 15", amount: 3250.0 },
  { description: "Apartment Rent", category: "Housing", date: "May 02", amount: -1450.0 },
  { description: "Grocery Store", category: "Food", date: "May 05", amount: -120.35 },
  { description: "Electric Bill", category: "Utilities", date: "May 10", amount: -85.4 },
  { description: "Coffee Shop", category: "Food", date: "May 12", amount: -4.5 },
  { description: "Gas Station", category: "Transport", date: "May 14", amount: -45.2 },
  { description: "Online Shopping", category: "Shopping", date: "May 16", amount: -65.99 },
  { description: "Restaurant", category: "Food", date: "May 18", amount: -32.8 },
  { description: "Mobile Phone", category: "Utilities", date: "May 20", amount: -60.0 },
  { description: "Freelance Work", category: "Income", date: "May 22", amount: 450.0 },
]

const budgets = [
  { category: "Housing", spent: 1450, limit: 1500, color: "blue" },
  { category: "Food & Dining", spent: 420, limit: 500, color: "green" },
  { category: "Transportation", spent: 180, limit: 200, color: "yellow" },
  { category: "Entertainment", spent: 150, limit: 150, color: "red" },
  { category: "Shopping", spent: 210, limit: 300, color: "purple" },
  { category: "Utilities", spent: 145, limit: 200, color: "indigo" },
]

const goals = [
  { name: "Emergency Fund", saved: 8500, target: 10000, targetDate: "Dec 2023" },
  { name: "Vacation", saved: 1200, target: 3000, targetDate: "Jul 2024" },
  { name: "New Car", saved: 5000, target: 20000, targetDate: "Jan 2025" },
  { name: "Home Down Payment", saved: 15000, target: 60000, targetDate: "Jun 2026" },
]
