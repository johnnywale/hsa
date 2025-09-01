// app/hooks/useAuth.ts
"use client"
import { useEffect, useState } from "react"

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem("token")
    setToken(t)
    setLoading(false)
  }, [])

  return { token, loading }
}
