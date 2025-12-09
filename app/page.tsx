"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search, MapPin, Users } from "lucide-react"

export default function Home() {
  const [hotelLocation, setHotelLocation] = useState("")
  const [restaurantLocation, setRestaurantLocation] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Travel & Dine with Confidence</h1>
          <p className="text-xl mb-8 text-balance">Book your perfect hotel and restaurant with ease</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hotel Search */}
            <div className="bg-background rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Find Hotels
              </h2>
              <Input
                placeholder="Enter location..."
                value={hotelLocation}
                onChange={(e) => setHotelLocation(e.target.value)}
                className="mb-4"
              />
              <Link href="/hotels">
                <Button className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Search Hotels
                </Button>
              </Link>
            </div>

            {/* Restaurant Search */}
            <div className="bg-background rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Find Restaurants
              </h2>
              <Input
                placeholder="Enter cuisine or location..."
                value={restaurantLocation}
                onChange={(e) => setRestaurantLocation(e.target.value)}
                className="mb-4"
              />
              <Link href="/restaurants">
                <Button className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Search Restaurants
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Best Prices", desc: "Guaranteed lowest rates" },
              { title: "Verified Reviews", desc: "Honest guest feedback" },
              { title: "Easy Booking", desc: "Simple and secure process" },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-lg bg-card border">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
