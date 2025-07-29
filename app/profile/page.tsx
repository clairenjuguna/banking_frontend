"use client"

import { useAuth } from "../../components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ArrowLeft, Download, ArrowUpRight, ArrowDownLeft, Banknote } from "lucide-react"
import { TransferModal } from "../../components/transfer-modal"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  from?: string
  to?: string
  status: "completed" | "pending" | "failed"
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "credit",
    amount: 5000,
    description: "Salary deposit",
    date: "2024-01-15",
    from: "Employer",
    status: "completed",
  },
  {
    id: "2",
    type: "debit",
    amount: 1200,
    description: "Grocery shopping",
    date: "2024-01-14",
    to: "SuperMart",
    status: "completed",
  },
  {
    id: "3",
    type: "credit",
    amount: 2000,
    description: "Transfer from John",
    date: "2024-01-13",
    from: "John Doe",
    status: "completed",
  },
  {
    id: "4",
    type: "debit",
    amount: 800,
    description: "Utility bills",
    date: "2024-01-12",
    to: "KPLC",
    status: "completed",
  },
  {
    id: "5",
    type: "debit",
    amount: 300,
    description: "Coffee shop",
    date: "2024-01-11",
    to: "Java House",
    status: "completed",
  },
  {
    id: "6",
    type: "credit",
    amount: 1500,
    description: "Freelance payment",
    date: "2024-01-10",
    from: "Client ABC",
    status: "completed",
  },
  {
    id: "7",
    type: "debit",
    amount: 2500,
    description: "Rent payment",
    date: "2024-01-09",
    to: "Landlord",
    status: "completed",
  },
  {
    id: "8",
    type: "credit",
    amount: 500,
    description: "Cashback reward",
    date: "2024-01-08",
    from: "Bank Reward",
    status: "completed",
  },
  {
    id: "9",
    type: "debit",
    amount: 150,
    description: "ATM withdrawal",
    date: "2024-01-07",
    to: "ATM",
    status: "completed",
  },
  {
    id: "10",
    type: "credit",
    amount: 3000,
    description: "Investment return",
    date: "2024-01-06",
    from: "Investment Co",
    status: "pending",
  },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all")
  const [dateRange, setDateRange] = useState<"all" | "week" | "month">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.isAdmin) {
      router.push("/admin")
    }
  }, [user, router])

  if (!user || user.isAdmin) {
    return null
  }

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.from && transaction.from.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.to && transaction.to.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === "all" || transaction.type === filterType

    let matchesDate = true
    if (dateRange !== "all") {
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (dateRange === "week" && daysDiff > 7) matchesDate = false
      if (dateRange === "month" && daysDiff > 30) matchesDate = false
    }

    return matchesSearch && matchesType && matchesDate
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const exportToCSV = () => {
    const headers = ["Date", "Type", "Amount", "Description", "From/To", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [t.date, t.type, t.amount, `"${t.description}"`, `"${t.from || t.to || ""}"`, t.status].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transaction-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Banknote className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Profile</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {user.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {user.phone || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> {user.address || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Account Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Account Type:</span>
                    <Badge variant="outline" className="ml-2">
                      {user.accountType}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-medium">Current Balance:</span>
                    <span
                      className={`ml-2 font-bold text-lg ${user.balance < 100 ? "text-red-600" : "text-green-600"}`}
                    >
                      KES {user.balance.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Account Status:</span>
                    <Badge variant={user.balance < 100 ? "destructive" : "default"} className="ml-2">
                      {user.balance < 100 ? "Low Balance" : "Active"}
                    </Badge>
                  </p>
                </div>
                <Button className="mt-4" onClick={() => setShowTransferModal(true)}>
                  Transfer Money
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Complete history of all your transactions</CardDescription>
              </div>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterType} onValueChange={(value: "all" | "credit" | "debit") => setFilterType(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={(value: "all" | "week" | "month") => setDateRange(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>From/To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600 mr-2" />
                        )}
                        <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.from || transaction.to || "-"}</TableCell>
                    <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "credit" ? "+" : "-"}KES {transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}{" "}
                transactions
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransferModal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} />
    </div>
  )
}
