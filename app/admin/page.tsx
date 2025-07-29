"use client"

import { useAuth } from "../../components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { LogOut, Search, Users, CreditCard, TrendingUp, Banknote, Eye } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  balance: number
  accountType: "Savings" | "Checking"
  isAdmin: boolean
  address?: string
  phone?: string
}

interface Transaction {
  id: string
  userId: string
  userName: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@bank.com",
    balance: 50000,
    accountType: "Checking",
    isAdmin: true,
    address: "123 Admin St, Nairobi",
    phone: "+254700000001",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    balance: 75,
    accountType: "Savings",
    isAdmin: false,
    address: "456 User Ave, Mombasa",
    phone: "+254700000002",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    balance: 15000,
    accountType: "Checking",
    isAdmin: false,
    address: "789 Client Rd, Kisumu",
    phone: "+254700000003",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    balance: 50,
    accountType: "Savings",
    isAdmin: false,
    address: "321 Customer Blvd, Eldoret",
    phone: "+254700000004",
  },
]

const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "2",
    userName: "Jane Smith",
    type: "credit",
    amount: 5000,
    description: "Salary deposit",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    userId: "3",
    userName: "Bob Johnson",
    type: "debit",
    amount: 1200,
    description: "ATM withdrawal",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    userId: "4",
    userName: "Alice Brown",
    type: "credit",
    amount: 2000,
    description: "Transfer received",
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: "4",
    userId: "2",
    userName: "Jane Smith",
    type: "debit",
    amount: 800,
    description: "Online purchase",
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: "5",
    userId: "3",
    userName: "Bob Johnson",
    type: "debit",
    amount: 300,
    description: "Restaurant payment",
    date: "2024-01-11",
    status: "failed",
  },
]

export default function AdminPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"users" | "transactions">("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!user.isAdmin) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || !user.isAdmin) {
    return null
  }

  const filteredUsers = mockUsers.filter(
    (u) =>
      !u.isAdmin &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || t.type === filterType
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalUsers = mockUsers.filter((u) => !u.isAdmin).length
  const lowBalanceUsers = mockUsers.filter((u) => !u.isAdmin && u.balance < 100).length
  const totalTransactions = mockTransactions.length
  const totalVolume = mockTransactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Banknote className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">BankDash Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">{lowBalanceUsers} with low balance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalVolume.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Balance Alerts</CardTitle>
              <Badge variant="destructive">{lowBalanceUsers}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowBalanceUsers}</div>
              <p className="text-xs text-muted-foreground">Below KES 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")}>
            Users
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "outline"}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={activeTab === "users" ? "Search users..." : "Search transactions..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === "transactions" && (
            <Select value={filterType} onValueChange={(value: "all" | "credit" | "debit") => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Content */}
        {activeTab === "users" ? (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all user accounts and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className={user.balance < 100 ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.accountType}</Badge>
                      </TableCell>
                      <TableCell className={user.balance < 100 ? "text-red-600 font-semibold" : ""}>
                        KES {user.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.balance < 100 ? "destructive" : "default"}>
                          {user.balance < 100 ? "Low Balance" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/users/${user.id}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All user transactions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.userName}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                        {transaction.type === "credit" ? "+" : "-"}KES {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
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
              <div className="flex items-center justify-between mt-4">
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
        )}
      </div>
    </div>
  )
}
