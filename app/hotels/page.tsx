"use client"

import { Header } from "@/components/header"
import { HotelCard } from "@/components/hotel-card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import type { Hotel } from "@/lib/types"

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/data/hotels")
        const data = await response.json()
        setHotels(data)
      } catch (error) {
        console.error("[v0] Error fetching hotels:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && hotel.pricePerNight <= 150) ||
      (priceFilter === "mid" && hotel.pricePerNight > 150 && hotel.pricePerNight <= 250) ||
      (priceFilter === "luxury" && hotel.pricePerNight > 250)

    return matchesSearch && matchesPrice
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">Find Your Perfect Hotel</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="all">All Prices</option>
            <option value="budget">Budget (&lt;$150)</option>
            <option value="mid">Mid-range ($150-$250)</option>
            <option value="luxury">Luxury (&gt;$250)</option>
          </select>
        </div>

        {/* Hotel Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredHotels.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No hotels found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
