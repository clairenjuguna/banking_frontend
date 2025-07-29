"use client"

import { useAuth } from "../components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
