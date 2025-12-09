"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const store = getStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!store.currentUser || !store.currentUser.isAdmin) {
      router.push("/")
    } else {
      setLoading(false)
    }
  }, [store.currentUser, router])

  if (!store.currentUser || !store.currentUser.isAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const totalHotelBookings = store.hotelBookings.length
  const totalRestaurantBookings = store.restaurantBookings.length
  const confirmedHotelBookings = store.hotelBookings.filter((b) => b.status === "confirmed").length
  const confirmedRestaurantBookings = store.restaurantBookings.filter((b) => b.status === "confirmed").length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Hotel Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalHotelBookings}</p>
              <p className="text-sm text-muted-foreground">{confirmedHotelBookings} confirmed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Restaurant Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalRestaurantBookings}</p>
              <p className="text-sm text-muted-foreground">{confirmedRestaurantBookings} confirmed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${store.hotelBookings.reduce((sum, b) => sum + b.totalPrice, 0)}</p>
              <p className="text-sm text-muted-foreground">from hotels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Set([...store.hotelBookings, ...store.restaurantBookings].map((b: any) => b.userId)).size + 1}
              </p>
              <p className="text-sm text-muted-foreground">registered</p>
            </CardContent>
          </Card>
        </div>

        {/* All Bookings */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>All Hotel Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {store.hotelBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Booking ID</th>
                        <th className="text-left py-2">User ID</th>
                        <th className="text-left py-2">Check-in</th>
                        <th className="text-left py-2">Rooms</th>
                        <th className="text-left py-2">Total</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.hotelBookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-2">{booking.id.slice(0, 8)}</td>
                          <td className="py-2">{booking.userId.slice(0, 8)}</td>
                          <td className="py-2">{booking.checkInDate}</td>
                          <td className="py-2">{booking.numberOfRooms}</td>
                          <td className="py-2">${booking.totalPrice}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No bookings yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Restaurant Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {store.restaurantBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Booking ID</th>
                        <th className="text-left py-2">User ID</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Time</th>
                        <th className="text-left py-2">Party Size</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.restaurantBookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-2">{booking.id.slice(0, 8)}</td>
                          <td className="py-2">{booking.userId.slice(0, 8)}</td>
                          <td className="py-2">{booking.date}</td>
                          <td className="py-2">{booking.time}</td>
                          <td className="py-2">{booking.numberOfPeople}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No bookings yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
