"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const store = getStore()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (!store.currentUser) {
      router.push("/auth/login")
    } else {
      setName(store.currentUser.name)
      setPhone(store.currentUser.phone)
    }
  }, [store.currentUser, router])

  if (!store.currentUser) {
    return null
  }

  const handleSave = () => {
    if (store.currentUser) {
      store.currentUser.name = name
      store.currentUser.phone = phone
      setIsEditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Profile Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input value={store.currentUser.email} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Type</label>
              <Input value={store.currentUser.isAdmin ? "Admin" : "User"} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Member Since</label>
              <Input value={new Date(store.currentUser.createdAt).toLocaleDateString()} disabled />
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
