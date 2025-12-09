"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { ArrowLeft, Star, Wifi, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addHotelBooking, getStore, getReviewsForHotel } from "@/lib/store"
import { ReviewsSection } from "@/components/reviews-section"
import type { HotelBooking, Hotel } from "@/lib/types"

export default function HotelDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const store = getStore()
  const reviews = getReviewsForHotel(params.id)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [rooms, setRooms] = useState(1)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch("/api/data/hotels")
        const hotels = await response.json()
        const found = hotels.find((h: Hotel) => h.id === params.id)
        setHotel(found || null)
      } catch (error) {
        console.error("[v0] Error fetching hotel:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
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

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Hotel not found</p>
          <Link href="/hotels">
            <Button className="mt-4">Back to Hotels</Button>
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

    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates")
      return
    }

    const booking: HotelBooking = {
      id: `booking-${Date.now()}`,
      userId: store.currentUser.id,
      hotelId: hotel.id,
      roomId: `room-${Date.now()}`,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfRooms: rooms,
      totalPrice: hotel.pricePerNight * rooms * 3,
      status: "confirmed",
      createdAt: new Date(),
    }

    await addHotelBooking(booking)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/hotels">
          <Button variant="outline" className="mb-6 gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <img
              src={hotel.image || "/placeholder.svg"}
              alt={hotel.name}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />

            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{hotel.name}</h1>
                  <p className="text-lg text-muted-foreground">{hotel.location}</p>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-bold">{hotel.rating}</span>
                  <span className="text-muted-foreground">({hotel.reviews} reviews)</span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-6">{hotel.description}</p>

              <div>
                <h3 className="text-xl font-bold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-muted-foreground">
                      <Wifi className="w-4 h-4" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ReviewsSection hotelId={params.id} reviews={reviews} />
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-2xl">
                  ${hotel.pricePerNight}
                  <span className="text-sm font-normal text-muted-foreground">/night</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Rooms</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={rooms}
                    onChange={(e) => setRooms(Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${hotel.pricePerNight * rooms}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${hotel.pricePerNight * rooms * 3}</span>
                  </div>
                </div>

                <Button onClick={handleBooking} className="w-full">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
