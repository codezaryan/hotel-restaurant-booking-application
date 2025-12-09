"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { ArrowLeft, Star, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addRestaurantBooking, getStore, getReviewsForRestaurant } from "@/lib/store"
import { ReviewsSection } from "@/components/reviews-section"
import type { RestaurantBooking, Restaurant } from "@/lib/types"

export default function RestaurantDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const store = getStore()
  const reviews = getReviewsForRestaurant(params.id)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [people, setPeople] = useState(2)
  const [requests, setRequests] = useState("")
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch("/api/data/restaurants")
        const restaurants = await response.json()
        const found = restaurants.find((r: Restaurant) => r.id === params.id)
        setRestaurant(found || null)
      } catch (error) {
        console.error("[v0] Error fetching restaurant:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurant()
  }, [params.id])

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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Restaurant not found</p>
          <Link href="/restaurants">
            <Button className="mt-4">Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleBooking = async () => {
    if (!store.currentUser) {
      router.push("/auth/login")
      return
    }

    if (!date || !time) {
      alert("Please select date and time")
      return
    }

    const booking: RestaurantBooking = {
      id: `booking-${Date.now()}`,
      userId: store.currentUser.id,
      restaurantId: restaurant.id,
      date,
      time,
      numberOfPeople: people,
      specialRequests: requests,
      status: "confirmed",
      createdAt: new Date(),
    }

    await addRestaurantBooking(booking)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/restaurants">
          <Button variant="outline" className="mb-6 gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />

            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {restaurant.cuisine} • {restaurant.priceRange}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-bold">{restaurant.rating}</span>
                  <span className="text-muted-foreground">({restaurant.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Clock className="w-5 h-5" />
                {restaurant.workingHours}
              </div>

              <p className="text-lg text-muted-foreground">{restaurant.description}</p>
            </div>

            <ReviewsSection restaurantId={params.id} reviews={reviews} />
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Reserve a Table</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of People</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={people}
                    onChange={(e) => setPeople(Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests</label>
                  <textarea
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    placeholder="Any dietary restrictions or preferences?"
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm"
                  />
                </div>

                <Button onClick={handleBooking} className="w-full">
                  Reserve Table
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
