// app/components/ProtectedRoute.tsx
"use client"
import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { token, loading } = useAuth()

  useEffect(() => {
    if (!loading && !token) {
      toast.error("Please login first")
      router.replace("/examples/authentication/login")
    }
  }, [loading, token, router])

  if (loading || !token) return null // or a loading spinner

  return <>{children}</>
}
