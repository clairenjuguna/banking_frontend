"use client"

import { useAuth } from "../../../components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Banknote } from "lucide-react"

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
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  from?: string
  to?: string
  status: "completed" | "pending" | "failed"
}

const mockUsers: User[] = [
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
    description: "ATM withdrawal",
    date: "2024-01-14",
    to: "ATM",
    status: "completed",
  },
  {
    id: "3",
    type: "credit",
    amount: 2000,
    description: "Transfer received",
    date: "2024-01-13",
    from: "John Doe",
    status: "completed",
  },
  {
    id: "4",
    type: "debit",
    amount: 800,
    description: "Online purchase",
    date: "2024-01-12",
    to: "Amazon",
    status: "completed",
  },
  {
    id: "5",
    type: "debit",
    amount: 300,
    description: "Restaurant payment",
    date: "2024-01-11",
    to: "Restaurant",
    status: "completed",
  },
]

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!user.isAdmin) {
      router.push("/dashboard")
    } else {
      const foundUser = mockUsers.find((u) => u.id === params.id)
      if (foundUser) {
        setSelectedUser(foundUser)
        setUserTransactions(mockTransactions)
      } else {
        router.push("/admin")
      }
    }
  }, [user, router, params.id])

  if (!user || !user.isAdmin || !selectedUser) {
    return null
  }

  const totalPages = Math.ceil(userTransactions.length / itemsPerPage)
  const paginatedTransactions = userTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <Banknote className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">User Details</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Complete details for {selectedUser.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {selectedUser.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {selectedUser.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {selectedUser.phone || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> {selectedUser.address || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Account Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Account Type:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedUser.accountType}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-medium">Current Balance:</span>
                    <span
                      className={`ml-2 font-bold text-lg ${selectedUser.balance < 100 ? "text-red-600" : "text-green-600"}`}
                    >
                      KES {selectedUser.balance.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Account Status:</span>
                    <Badge variant={selectedUser.balance < 100 ? "destructive" : "default"} className="ml-2">
                      {selectedUser.balance < 100 ? "Low Balance" : "Active"}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All transactions for {selectedUser.name}</CardDescription>
          </CardHeader>
          <CardContent>
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
                {Math.min(currentPage * itemsPerPage, userTransactions.length)} of {userTransactions.length}{" "}
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
    </div>
  )
}
