"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStore, cancelHotelBooking, cancelRestaurantBooking } from "@/lib/store"
import { useEffect, useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import type { Hotel, Restaurant } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const store = getStore()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!store.currentUser) {
      router.push("/auth/login")
      return
    }

    const fetchData = async () => {
      try {
        const [hotelsRes, restaurantsRes] = await Promise.all([
          fetch("/api/data/hotels"),
          fetch("/api/data/restaurants"),
        ])
        const hotelsData = await hotelsRes.json()
        const restaurantsData = await restaurantsRes.json()
        setHotels(hotelsData)
        setRestaurants(restaurantsData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [store.currentUser, router])

  if (!store.currentUser) {
    return null
  }

  const handleCancelHotelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      await cancelHotelBooking(bookingId)
    }
  }

  const handleCancelRestaurantBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      await cancelRestaurantBooking(bookingId)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {store.currentUser.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {store.currentUser.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {store.currentUser.phone}
              </p>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Hotel Bookings */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Hotel Bookings</h2>
              {store.hotelBookings.length > 0 ? (
                <div className="space-y-4">
                  {store.hotelBookings.map((booking) => {
                    const hotel = hotels.find((h) => h.id === booking.hotelId)
                    return (
                      <Card key={booking.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{hotel?.name}</h3>
                              <p className="text-muted-foreground">Check-in: {booking.checkInDate}</p>
                              <p className="text-muted-foreground">Check-out: {booking.checkOutDate}</p>
                              <p className="text-muted-foreground">Rooms: {booking.numberOfRooms}</p>
                              <p className="font-semibold mt-2">Total: ${booking.totalPrice}</p>
                              <span
                                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                            {booking.status === "confirmed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelHotelBooking(booking.id)}
                                className="gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      No hotel bookings yet.{" "}
                      <a href="/hotels" className="text-primary hover:underline">
                        Book a hotel
                      </a>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Restaurant Bookings */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Restaurant Bookings</h2>
              {store.restaurantBookings.length > 0 ? (
                <div className="space-y-4">
                  {store.restaurantBookings.map((booking) => {
                    const restaurant = restaurants.find((r) => r.id === booking.restaurantId)
                    return (
                      <Card key={booking.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{restaurant?.name}</h3>
                              <p className="text-muted-foreground">Date: {booking.date}</p>
                              <p className="text-muted-foreground">Time: {booking.time}</p>
                              <p className="text-muted-foreground">Party Size: {booking.numberOfPeople} people</p>
                              {booking.specialRequests && (
                                <p className="text-muted-foreground">Special Requests: {booking.specialRequests}</p>
                              )}
                              <span
                                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                            {booking.status === "confirmed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelRestaurantBooking(booking.id)}
                                className="gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      No restaurant bookings yet.{" "}
                      <a href="/restaurants" className="text-primary hover:underline">
                        Book a restaurant
                      </a>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
