"use client"

import { Header } from "@/components/header"
import { RestaurantCard } from "@/components/restaurant-card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import type { Restaurant } from "@/lib/types"

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState<string>("all")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/data/restaurants")
        const data = await response.json()
        setRestaurants(data)
      } catch (error) {
        console.error("[v0] Error fetching restaurants:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  const cuisines = ["all", ...new Set(restaurants.map((r) => r.cuisine))]

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCuisine = cuisineFilter === "all" || restaurant.cuisine === cuisineFilter

    return matchesSearch && matchesCuisine
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Find Your Perfect Restaurant</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background text-foreground"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine === "all" ? "All Cuisines" : cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
