"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

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

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "isAdmin">) => Promise<boolean>
  logout: () => void
  updateBalance: (userId: string, newBalance: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users data
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    const foundUser = users.find((u) => u.email === email)
    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const register = async (userData: Omit<User, "id" | "isAdmin">): Promise<boolean> => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      isAdmin: false,
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateBalance = (userId: string, newBalance: number) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u))
    setUsers(updatedUsers)

    if (user && user.id === userId) {
      const updatedUser = { ...user, balance: newBalance }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateBalance }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
