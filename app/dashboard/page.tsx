"use client"

import { useAuth } from "../../components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Eye,
  LogOut,
  User,
  Banknote,
} from "lucide-react"
import { TransferModal } from "../../components/transfer-modal"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  from?: string
  to?: string
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showTransferModal, setShowTransferModal] = useState(false)

  const [transactions] = useState<Transaction[]>([
    { id: "1", type: "credit", amount: 5000, description: "Salary deposit", date: "2024-01-15", from: "Employer" },
    { id: "2", type: "debit", amount: 1200, description: "Grocery shopping", date: "2024-01-14", to: "SuperMart" },
    { id: "3", type: "credit", amount: 2000, description: "Transfer from John", date: "2024-01-13", from: "John Doe" },
    { id: "4", type: "debit", amount: 800, description: "Utility bills", date: "2024-01-12", to: "KPLC" },
    { id: "5", type: "debit", amount: 300, description: "Coffee shop", date: "2024-01-11", to: "Java House" },
  ])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.isAdmin) {
      router.push("/admin")
    }
  }, [user, router])

  if (!user || user.isAdmin) return null

  const recentTransactions = transactions.slice(0, 5)
  const totalDeposits = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)
  const pendingTransactions = 2

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Spending",
        data: [1200, 800, 1500, 600, 900, 1100, 700],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Weekly Spending Trend" },
    },
    scales: { y: { beginAtZero: true } },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Banknote className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">BankDash</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.first_name} {user.last_name}
              </span>
              <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
                <User className="h-4 w-4 mr-2" /> Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Summary */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Account Summary</CardTitle>
              <CardDescription>Your current account overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-3xl font-bold text-green-600">
                    KES {user.balance.toLocaleString()}
                  </p>
                  <Badge
                    variant={user.balance < 100 ? "destructive" : "secondary"}
                    className="mt-2"
                  >
                    {user.accountType} Account
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowTransferModal(true)}>
                    <Send className="h-4 w-4 mr-2" /> Transfer Money
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/profile")}>
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                KES {totalDeposits.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                KES {totalWithdrawals.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
              <Badge variant="outline">{pendingTransactions}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTransactions}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your last 5 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}KES{" "}
                      {transaction.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/profile")}
              >
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Spending Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Your weekly spending pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>
      </div>

      <TransferModal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} />
    </div>
  )
}
