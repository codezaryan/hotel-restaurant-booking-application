"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useState, useEffect } from "react"
import { Search, MapPin, Users, Star, Wifi, Car, Utensils, Coffee, Heart } from "lucide-react"
import type { Hotel, Restaurant } from "@/lib/types"

export default function Home() {
  const [hotelLocation, setHotelLocation] = useState("")
  const [restaurantLocation, setRestaurantLocation] = useState("")
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([])
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hotels
        const hotelsResponse = await fetch("/api/data/hotels")
        const hotelsData = await hotelsResponse.json()
        setFeaturedHotels(hotelsData.slice(0, 4)) // Take first 4 hotels

        // Fetch restaurants
        const restaurantsResponse = await fetch("/api/data/restaurants")
        const restaurantsData = await restaurantsResponse.json()
        setPopularRestaurants(restaurantsData.slice(0, 4)) // Take first 4 restaurants
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Mock data for destinations
  const destinations = [
    { name: "Paris", image: "🗼", description: "City of Light" },
    { name: "Tokyo", image: "🏯", description: "Modern meets traditional" },
    { name: "Bali", image: "🏝️", description: "Tropical paradise" },
    { name: "New York", image: "🗽", description: "The Big Apple" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Travel & Dine with Confidence</h1>
          <p className="text-xl mb-8 text-balance">Book your perfect hotel and restaurant with ease</p>

          {/* Quick Search */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Find Hotels</span>
              </div>
              <Input
                placeholder="Where are you going?"
                value={hotelLocation}
                onChange={(e) => setHotelLocation(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 mb-2"
              />
              <Link href="/hotels">
                <Button variant="secondary" className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Search Hotels
                </Button>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="w-5 h-5" />
                <span className="font-semibold">Find Restaurants</span>
              </div>
              <Input
                placeholder="Cuisine or location..."
                value={restaurantLocation}
                onChange={(e) => setRestaurantLocation(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 mb-2"
              />
              <Link href="/restaurants">
                <Button variant="secondary" className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Search Restaurants
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Hotels</h2>
            <Link href="/hotels">
              <Button variant="outline">View All Hotels</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {featuredHotels.map((hotel) => (
                  <CarouselItem key={hotel.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {hotel.rating}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{hotel.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {hotel.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{hotel.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.amenities.slice(0, 3).map((amenity: string) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotel.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="text-2xl font-bold">${hotel.pricePerNight}</span>
                            <span className="text-muted-foreground">/night</span>
                          </div>
                          <Link href={`/hotels/${hotel.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Popular Restaurants</h2>
            <Link href="/restaurants">
              <Button variant="outline">View All Restaurants</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {restaurant.rating}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{restaurant.cuisine}</span>
                      <span>•</span>
                      <span>{restaurant.location}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{restaurant.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {restaurant.cuisine}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{restaurant.priceRange}</span>
                      <Link href={`/restaurants/${restaurant.id}`}>
                        <Button size="sm" variant="outline">Reserve</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Card key={destination.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{destination.image}</div>
                  <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-muted-foreground">{destination.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Best Prices", desc: "Guaranteed lowest rates with exclusive deals" },
              { icon: Star, title: "Verified Reviews", desc: "Honest guest feedback and ratings" },
              { icon: Search, title: "Easy Booking", desc: "Simple and secure booking process" },
            ].map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
