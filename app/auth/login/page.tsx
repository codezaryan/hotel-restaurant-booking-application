"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { setCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/data/users")
      const users = await response.json()
      const foundUser = users.find((u: User) => u.email === email)

      if (!foundUser) {
        setError("User not found. Please create an account first.")
        return
      }

      // Demo validation - in production use secure password hashing
      if (foundUser.password !== password) {
        setError("Invalid password")
        return
      }

      setCurrentUser(foundUser)
      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred during login")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>

            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
              <p className="text-xs text-muted-foreground">Email: john@example.com</p>
              <p className="text-xs text-muted-foreground">Password: hashedpassword123</p>
              <p className="text-xs text-muted-foreground mt-2">Admin: admin@example.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
