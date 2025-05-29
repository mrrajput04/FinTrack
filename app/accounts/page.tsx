"use client"

import { useState, useEffect } from "react"
import { BuildingIcon, CreditCardIcon, PlusIcon, TrendingUpIcon, WalletIcon, PencilIcon, TrashIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface Account {
  id: string
  name: string
  type: string
  institution: string
  balance: number
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.string({
    required_error: "Please select an account type.",
  }),
  institution: z.string().optional(),
  balance: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Balance must be a number.",
  }),
})

export default function AccountsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      institution: "",
      balance: "0",
    },
  })

  useEffect(() => {
    if (user) {
      fetchAccounts()
    }
  }, [user])

  useEffect(() => {
    if (selectedAccount && isEditDialogOpen) {
      form.reset({
        name: selectedAccount.name,
        type: selectedAccount.type,
        institution: selectedAccount.institution || "",
        balance: selectedAccount.balance.toString(),
      })
    }
  }, [selectedAccount, isEditDialogOpen, form])

  const fetchAccounts = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("accounts").select("*").eq("user_id", user?.id).order("name")

      if (error) throw error

      setAccounts(data || [])
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load accounts. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAccount = () => {
    form.reset({
      name: "",
      institution: "",
      balance: "0",
    })
    setIsAddDialogOpen(true)
  }

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsEditDialogOpen(true)
  }

  const handleDeleteAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsDeleteDialogOpen(true)
  }

  const onSubmitAdd = async (values: z.infer<typeof formSchema>) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("accounts").insert([
        {
          user_id: user.id,
          name: values.name,
          type: values.type,
          institution: values.institution || null,
          balance: Number(values.balance),
        },
      ])

      if (error) throw error

      toast({
        title: "Account added",
        description: "Your account has been added successfully.",
      })

      fetchAccounts()
      setIsAddDialogOpen(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add account. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitEdit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !selectedAccount) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("accounts")
        .update({
          name: values.name,
          type: values.type,
          institution: values.institution || null,
          balance: Number(values.balance),
        })
        .eq("id", selectedAccount.id)

      if (error) throw error

      toast({
        title: "Account updated",
        description: "Your account has been updated successfully.",
      })

      fetchAccounts()
      setIsEditDialogOpen(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update account. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedAccount) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("accounts").delete().eq("id", selectedAccount.id)

      if (error) throw error

      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      })

      fetchAccounts()
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
      case "savings":
        return BuildingIcon
      case "credit":
        return CreditCardIcon
      case "investment":
        return TrendingUpIcon
      default:
        return WalletIcon
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-700"
      case "savings":
        return "bg-green-100 text-green-700"
      case "credit":
        return "bg-purple-100 text-purple-700"
      case "investment":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <Button onClick={handleAddAccount}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.type)
          const colorClass = getAccountColor(account.type)

          return (
            <Card key={account.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full p-2 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {account.institution || "No institution"} •{" "}
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${account.balance < 0 ? "text-rose-500" : ""}`}>
                  {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {accounts.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <WalletIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No accounts yet</h2>
            <p className="mb-4 text-muted-foreground">Add your first account to start tracking your finances</p>
            <Button onClick={handleAddAccount}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </div>
        </Card>
      )}

      {/* Add Account Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>Add a new account to track your finances.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chase Checking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chase Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Balance</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Account"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update your account details.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chase Checking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chase Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Balance</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
