"use client"

import type React from "react"

import { useState } from "react"
import { UploadIcon, FileTextIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface ImportTransactionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: () => void
}

export function ImportTransactionsDialog({ open, onOpenChange, onImportComplete }: ImportTransactionsDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    success: number
    errors: number
    total: number
  } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setImportResults(null)
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a CSV file.",
      })
    }
  }

  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const transactions = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",")
      const transaction: any = {}

      headers.forEach((header, index) => {
        transaction[header] = values[index]?.trim() || ""
      })

      // Basic validation
      if (transaction.description && transaction.amount && transaction.date) {
        transactions.push({
          description: transaction.description,
          amount: Number.parseFloat(transaction.amount),
          date: transaction.date,
          category: transaction.category || "Uncategorized",
        })
      }
    }

    return transactions
  }

  const handleImport = async () => {
    if (!file || !user) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const csvText = await file.text()
      const transactions = parseCSV(csvText)

      if (transactions.length === 0) {
        toast({
          variant: "destructive",
          title: "No valid transactions found",
          description: "Please check your CSV format and try again.",
        })
        return
      }

      let successCount = 0
      let errorCount = 0

      // Process transactions in batches
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]

        try {
          // For demo purposes, we'll just simulate the import
          // In a real app, you'd insert into the database here
          await new Promise((resolve) => setTimeout(resolve, 100))
          successCount++
        } catch (error) {
          errorCount++
        }

        setUploadProgress(Math.round(((i + 1) / transactions.length) * 100))
      }

      setImportResults({
        success: successCount,
        errors: errorCount,
        total: transactions.length,
      })

      if (successCount > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${successCount} transactions.`,
        })
        onImportComplete()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: "There was an error processing your file.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setImportResults(null)
    setUploadProgress(0)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import your transactions. The file should include columns for description, amount,
            date, and optionally category.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!importResults && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="csv-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">CSV files only</p>
                    </div>
                    <Input id="csv-file" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              {file && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing transactions...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          )}

          {importResults && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="font-medium">Import Complete</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                  <div className="text-sm text-green-700">Successful</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                  <div className="text-sm text-red-700">Errors</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                  <div className="text-sm text-blue-700">Total</div>
                </div>
              </div>

              {importResults.errors > 0 && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Some transactions couldn't be imported</p>
                    <p className="text-yellow-700">
                      This usually happens when required fields are missing or data is in an unexpected format.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">CSV Format Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Headers: description, amount, date, category (optional)</li>
              <li>Date format: YYYY-MM-DD or MM/DD/YYYY</li>
              <li>Amount: Positive for income, negative for expenses</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {importResults ? "Close" : "Cancel"}
          </Button>
          {!importResults && (
            <Button onClick={handleImport} disabled={!file || isUploading}>
              {isUploading ? "Importing..." : "Import Transactions"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
